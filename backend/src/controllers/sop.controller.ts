import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getSOPs = async (req: Request, res: Response) => {
  try {
    const sops = await prisma.sOP.findMany({
      include: {
        createdBy: { select: { name: true } },
        versions: { orderBy: { version: 'desc' }, take: 1 }
      }
    });
    res.json(sops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SOPs' });
  }
};

export const getSOPById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sop = await prisma.sOP.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true } },
        versions: { orderBy: { version: 'desc' } }
      }
    });
    if (!sop) return res.status(404).json({ error: 'SOP not found' });
    res.json(sop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SOP' });
  }
};

export const createSOP = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, department, content } = req.body;
    const userId = req.user!.userId;

    const sop = await prisma.sOP.create({
      data: {
        title,
        description,
        department,
        createdById: userId,
        versions: {
          create: {
            content,
            version: 1,
          }
        }
      },
      include: {
        versions: true
      }
    });

    res.status(201).json(sop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SOP' });
  }
};

export const updateSOPContent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    // Find latest version
    const latestVersion = await prisma.sOPVersion.findFirst({
      where: { sopId: id },
      orderBy: { version: 'desc' }
    });

    const newVersion = latestVersion ? latestVersion.version + 1 : 1;

    const newSopVersion = await prisma.sOPVersion.create({
      data: {
        sopId: id,
        content,
        version: newVersion,
      }
    });

    await prisma.sOP.update({
       where: { id },
       data: { updatedAt: new Date() }
    });

    res.status(201).json(newSopVersion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SOP content' });
  }
};
