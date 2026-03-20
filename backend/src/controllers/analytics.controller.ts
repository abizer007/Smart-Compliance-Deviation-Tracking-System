import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalDeviations = await prisma.deviation.count();
    const openDeviations = await prisma.deviation.count({
      where: { status: { notIn: ['CLOSED', 'RESOLVED'] } }
    });

    const totalCapas = await prisma.capa.count();
    const pendingCapas = await prisma.capa.count({
      where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
    });

    const audits = await prisma.audit.count();

    // Grouping deviation trends by severity
    const deviationsBySeverity = await prisma.deviation.groupBy({
      by: ['severity'],
      _count: { severity: true }
    });

    res.json({
      summary: {
        totalDeviations,
        openDeviations,
        totalCapas,
        pendingCapas,
        audits,
        complianceScore: 100 - (openDeviations * 5) - (pendingCapas * 2) > 0 ? 100 - (openDeviations * 5) - (pendingCapas * 2) : 0
      },
      deviationsBySeverity: deviationsBySeverity.map(d => ({
        severity: d.severity,
        count: d._count.severity
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
