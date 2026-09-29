import express from 'express';
import { getAdminStats, getAllAssessmentResults } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/stats', verifyToken, isAdmin, getAdminStats);
router.get('/assessment-results', verifyToken, isAdmin, getAllAssessmentResults);

export default router;
