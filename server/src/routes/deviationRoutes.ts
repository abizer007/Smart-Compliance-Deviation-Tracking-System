import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware\validate';
import * as deviationService from '../services/deviationService';

const router = Router();

const createDeviationSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  department: z.string().optional(),
  relatedSopId: z.string().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['REPORTED', 'UNDER_REVIEW', 'CAPA_ASSIGNED', 'RESOLVED', 'CLOSED'])
});

router.use(authenticateJWT);

router.post('/', validateBody(createDeviationSchema), deviationService.createDeviation);
router.get('/', deviationService.listDeviations);
router.get('/:id', deviationService.getDeviationById);
router.patch('/:id', validateBody(updateStatusSchema), deviationService.updateDeviationStatus);

export default router;

