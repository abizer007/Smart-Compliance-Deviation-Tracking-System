import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export async function listSops(req: Request, res: Response) {
  const sops = await prisma.sOP.findMany({
    include: { owner: true, versions: { where: { isCurrent: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return res.json(sops);
}

export async function getSopById(req: Request, res: Response) {
  const { id } = req.params;
  const sop = await prisma.sOP.findUnique({
    where: { id },
    include: { owner: true, versions: true }
  });
  if (!sop) {
    return res.status(404).json({ message: 'SOP not found' });
  }
  return res.json(sop);
}

export async function createSop(req: Request, res: Response) {
  const { title, code, department } = req.body as {
    title: string;
    code: string;
    department?: string;
  };
  const ownerId = req.user!.id;

  const sop = await prisma.sOP.create({
    data: {
      title,
      code,
      department,
      ownerId
    }
  });

  return res.status(201).json(sop);
}

export async function updateSop(req: Request, res: Response) {
  const { id } = req.params;
  const { title, department, isActive } = req.body as {
    title?: string;
    department?: string;
    isActive?: boolean;
  };

  const sop = await prisma.sOP.update({
    where: { id },
    data: {
      title,
      department,
      isActive
    }
  });

  return res.json(sop);
}

export async function createVersion(req: Request, res: Response) {
  const { id } = req.params;
  const { content, changeSummary } = req.body as {
    content: string;
    changeSummary?: string;
  };
  const createdById = req.user!.id;

  const sop = await prisma.sOP.findUnique({ where: { id } });
  if (!sop) {
    return res.status(404).json({ message: 'SOP not found' });
  }

  const lastVersion = await prisma.sOPVersion.findFirst({
    where: { sopId: id },
    orderBy: { versionNumber: 'desc' }
  });
  const nextVersion = (lastVersion?.versionNumber ?? 0) + 1;

  // Mark previous current as false
  await prisma.sOPVersion.updateMany({
    where: { sopId: id, isCurrent: true },
    data: { isCurrent: false }
  });

  const version = await prisma.sOPVersion.create({
    data: {
      sopId: id,
      versionNumber: nextVersion,
      content,
      changeSummary,
      createdById,
      isCurrent: true
    }
  });

  return res.status(201).json(version);
}

export async function listVersions(req: Request, res: Response) {
  const { id } = req.params;
  const versions = await prisma.sOPVersion.findMany({
    where: { sopId: id },
    orderBy: { versionNumber: 'desc' }
  });
  return res.json(versions);
}

export async function getVersionById(req: Request, res: Response) {
  const { versionId } = req.params;
  const version = await prisma.sOPVersion.findUnique({
    where: { id: versionId }
  });
  if (!version) {
    return res.status(404).json({ message: 'Version not found' });
  }
  return res.json(version);
}

