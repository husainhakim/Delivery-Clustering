import Zone from '../models/Zone.js';
import Route from '../models/Route.js';
import { generateClusters } from '../services/clusterService.js';

// @desc    Get report stats
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const [totalZones, totalRoutes] = await Promise.all([Zone.countDocuments(), Route.countDocuments()]);

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

export { getReports };
