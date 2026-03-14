import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { RoleName } from '@prisma/client';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import * as sopService from '../services/sopService';

const router = Router();

const createSopSchema = z.object({
  title: z.string().min(3),
  code: z.string().min(2),
  department: z.string().optional()
});

const updateSopSchema = z.object({
  title: z.string().min(3).optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional()
});

const createVersionSchema = z.object({
  content: z.string().min(1),
  changeSummary: z.string().optional()
});

router.use(authenticateJWT);

router.get('/', sopService.listSops);
router.get('/:id', sopService.getSopById);

router.post(
  '/',
  authorizeRoles(RoleName.PROCESS_OWNER, RoleName.COMPLIANCE_MANAGER, RoleName.ADMIN),
  validateBody(createSopSchema),
  sopService.createSop
);

router.patch(
  '/:id',
  authorizeRoles(RoleName.PROCESS_OWNER, RoleName.COMPLIANCE_MANAGER, RoleName.ADMIN),
  validateBody(updateSopSchema),
  sopService.updateSop
);

router.post(
  '/:id/versions',
  authorizeRoles(RoleName.PROCESS_OWNER, RoleName.COMPLIANCE_MANAGER, RoleName.ADMIN),
  validateBody(createVersionSchema),
  sopService.createVersion
);

router.get('/:id/versions', sopService.listVersions);
router.get('/:id/versions/:versionId', sopService.getVersionById);

export default router;

