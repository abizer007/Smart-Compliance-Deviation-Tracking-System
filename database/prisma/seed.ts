import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Roles
  const rolesData = [
    { name: RoleName.EMPLOYEE, description: 'Standard employee user' },
    { name: RoleName.PROCESS_OWNER, description: 'Owner of specific processes/SOPs' },
    { name: RoleName.COMPLIANCE_MANAGER, description: 'Oversees compliance and deviations' },
    { name: RoleName.AUDITOR, description: 'Performs audits and findings' },
    { name: RoleName.ADMIN, description: 'System administrator' }
  ];

  const roles = {};

  for (const role of rolesData) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
    // @ts-expect-error dynamic index
    roles[role.name] = r;
  }

  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      name: 'System Admin',
      department: 'Compliance',
      roleId: roles[RoleName.ADMIN].id
    }
  });

  const departments = ['Quality', 'Manufacturing', 'R&D'];

  // Basic SOPs and versions
  const sop1 = await prisma.sOP.create({
    data: {
      title: 'Deviation Management SOP',
      code: 'SOP-DEV-001',
      department: 'Quality',
      ownerId: adminUser.id,
      versions: {
        create: [
          {
            versionNumber: 1,
            content: '# Deviation Management\n\nInitial version of deviation management SOP.',
            changeSummary: 'Initial creation',
            createdById: adminUser.id,
            isCurrent: true
          }
        ]
      }
    },
    include: { versions: true }
  });

  const sop2 = await prisma.sOP.create({
    data: {
      title: 'Audit Execution SOP',
      code: 'SOP-AUD-001',
      department: 'Quality',
      ownerId: adminUser.id,
      versions: {
        create: [
          {
            versionNumber: 1,
            content: '# Audit Execution\n\nInitial audit execution SOP.',
            changeSummary: 'Initial creation',
            createdById: adminUser.id,
            isCurrent: true
          }
        ]
      }
    }
  });

  // Sample deviations
  const deviation1 = await prisma.deviation.create({
    data: {
      title: 'Temperature excursion in storage room',
      description: 'Temperature went above limit for 2 hours.',
      severity: 'HIGH',
      status: 'REPORTED',
      department: 'Quality',
      relatedSopId: sop1.id,
      reportedById: adminUser.id
    }
  });

  const deviation2 = await prisma.deviation.create({
    data: {
      title: 'Missing calibration certificate',
      description: 'Equipment used without valid calibration certificate.',
      severity: 'CRITICAL',
      status: 'UNDER_REVIEW',
      department: 'Manufacturing',
      relatedSopId: sop1.id,
      reportedById: adminUser.id
    }
  });

  // Sample CAPA linked to deviation
  const capa1 = await prisma.cAPA.create({
    data: {
      title: 'Investigate root cause of temperature excursion',
      description: 'Perform root cause analysis and propose corrective actions.',
      assignedToId: adminUser.id,
      createdById: adminUser.id,
      status: 'IN_PROGRESS',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: 40,
      relatedDeviationId: deviation1.id
    }
  });

  await prisma.deviation.update({
    where: { id: deviation1.id },
    data: {
      status: 'CAPA_ASSIGNED'
    }
  });

  // Sample audit with findings
  const audit = await prisma.audit.create({
    data: {
      name: 'Quarterly GMP Audit',
      department: 'Manufacturing',
      auditorId: adminUser.id,
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'PLANNED'
    }
  });

  await prisma.auditFinding.create({
    data: {
      auditId: audit.id,
      title: 'Unlabeled reagent bottles',
      description: 'Several reagent bottles without proper labeling in lab.',
      severity: 'MEDIUM'
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

