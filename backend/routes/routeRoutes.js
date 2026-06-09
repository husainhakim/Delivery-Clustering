import express from 'express';
import { getRoutes, addRoute, deleteRoute } from '../controllers/routeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getRoutes).post(protect, addRoute);
router.route('/:id').delete(protect, deleteRoute);

export default router;
