import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { z } from 'zod';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { prisma } from '../prisma/client';

const router = Router();

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  roleName: z.nativeEnum(RoleName).optional(),
  isActive: z.boolean().optional()
});

router.use(authenticateJWT, authorizeRoles(RoleName.ADMIN));

router.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: 'desc' }
  });

  return res.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      department: u.department,
      isActive: u.isActive,
      role: u.role.name
    }))
  );
});

router.patch('/:id', validateBody(updateUserSchema), async (req, res) => {
  const { id } = req.params;
  const { name, department, roleName, isActive } = req.body as {
    name?: string;
    department?: string;
    roleName?: RoleName;
    isActive?: boolean;
  };

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (department !== undefined) data.department = department;
  if (isActive !== undefined) data.isActive = isActive;

  if (roleName !== undefined) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    data.roleId = role.id;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    include: { role: true }
  });

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    department: user.department,
    isActive: user.isActive,
    role: user.role.name
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false }
  });

  return res.json({
    id: user.id,
    isActive: user.isActive
  });
});

export default router;

