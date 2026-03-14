import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { ActivityEntityType, NotificationType } from '@prisma/client';
import { logActivity } from '../utils/activity';
import { createNotification } from './notificationService';

export async function createCapa(req: Request, res: Response) {
  const { title, description, assignedToId, deadline, relatedDeviationId } = req.body as {
    title: string;
    description: string;
    assignedToId: string;
    deadline?: string;
    relatedDeviationId?: string;
  };

  const capa = await prisma.cAPA.create({
    data: {
      title,
      description,
      assignedToId,
      createdById: req.user!.id,
      deadline: deadline ? new Date(deadline) : undefined,
      relatedDeviationId
    }
  });

  if (relatedDeviationId) {
    await prisma.deviation.update({
      where: { id: relatedDeviationId },
      data: { status: 'CAPA_ASSIGNED' }
    });
  }

  await logActivity({
    entityType: ActivityEntityType.CAPA,
    entityId: capa.id,
    action: 'CAPA_CREATED',
    actorId: req.user!.id,
    metadata: { relatedDeviationId }
  });

  await createNotification({
    userId: assignedToId,
    type: NotificationType.CAPA_ASSIGNED,
    title: 'New CAPA assigned',
    body: capa.title,
    entityType: ActivityEntityType.CAPA,
    entityId: capa.id
  });

  return res.status(201).json(capa);
}

export async function listCapas(_req: Request, res: Response) {
  const capas = await prisma.cAPA.findMany({
    include: {
      assignedTo: true,
      relatedDeviation: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return res.json(capas);
}

export async function getCapaById(req: Request, res: Response) {
  const { id } = req.params;
  const capa = await prisma.cAPA.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      relatedDeviation: true
    }
  });
  if (!capa) {
    return res.status(404).json({ message: 'CAPA not found' });
  }
  return res.json(capa);
}

export async function updateCapa(req: Request, res: Response) {
  const { id } = req.params;
  const { status, progress, deadline } = req.body as {
    status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
    progress?: number;
    deadline?: string;
  };

  const capa = await prisma.cAPA.update({
    where: { id },
    data: {
      status,
      progress,
      deadline: deadline ? new Date(deadline) : undefined
    }
  });

  await logActivity({
    entityType: ActivityEntityType.CAPA,
    entityId: capa.id,
    action: 'CAPA_UPDATED',
    actorId: req.user!.id,
    metadata: { status: capa.status, progress: capa.progress, deadline: capa.deadline }
  });

  return res.json(capa);
}

