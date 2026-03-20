import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getAudits = async (req: Request, res: Response) => {
  try {
    const audits = await prisma.audit.findMany({
      include: {
        auditor: { select: { name: true } },
        _count: { select: { findings: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audits' });
  }
};

export const createAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { name, department, date } = req.body;
    const auditorId = req.user!.userId;

    const audit = await prisma.audit.create({
      data: {
        name,
        department,
        date: new Date(date),
        auditorId,
      }
    });

    res.status(201).json(audit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit' });
  }
};

export const getAuditById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const audit = await prisma.audit.findUnique({
      where: { id },
      include: {
        auditor: { select: { name: true } },
        findings: {
          include: {
            deviation: { select: { status: true } }
          }
        }
      }
    });
    if (!audit) return res.status(404).json({ error: 'Audit not found' });
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit' });
  }
};

export const createFinding = async (req: AuthRequest, res: Response) => {
  try {
    const { auditId } = req.params;
    const { finding, createDeviation, deviationSeverity } = req.body;
    const userId = req.user!.userId;

    let deviationId = null;

    if (createDeviation) {
      const audit = await prisma.audit.findUnique({ where: { id: auditId } });
      const dev = await prisma.deviation.create({
        data: {
          title: `Audit Finding from ${audit?.name || 'Audit'}`,
          description: finding,
          department: audit?.department || 'General',
          severity: deviationSeverity || 'MEDIUM',
          reportedById: userId,
        }
      });
      deviationId = dev.id;
    }

    const findingRec = await prisma.auditFinding.create({
      data: {
        auditId,
        finding,
        deviationId,
      }
    });

    res.status(201).json(findingRec);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add finding' });
  }
};
