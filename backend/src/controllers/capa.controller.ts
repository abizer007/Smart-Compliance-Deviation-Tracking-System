import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getCapas = async (req: Request, res: Response) => {
  try {
    const capas = await prisma.capa.findMany({
      include: {
        owner: { select: { name: true } },
        deviation: { select: { title: true, severity: true } }
      },
      orderBy: { deadline: 'asc' }
    });
    res.json(capas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CAPAs' });
  }
};

export const getCapaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const capa = await prisma.capa.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true } },
        deviation: { select: { title: true, description: true } }
      }
    });
    if (!capa) return res.status(404).json({ error: 'CAPA not found' });
    res.json(capa);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CAPA' });
  }
};

export const createCapa = async (req: AuthRequest, res: Response) => {
  try {
    const { deviationId, ownerId, action, deadline } = req.body;

    const capa = await prisma.capa.create({
      data: {
        deviationId,
        ownerId,
        action,
        deadline: new Date(deadline),
      }
    });

    // Automatically update deviation status
    await prisma.deviation.update({
      where: { id: deviationId },
      data: { status: 'CAPA_ASSIGNED' }
    });

    res.status(201).json(capa);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create CAPA' });
  }
};

export const updateCapaStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const capa = await prisma.capa.update({
      where: { id },
      data: { status }
    });

    res.json(capa);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update CAPA status' });
  }
};
