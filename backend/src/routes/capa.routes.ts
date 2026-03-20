import { Router } from 'express';
import { getCapas, getCapaById, createCapa, updateCapaStatus } from '../controllers/capa.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getCapas);
router.get('/:id', authenticateToken, getCapaById);
router.post('/', authenticateToken, requireRole(['COMPLIANCE_MANAGER', 'ADMIN']), createCapa);
router.patch('/:id/status', authenticateToken, updateCapaStatus); // owner can update their own in a real scenario

export default router;
