import { Router } from 'express';
import { login, me, registerUser, registerPublic } from '../controllers/authController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { RoleName } from '@prisma/client';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  roleName: z.nativeEnum(RoleName),
  department: z.string().optional()
});

const publicRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  department: z.string().optional()
});

router.post('/login', validateBody(loginSchema), login);

router.get('/me', authenticateJWT, me);

router.post(
  '/register',
  authenticateJWT,
  authorizeRoles(RoleName.ADMIN),
  validateBody(registerSchema),
  registerUser
);

router.post('/register-public', validateBody(publicRegisterSchema), registerPublic);

export default router;

