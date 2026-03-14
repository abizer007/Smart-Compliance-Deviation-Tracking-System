import { NotificationType, ActivityEntityType } from '@prisma/client';
import { prisma } from '../prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  entityType?: ActivityEntityType;
  entityId?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, body, entityType, entityId } = params;

  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      entityType,
      entityId
    }
  });
}

