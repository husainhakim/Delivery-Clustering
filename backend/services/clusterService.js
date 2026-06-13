import Zone from '../models/Zone.js';
import Route from '../models/Route.js';
import UnionFind from '../algorithms/unionFind.js';
import { operationLogger } from './operationLogger.js';

/**
 * Orchestrates the Union-Find algorithm over DB data.
 */
const generateClusters = async () => {
  const zones = await Zone.find().lean();
  const routes = await Route.find({ status: 'active' }).lean();

  if (zones.length === 0) {
    return { clusters: [], stats: { total: 0, isolated: 0, totalZones: 0, totalRoutes: 0 } };
  }

  const zoneIndexMap = {};
  zones.forEach((zone, index) => {
    zoneIndexMap[zone._id.toString()] = index;
  });

  const uf = new UnionFind(zones.length);

  routes.forEach((route) => {
    const srcIdx = zoneIndexMap[route.sourceZone.toString()];
    const dstIdx = zoneIndexMap[route.destinationZone.toString()];
    if (srcIdx !== undefined && dstIdx !== undefined) {
      uf.union(srcIdx, dstIdx);
    }
  });

  const rawClusters = uf.getClusters();

  const bulkOps = [];

  const enrichedClusters = rawClusters.map((cluster) => {
    let totalCouriers = 0;
    let totalOrders = 0;
    
    // Determine root zoneId
    const rootZone = zones[cluster.root];
    const parentZoneIdStr = rootZone ? rootZone.zoneId : null;

    const mappedZones = cluster.members.map((idx) => {
      const z = zones[idx];
      totalCouriers += (z.courierIds ? z.courierIds.length : z.courierCount || 0);
      totalOrders += (z.activeOrders || 0);
      
      bulkOps.push({
        updateOne: {
          filter: { _id: z._id },
          update: { $set: { parentZoneId: parentZoneIdStr } }
        }
      });

      return {
        _id: z._id,
        zoneId: z.zoneId,
        name: z.name,
        city: z.city,
        coordinates: z.coordinates,
        status: z.status,
        courierCount: z.courierIds ? z.courierIds.length : z.courierCount || 0,
        activeOrders: z.activeOrders || 0,
        parentZoneId: parentZoneIdStr,
      };
    });

    const courierToOrderRatio = totalCouriers > 0 ? (totalOrders / totalCouriers).toFixed(2) : (totalOrders > 0 ? 'Infinity' : 0);
    const isImbalanced = (totalCouriers === 0 && totalOrders > 0) || (totalCouriers > 0 && totalOrders / totalCouriers > 20);

    return {
      clusterId: cluster.clusterId,
      size: cluster.size,
      isIsolated: cluster.isIsolated,
      rootZoneId: parentZoneIdStr,
      totalCouriers,
      totalOrders,
      courierToOrderRatio,
      isImbalanced,
      zones: mappedZones,
    };
  });

  if (bulkOps.length > 0) {
    await Zone.bulkWrite(bulkOps);
  }

  const isolatedCount = enrichedClusters.filter((c) => c.isIsolated).length;
  const totalSystemCouriers = enrichedClusters.reduce((acc, c) => acc + c.totalCouriers, 0);
  const totalSystemOrders = enrichedClusters.reduce((acc, c) => acc + c.totalOrders, 0);

  return {
    clusters: enrichedClusters,
    stats: {
      total: enrichedClusters.length,
      isolated: isolatedCount,
      connected: enrichedClusters.length - isolatedCount,
      totalZones: zones.length,
      totalRoutes: routes.length,
      largestClusterSize: enrichedClusters[0]?.size || 0,
      smallestClusterSize: enrichedClusters[enrichedClusters.length - 1]?.size || 0,
      totalSystemCouriers,
      totalSystemOrders,
    },
  };
};

/**
 * Splits a cluster by soft-deleting a route and re-running clustering.
 */
const splitCluster = async (routeId, reason) => {
  const route = await Route.findById(routeId).populate('sourceZone destinationZone');
  if (!route || route.status === 'disrupted') {
    throw new Error('Route not found or already disrupted');
  }

  // Get current clusters before split to compare
  const beforeClustersData = await generateClusters();
  const beforeClusters = beforeClustersData.clusters;

  // Soft delete route
  route.status = 'disrupted';
  await route.save();

  // Update status of zones if needed (optional based on spec, but let's say the route is disrupted, not the zone itself, although spec says zone status disrupted. We will just disrupt the route for now as per instructions).
  
  // Re-run clustering
  const afterClustersData = await generateClusters();
  const afterClusters = afterClustersData.clusters;
  
  // Log the operation
  operationLogger.log({
    operationType: 'SPLIT',
    reason: reason || 'Weather disruption',
    affectedZones: [route.sourceZone.zoneId, route.destinationZone.zoneId],
    details: {
      routeId: route._id,
      source: route.sourceZone.zoneId,
      destination: route.destinationZone.zoneId
    }
  });

  return {
    success: true,
    message: 'Route disrupted and clusters recomputed',
    affectedRoute: route,
    clusters: afterClusters
  };
};

export { generateClusters, splitCluster };
