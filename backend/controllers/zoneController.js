import Zone from '../models/Zone.js';
import Route from '../models/Route.js';

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
    const { name, city, zoneCode } = req.body;

    if (!name || !city || !zoneCode) {
      return res.status(400).json({ success: false, message: 'Please provide name, city, and zoneCode' });
    }

    const existing = await Zone.findOne({ zoneCode: zoneCode.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Zone code already exists' });
    }

    const zone = await Zone.create({ name, city, zoneCode });
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
    res.status(200).json({ success: true, message: 'Zone and associated routes deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export { getZones, addZone, deleteZone };
