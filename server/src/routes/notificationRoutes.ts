import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { prisma } from '../prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return res.json(notifications);
});

router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.updateMany({
    where: {
      id,
      userId: req.user!.id
    },
    data: {
      readAt: new Date()
    }
  });

  return res.json(notification);
});

export default router;

