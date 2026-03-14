import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import * as auditService from '../services/auditService';

const router = Router();

const createAuditSchema = z.object({
  name: z.string().min(3),
  department: z.string().optional(),
  auditorId: z.string(),
  scheduledDate: z.string().datetime()
});

const updateAuditSchema = z.object({
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']).optional()
});

const createFindingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
});

router.use(authenticateJWT);

router.post('/', validateBody(createAuditSchema), auditService.createAudit);
router.get('/', auditService.listAudits);
router.get('/:id', auditService.getAuditById);
router.patch('/:id', validateBody(updateAuditSchema), auditService.updateAudit);
router.post('/:id/findings', validateBody(createFindingSchema), auditService.createFinding);

export default router;

