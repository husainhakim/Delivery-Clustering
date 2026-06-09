import Zone from '../models/Zone.js';
import Route from '../models/Route.js';
import UnionFind from '../algorithms/unionFind.js';

/**
 * Orchestrates the Union-Find algorithm over DB data.
 */
const generateClusters = async () => {
  const zones = await Zone.find().lean();
  const routes = await Route.find().lean();

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

  const enrichedClusters = rawClusters.map((cluster) => ({
    clusterId: cluster.clusterId,
    size: cluster.size,
    isIsolated: cluster.isIsolated,
    zones: cluster.members.map((idx) => ({
      _id: zones[idx]._id,
      name: zones[idx].name,
      city: zones[idx].city,
      zoneCode: zones[idx].zoneCode,
    })),
  }));

  const isolatedCount = enrichedClusters.filter((c) => c.isIsolated).length;

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
    },
  };
};

export { generateClusters };
