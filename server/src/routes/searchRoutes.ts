import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { prisma } from '../prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', async (req, res) => {
  const q = String(req.query.q ?? '').trim();

  if (!q) {
    return res.json({ sops: [], deviations: [], capas: [], users: [] });
  }

  const [sops, deviations, capas, users] = await Promise.all([
    prisma.sOP.findMany({
      where: {
        OR: [{ title: { contains: q, mode: 'insensitive' } }, { code: { contains: q, mode: 'insensitive' } }]
      },
      take: 10
    }),
    prisma.deviation.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 10
    }),
    prisma.cAPA.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 10
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 10
    })
  ]);

  return res.json({ sops, deviations, capas, users });
});

export default router;

