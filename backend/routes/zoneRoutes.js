import express from 'express';
import { getZones, addZone, deleteZone, splitZoneCluster, getOperationLogs } from '../controllers/zoneController.js';
import { generate, getClusters } from '../controllers/clusterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getZones).post(protect, addZone);
router.get('/operations', protect, getOperationLogs);
router.post('/split', protect, splitZoneCluster);
router.post('/cluster', protect, generate);
router.get('/clusters', protect, getClusters);
router.route('/:id').delete(protect, deleteZone);

export default router;
