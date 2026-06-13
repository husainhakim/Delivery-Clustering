import Zone from '../models/Zone.js';
import Route from '../models/Route.js';
import loggerService from '../services/loggerService.js';

// @desc    Get all zones
// @route   GET /api/zones
// @access  Private
const getZones = async (req, res) => {
  try {
    const zones = await Zone.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: zones.length, data: zones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add a zone
// @route   POST /api/zones
// @access  Private
const addZone = async (req, res) => {
  try {
    const { name, city, zoneCode, courierCount = 0, activeOrders = 0 } = req.body;

    if (!name || !city || !zoneCode) {
      return res.status(400).json({ success: false, message: 'Please provide name, city, and zoneCode' });
    }

    const existing = await Zone.findOne({ zoneCode: zoneCode.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Zone code already exists' });
    }

    const zone = await Zone.create({ name, city, zoneCode, courierCount, activeOrders });

    loggerService.logEvent('ZONE_CREATED', { zoneId: zone._id, name, city, zoneCode, courierCount, activeOrders });

    res.status(201).json({ success: true, message: 'Zone added successfully', data: zone });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a zone
// @route   DELETE /api/zones/:id
// @access  Private
const deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    // Also delete all routes involving this zone
    await Route.deleteMany({
      $or: [{ sourceZone: req.params.id }, { destinationZone: req.params.id }],
    });

    await Zone.findByIdAndDelete(req.params.id);

    loggerService.logEvent('ZONE_DELETED', { zoneId: req.params.id, name: zone.name, zoneCode: zone.zoneCode });

    res.status(200).json({ success: true, message: 'Zone and associated routes deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Split a zone cluster
// @route   POST /api/zones/split
// @access  Private
import { splitCluster } from '../services/clusterService.js';
const splitZoneCluster = async (req, res) => {
  try {
    const { routeId, reason } = req.body;
    if (!routeId) {
      return res.status(400).json({ success: false, message: 'routeId is required' });
    }

    const result = await splitCluster(routeId, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Split operation failed', error: error.message });
  }
};

import ZoneOperationLog from '../models/ZoneOperationLog.js';

// @desc    Get operation logs
// @route   GET /api/zones/operations
// @access  Private
const getOperationLogs = async (req, res) => {
  try {
    const logs = await ZoneOperationLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export { getZones, addZone, deleteZone, splitZoneCluster, getOperationLogs };
