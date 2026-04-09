import { Router } from 'express';
import { getSOPs, getSOPById, createSOP, updateSOPContent, deleteSOP } from '../controllers/sop.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getSOPs);
router.get('/:id', authenticateToken, getSOPById);
router.post('/', authenticateToken, requireRole(['PROCESS_OWNER', 'COMPLIANCE_MANAGER', 'ADMIN']), createSOP);
router.post('/:id/versions', authenticateToken, requireRole(['PROCESS_OWNER', 'COMPLIANCE_MANAGER', 'ADMIN']), updateSOPContent);
router.delete('/:id', authenticateToken, requireRole(['PROCESS_OWNER', 'COMPLIANCE_MANAGER', 'ADMIN']), deleteSOP);

export default router;
