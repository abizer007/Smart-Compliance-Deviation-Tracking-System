import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getDeviations = async (req: Request, res: Response) => {
  try {
    const deviations = await prisma.deviation.findMany({
      include: {
        reportedBy: { select: { name: true } },
        sop: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(deviations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deviations' });
  }
};

export const getDeviationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deviation = await prisma.deviation.findUnique({
      where: { id },
      include: {
        reportedBy: { select: { name: true } },
        sop: { select: { title: true } },
        capas: {
          include: {
            owner: { select: { name: true } }
          }
        }
      }
    });
    if (!deviation) return res.status(404).json({ error: 'Deviation not found' });
    res.json(deviation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deviation' });
  }
};

export const createDeviation = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, department, severity, sopId } = req.body;
    const userId = req.user!.userId;

    const deviation = await prisma.deviation.create({
      data: {
        title,
        description,
        department,
        severity,
        sopId: sopId || null,
        reportedById: userId,
      }
    });

    res.status(201).json(deviation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deviation' });
  }
};

export const updateDeviationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., UNDER_REVIEW, CAPA_ASSIGNED

    const deviation = await prisma.deviation.update({
      where: { id },
      data: { status }
    });

    res.json(deviation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deviation status' });
  }
};
