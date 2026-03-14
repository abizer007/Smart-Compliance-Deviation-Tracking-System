import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { ActivityEntityType, NotificationType } from '@prisma/client';
import { logActivity } from '../utils/activity';
import { createNotification } from './notificationService';

export async function createDeviation(req: Request, res: Response) {
  const { title, description, severity, department, relatedSopId } = req.body as {
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    department?: string;
    relatedSopId?: string;
  };

  const deviation = await prisma.deviation.create({
    data: {
      title,
      description,
      severity,
      department,
      relatedSopId,
      reportedById: req.user!.id
    }
  });

  await logActivity({
    entityType: ActivityEntityType.DEVIATION,
    entityId: deviation.id,
    action: 'DEVIATION_CREATED',
    actorId: req.user!.id
  });

  return res.status(201).json(deviation);
}

export async function listDeviations(req: Request, res: Response) {
  const { status, severity, department } = req.query;

  const deviations = await prisma.deviation.findMany({
    where: {
      status: status ? String(status) : undefined,
      severity: severity ? String(severity) : undefined,
      department: department ? String(department) : undefined
    },
    include: {
      relatedSop: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json(deviations);
}

export async function getDeviationById(req: Request, res: Response) {
  const { id } = req.params;
  const deviation = await prisma.deviation.findUnique({
    where: { id },
    include: {
      relatedSop: true,
      capa: true
    }
  });
  if (!deviation) {
    return res.status(404).json({ message: 'Deviation not found' });
  }
  return res.json(deviation);
}

export async function updateDeviationStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as {
    status: 'REPORTED' | 'UNDER_REVIEW' | 'CAPA_ASSIGNED' | 'RESOLVED' | 'CLOSED';
  };

  const deviation = await prisma.deviation.update({
    where: { id },
    data: { status }
  });

  await logActivity({
    entityType: ActivityEntityType.DEVIATION,
    entityId: deviation.id,
    action: 'DEVIATION_STATUS_UPDATED',
    actorId: req.user!.id,
    metadata: { status: deviation.status }
  });

  if (status === 'CLOSED' || status === 'RESOLVED') {
    if (deviation.ownerId) {
      await createNotification({
        userId: deviation.ownerId,
        type: NotificationType.DEVIATION_STATUS_CHANGED,
        title: 'Deviation status updated',
        body: `${deviation.title} is now ${status}`,
        entityType: ActivityEntityType.DEVIATION,
        entityId: deviation.id
      });
    }
  }

  return res.json(deviation);
}

