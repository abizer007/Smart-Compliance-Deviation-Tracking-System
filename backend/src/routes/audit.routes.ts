import { Router } from 'express';
import { getAudits, createAudit, getAuditById, createFinding } from '../controllers/audit.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAudits);
router.get('/:id', authenticateToken, getAuditById);
router.post('/', authenticateToken, requireRole(['AUDITOR', 'ADMIN']), createAudit);
router.post('/:auditId/findings', authenticateToken, requireRole(['AUDITOR', 'ADMIN']), createFinding);

export default router;
