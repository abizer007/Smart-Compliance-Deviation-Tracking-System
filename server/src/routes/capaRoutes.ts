import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import * as capaService from '../services/capaService';

const router = Router();

const createCapaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  assignedToId: z.string(),
  deadline: z.string().datetime().optional(),
  relatedDeviationId: z.string().optional()
});

const updateCapaSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
  progress: z.number().min(0).max(100).optional(),
  deadline: z.string().datetime().optional()
});

router.use(authenticateJWT);

router.post('/', validateBody(createCapaSchema), capaService.createCapa);
router.get('/', capaService.listCapas);
router.get('/:id', capaService.getCapaById);
router.patch('/:id', validateBody(updateCapaSchema), capaService.updateCapa);

export default router;

