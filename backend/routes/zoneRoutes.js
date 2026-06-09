import express from 'express';
import { getZones, addZone, deleteZone } from '../controllers/zoneController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getZones).post(protect, addZone);
router.route('/:id').delete(protect, deleteZone);

export default router;
