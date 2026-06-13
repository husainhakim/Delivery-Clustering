import Route from '../models/Route.js';
import Zone from '../models/Zone.js';
import loggerService from '../services/loggerService.js';

// @desc    Get all routes
// @route   GET /api/routes
// @access  Private
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate('sourceZone', 'name city zoneCode')
      .populate('destinationZone', 'name city zoneCode')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add a route
// @route   POST /api/routes
// @access  Private
const addRoute = async (req, res) => {
  try {
    const { sourceZone, destinationZone } = req.body;

    if (!sourceZone || !destinationZone) {
      return res.status(400).json({ success: false, message: 'Source and destination zones are required' });
    }

    if (sourceZone === destinationZone) {
      return res.status(400).json({ success: false, message: 'Source and destination cannot be the same zone' });
    }

    const [src, dst] = await Promise.all([Zone.findById(sourceZone), Zone.findById(destinationZone)]);
    if (!src || !dst) {
      return res.status(404).json({ success: false, message: 'One or both zones not found' });
    }

    // Bidirectional duplicate check
    const existingRoute = await Route.findOne({
      $or: [
        { sourceZone, destinationZone },
        { sourceZone: destinationZone, destinationZone: sourceZone },
      ],
    });

    if (existingRoute) {
      return res.status(400).json({ success: false, message: 'Route already exists between these zones' });
    }

    const route = await Route.create({ sourceZone, destinationZone });
    const populated = await route.populate([
      { path: 'sourceZone', select: 'name city zoneCode' },
      { path: 'destinationZone', select: 'name city zoneCode' },
    ]);

    loggerService.logEvent('ROUTE_ADDED', { routeId: route._id, sourceZone, destinationZone });

    res.status(201).json({ success: true, message: 'Route added successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a route
// @route   DELETE /api/routes/:id
// @access  Private
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    await Route.findByIdAndDelete(req.params.id);

    loggerService.logEvent('ROUTE_REMOVED', { routeId: req.params.id, sourceZone: route.sourceZone, destinationZone: route.destinationZone });

    res.status(200).json({ success: true, message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export { getRoutes, addRoute, deleteRoute };
