import express from 'express';
import { getReports, getZoneManagementReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getReports);
router.get('/zone-management', protect, getZoneManagementReport);

export default router;
