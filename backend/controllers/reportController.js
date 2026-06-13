import Zone from '../models/Zone.js';
import Route from '../models/Route.js';
import { generateClusters } from '../services/clusterService.js';

// @desc    Get report stats
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const [totalZones, totalRoutes] = await Promise.all([Zone.countDocuments(), Route.countDocuments({ status: 'active' })]);

    const { clusters, stats } = await generateClusters();

    const sortedBySizeDesc = [...clusters].sort((a, b) => b.size - a.size);
    const sortedBySizeAsc = [...clusters].sort((a, b) => a.size - b.size);

    const largestCluster = sortedBySizeDesc[0] || null;
    const smallestCluster = sortedBySizeAsc.find((c) => !c.isIsolated) || sortedBySizeAsc[0] || null;

    res.status(200).json({
      success: true,
      data: {
        totalZones,
        totalRoutes,
        totalClusters: stats.total,
        isolatedZones: stats.isolated,
        connectedClusters: stats.connected,
        totalSystemCouriers: stats.totalSystemCouriers,
        totalSystemOrders: stats.totalSystemOrders,
        systemRatio: stats.totalSystemCouriers > 0 ? (stats.totalSystemOrders / stats.totalSystemCouriers).toFixed(2) : 0,
        largestCluster,
        smallestCluster,
        allClusters: clusters,
        clusterSizeDistribution: clusters.map((c) => ({
          name: c.isIsolated ? `Isolated (${c.zones[0]?.name})` : `Cluster ${c.clusterId}`,
          size: c.size,
          isIsolated: c.isIsolated,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get Zone Management Report
// @route   GET /api/reports/zone-management
// @access  Private
const getZoneManagementReport = async (req, res) => {
  try {
    const { clusters, stats } = await generateClusters();
    
    const zoneMetrics = clusters.flatMap((c) => c.zones.map((z) => ({
      zoneId: z.zoneId,
      name: z.name,
      couriers: z.courierCount,
      orders: z.activeOrders,
      clusterId: c.clusterId,
      isImbalanced: (z.courierCount === 0 && z.activeOrders > 0) || (z.courierCount > 0 && z.activeOrders / z.courierCount > 20)
    })));

    const clusterTrends = clusters.map(c => ({
      name: c.isIsolated ? `Isolated (${c.zones[0]?.name})` : `Cluster ${c.clusterId}`,
      volume: c.totalOrders,
      couriers: c.totalCouriers
    }));

    const imbalanceCount = zoneMetrics.filter(z => z.isImbalanced).length;
    const avgLoadImbalance = zoneMetrics.length > 0 ? (imbalanceCount / zoneMetrics.length * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalActiveZones: stats.totalZones,
        totalCouriers: stats.totalSystemCouriers,
        averageLoadImbalancePercentage: avgLoadImbalance,
        zoneMetrics,
        clusterTrends,
        equitableAllocation: clusters.map(c => ({
          clusterId: c.clusterId,
          couriersPerZone: (c.totalCouriers / c.size).toFixed(1),
          avgOrderLoad: (c.totalOrders / c.size).toFixed(1),
          varianceIndicator: c.isImbalanced ? 'high' : 'normal'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export { getReports, getZoneManagementReport };
