import { Router } from 'express';
import { z } from 'zod';
import { CommentEntityType } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { prisma } from '../prisma/client';

const router = Router();

const createCommentSchema = z.object({
  entityType: z.nativeEnum(CommentEntityType),
  entityId: z.string(),
  body: z.string().min(1),
  parentId: z.string().optional()
});

router.use(authenticateJWT);

router.post('/', validateBody(createCommentSchema), async (req, res) => {
  const { entityType, entityId, body, parentId } = req.body as {
    entityType: CommentEntityType;
    entityId: string;
    body: string;
    parentId?: string;
  };

  const comment = await prisma.comment.create({
    data: {
      entityType,
      entityId,
      body,
      parentId,
      authorId: req.user!.id
    }
  });

  return res.status(201).json(comment);
});

router.get('/', async (req, res) => {
  const { entityType, entityId } = req.query;

  if (!entityType || !entityId) {
    return res.status(400).json({ message: 'entityType and entityId are required' });
  }

  const comments = await prisma.comment.findMany({
    where: {
      entityType: entityType as CommentEntityType,
      entityId: String(entityId),
      parentId: null
    },
    include: {
      replies: {
        include: {
          replies: true
        }
      },
      author: true
    },
    orderBy: { createdAt: 'asc' }
  });

  return res.json(comments);
});

export default router;

