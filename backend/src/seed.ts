import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.auditFinding.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.capa.deleteMany();
  await prisma.deviation.deleteMany();
  await prisma.sOPVersion.deleteMany();
  await prisma.sOP.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: { email: 'admin@compliance.com', name: 'Admin', passwordHash, role: 'ADMIN' }
  });

  const employee = await prisma.user.create({
    data: { email: 'employee@compliance.com', name: 'Jane Doe', passwordHash, role: 'EMPLOYEE' }
  });

  const manager = await prisma.user.create({
    data: { email: 'manager@compliance.com', name: 'John Smith', passwordHash, role: 'COMPLIANCE_MANAGER' }
  });

  const auditor = await prisma.user.create({
    data: { email: 'auditor@compliance.com', name: 'Robert Null', passwordHash, role: 'AUDITOR' }
  });

  console.log('Seeding SOPs...');
  const sop1 = await prisma.sOP.create({
    data: {
      title: 'Safety Data Handing',
      description: 'Guidelines for safely handling PII',
      department: 'IT',
      createdById: manager.id,
      versions: {
         create: { content: '# Safety Data Handling\n\n1. Do not share passwords...\n2. Encrypt all databases.', version: 1 }
      }
    }
  });

  console.log('Seeding Deviations...');
  const dev1 = await prisma.deviation.create({
    data: {
      title: 'Unencrypted backup drive found',
      description: 'Found a USB drive with unencrypted backups in the server room.',
      department: 'IT',
      severity: 'HIGH',
      status: 'CAPA_ASSIGNED',
      sopId: sop1.id,
      reportedById: employee.id,
    }
  });

  const dev2 = await prisma.deviation.create({
    data: {
      title: 'Late submission of compliance report',
      description: 'Q3 report submitted 5 days late.',
      department: 'Finance',
      severity: 'MEDIUM',
      status: 'REPORTED',
      reportedById: manager.id,
    }
  });

  console.log('Seeding CAPAs...');
  await prisma.capa.create({
     data: {
       deviationId: dev1.id,
       ownerId: manager.id,
       action: 'Encrypt all backup drives and establish strict server room access policy.',
       deadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
       status: 'IN_PROGRESS'
     }
  });

  console.log('Seeding Audits...');
  await prisma.audit.create({
    data: {
      name: 'Q4 Annual IT Audit',
      department: 'IT',
      date: new Date(),
      auditorId: auditor.id,
      status: 'IN_PROGRESS'
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
