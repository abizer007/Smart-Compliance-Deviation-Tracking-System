import { ActivityEntityType } from '@prisma/client';
import { prisma } from '../prisma/client';

interface LogActivityParams {
  entityType: ActivityEntityType;
  entityId: string;
  action: string;
  actorId?: string;
  metadata?: unknown;
}

export async function logActivity(params: LogActivityParams) {
  const { entityType, entityId, action, actorId, metadata } = params;

  await prisma.activityLog.create({
    data: {
      entityType,
      entityId,
      action,
      actorId,
      metadata: metadata as any
    }
  });
}

