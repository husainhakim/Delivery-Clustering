import express from 'express';
import { generate, getClusters } from '../controllers/clusterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getClusters);
router.post('/generate', protect, generate);

export default router;
