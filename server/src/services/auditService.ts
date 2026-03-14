import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { ActivityEntityType, NotificationType } from '@prisma/client';
import { logActivity } from '../utils/activity';
import { createNotification } from './notificationService';

export async function createAudit(req: Request, res: Response) {
  const { name, department, auditorId, scheduledDate } = req.body as {
    name: string;
    department?: string;
    auditorId: string;
    scheduledDate: string;
  };

  const audit = await prisma.audit.create({
    data: {
      name,
      department,
      auditorId,
      scheduledDate: new Date(scheduledDate)
    }
  });

  await logActivity({
    entityType: ActivityEntityType.AUDIT,
    entityId: audit.id,
    action: 'AUDIT_CREATED',
    actorId: req.user!.id
  });

  await createNotification({
    userId: auditorId,
    type: NotificationType.AUDIT_SCHEDULED,
    title: 'Audit scheduled',
    body: audit.name,
    entityType: ActivityEntityType.AUDIT,
    entityId: audit.id
  });
  return res.status(201).json(audit);
}

export async function listAudits(_req: Request, res: Response) {
  const audits = await prisma.audit.findMany({
    include: {
      auditor: true,
      findings: true
    },
    orderBy: { scheduledDate: 'desc' }
  });
  return res.json(audits);
}

export async function getAuditById(req: Request, res: Response) {
  const { id } = req.params;
  const audit = await prisma.audit.findUnique({
    where: { id },
    include: {
      auditor: true,
      findings: true
    }
  });
  if (!audit) {
    return res.status(404).json({ message: 'Audit not found' });
  }
  return res.json(audit);
}

export async function updateAudit(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' };

  const audit = await prisma.audit.update({
    where: { id },
    data: { status }
  });

  await logActivity({
    entityType: ActivityEntityType.AUDIT,
    entityId: audit.id,
    action: 'AUDIT_UPDATED',
    actorId: req.user!.id,
    metadata: { status: audit.status }
  });

  return res.json(audit);
}

export async function createFinding(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, severity } = req.body as {
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };

  const finding = await prisma.auditFinding.create({
    data: {
      auditId: id,
      title,
      description,
      severity
    }
  });

  await logActivity({
    entityType: ActivityEntityType.AUDIT,
    entityId: id,
    action: 'AUDIT_FINDING_CREATED',
    actorId: req.user!.id,
    metadata: { findingId: finding.id }
  });

  return res.status(201).json(finding);
}

