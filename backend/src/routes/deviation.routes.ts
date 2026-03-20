import { Router } from 'express';
import { getDeviations, getDeviationById, createDeviation, updateDeviationStatus } from '../controllers/deviation.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getDeviations);
router.get('/:id', authenticateToken, getDeviationById);
router.post('/', authenticateToken, createDeviation);
router.patch('/:id/status', authenticateToken, requireRole(['COMPLIANCE_MANAGER', 'ADMIN']), updateDeviationStatus);

export default router;
