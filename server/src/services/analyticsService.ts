import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export async function overview(_req: Request, res: Response) {
  const [openDeviations, pendingCapas, upcomingAudits, totalCapas, closedCapas, allDeviations] = await Promise.all([
    prisma.deviation.count({
      where: { status: { in: ['REPORTED', 'UNDER_REVIEW', 'CAPA_ASSIGNED'] } }
    }),
    prisma.cAPA.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
    }),
    prisma.audit.count({
      where: {
        scheduledDate: { gte: new Date() }
      }
    }),
    prisma.cAPA.count(),
    prisma.cAPA.count({
      where: { status: 'COMPLETED' }
    }),
    prisma.deviation.findMany({
      select: {
        department: true,
        status: true
      }
    })
  ]);

  const capaClosureRate = totalCapas === 0 ? 0 : (closedCapas / totalCapas) * 100;

  const departmentCompliance: Record<
    string,
    {
      total: number;
      open: number;
      score: number;
    }
  > = {};

  for (const d of allDeviations) {
    const dept = d.department ?? 'Unassigned';
    if (!departmentCompliance[dept]) {
      departmentCompliance[dept] = { total: 0, open: 0, score: 100 };
    }
    departmentCompliance[dept].total += 1;
    const isOpen = ['REPORTED', 'UNDER_REVIEW', 'CAPA_ASSIGNED'].includes(d.status as string);
    if (isOpen) {
      departmentCompliance[dept].open += 1;
    }
  }

  for (const dept of Object.keys(departmentCompliance)) {
    const entry = departmentCompliance[dept];
    entry.score = entry.total === 0 ? 100 : ((entry.total - entry.open) / entry.total) * 100;
  }

  return res.json({
    openDeviations,
    pendingCapas,
    upcomingAudits,
    capaClosureRate,
    departmentCompliance
  });
}

