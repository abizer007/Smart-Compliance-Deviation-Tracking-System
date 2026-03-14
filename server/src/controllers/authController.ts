import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/jwt';
import { RoleName } from '@prisma/client';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, role: user.role.name as RoleName });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      department: user.department
    }
  });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { role: true }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role.name,
    department: user.department
  });
}

export async function registerUser(req: Request, res: Response) {
  const { email, password, name, roleName, department } = req.body as {
    email: string;
    password: string;
    name: string;
    roleName: RoleName;
    department?: string;
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      department,
      roleId: role.id
    }
  });

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: role.name,
    department: user.department
  });
}

export async function registerPublic(req: Request, res: Response) {
  const { email, password, name, department } = req.body as {
    email: string;
    password: string;
    name: string;
    department?: string;
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const defaultRole = await prisma.role.findUnique({ where: { name: RoleName.EMPLOYEE } });
  if (!defaultRole) {
    return res.status(500).json({ message: 'Default role not configured' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      department,
      roleId: defaultRole.id
    }
  });

  const token = signToken({ id: user.id, role: defaultRole.name });

  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: defaultRole.name,
      department: user.department
    }
  });
}

