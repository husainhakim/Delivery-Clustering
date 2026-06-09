import { generateClusters } from '../services/clusterService.js';

// In-memory cache for last generated clusters
let lastClusterResult = null;

// @desc    Generate clusters using Union-Find
// @route   POST /api/clusters/generate
// @access  Private
const generate = async (req, res) => {
  try {
    const result = await generateClusters();
    lastClusterResult = { ...result, generatedAt: new Date() };
    res.status(200).json({ success: true, ...lastClusterResult });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cluster generation failed', error: error.message });
  }
};

// @desc    Get last generated cluster result
// @route   GET /api/clusters
// @access  Private
const getClusters = async (req, res) => {
  try {
    if (!lastClusterResult) {
      const result = await generateClusters();
      lastClusterResult = { ...result, generatedAt: new Date() };
    }
    res.status(200).json({ success: true, ...lastClusterResult });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export { generate, getClusters };
