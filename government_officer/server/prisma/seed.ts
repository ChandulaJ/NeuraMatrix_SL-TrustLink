import { PrismaClient } from '@prisma/client';
import { hash } from '../src/utils/bcrypt.js';

const prisma = new PrismaClient();

// Robust: upsert each permission on the composite PK (userId, permission)
async function givePermissions(userId: number, perms: string[]) {
  for (const p of perms) {
    await prisma.userPermission.upsert({
      where: { userId_permission: { userId, permission: p } },
      update: {},
      create: { userId, permission: p },
    });
  }
}

async function main() {
  console.log('Seeding…');

  const admin = await prisma.user.upsert({
    where: { username: 'rohan' },
    update: {},
    create: {
      fullName: 'Rohan Perera',
      username: 'rohan',
      email: 'rohan@sltd.gov.lk',
      passwordHash: await hash('admin123', 10),
      role: 'ADMIN',
      phoneNumber: '+94 77 111 2222',
      title: 'System Administrator',
      department: 'Tourism Development Authority',
      location: 'Head Office',
      bio: 'Admin user for SLTDA portal.',
      employeeCode: 'U-001',
    },
  });

  const auditor1 = await prisma.user.upsert({
    where: { username: 'sanjeewa' },
    update: {},
    create: {
      fullName: 'Sanjeewa Fonseka',
      username: 'sanjeewa',
      email: 'sanjeewa@sltd.gov.lk',
      passwordHash: await hash('auditor123', 10),
      role: 'AUDITOR',
      phoneNumber: '+94 77 234 5678',
      title: 'Senior Inspector',
      department: 'Tourism Development Authority',
      location: 'Colombo District',
      bio: 'Experienced tourism inspector with over 8 years in hospitality compliance and safety auditing.',
      employeeCode: 'U-002',
    },
  });

  const auditor2 = await prisma.user.upsert({
    where: { username: 'nilanka' },
    update: {},
    create: {
      fullName: 'Nilanka Senanayake',
      username: 'nilanka',
      email: 'nilanka@sltd.gov.lk',
      passwordHash: await hash('auditor123', 10),
      role: 'AUDITOR',
      phoneNumber: '+94 77 345 6789',
      title: 'Inspector',
      department: 'Tourism Development Authority',
      location: 'Eastern Province',
      bio: 'Auditor focusing on coastal regions.',
      employeeCode: 'U-003',
    },
  });

  await givePermissions(admin.id, [
    'VIEW_APPLICATIONS', 'AUDIT_PROPERTIES', 'GENERATE_REPORTS',
    'VIEW_REPORTS', 'MANAGE_SCHEDULE', 'MANAGE_USERS',
  ]);
  await givePermissions(auditor1.id, [
    'VIEW_APPLICATIONS', 'AUDIT_PROPERTIES', 'GENERATE_REPORTS', 'VIEW_REPORTS', 'MANAGE_SCHEDULE',
  ]);
  await givePermissions(auditor2.id, [
    'VIEW_APPLICATIONS', 'AUDIT_PROPERTIES', 'VIEW_REPORTS', 'MANAGE_SCHEDULE',
  ]);

  // Service
  const service = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Tourist Accommodation License' },
  });

  const createApp = async (idx: number, status: string, scheduledAt?: Date) => {
    const app = await prisma.application.create({
      data: {
        userId: admin.id,
        serviceId: service.id,
        type: 'IN_PERSON',
        status,
        notes: `Sample application ${idx}`,
        region: 'Southern',
        locationText: 'Mirissa',
        scheduledAt,
      },
    });
    await prisma.applicationDocument.createMany({
      data: [
        { applicationId: app.id, name: 'Deed', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { applicationId: app.id, name: 'Company_Registration', url: 'https://file-examples.com/storage/fe1d3d1b6e3cfb0d16eecab/2017/10/file-sample_150kB.pdf' },
        { applicationId: app.id, name: 'Utility_Bill', url: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf' },
      ],
    });
    return app;
  };

  const a1 = await createApp(1, 'PENDING',      new Date('2025-08-20T10:30:00.000Z'));
  const a2 = await createApp(2, 'AUDIT_PASSED', new Date('2025-08-18T09:00:00.000Z'));
  const a3 = await createApp(3, 'REJECTED');
  const a4 = await createApp(4, 'APPROVED');

  // checklist stored as JSON string in DB
  await prisma.auditReport.create({
    data: {
      applicationId: a2.id,
      auditorId: auditor1.id,
      date: new Date('2025-08-17T08:00:00.000Z'),
      result: 'PASSED',
      notes: 'All measures verified.',
      photoEvidenceUrl: null,
      checklist: JSON.stringify({ fireSafety: true, hygiene: true, emergencyExits: true }),
    },
  });

  // Admin busy blocks
  await prisma.adminSchedule.createMany({
    data: [
      { adminId: admin.id, start: new Date('2025-08-20T10:00:00.000Z'), end: new Date('2025-08-20T11:00:00.000Z'), title: 'Audit: Sea Coral Villa' },
      { adminId: admin.id, start: new Date('2025-08-18T09:00:00.000Z'), end: new Date('2025-08-18T10:00:00.000Z'), title: 'Meeting: Auditor sync' },
    ],
  });

  await prisma.integrityFlag.createMany({
    data: [
      { level: 'HIGH', title: 'Volume Spike', description: 'Unusual application volume from single owner: 3 in 30 days' },
      { level: 'LOW',  title: 'Applicant Pattern', description: 'Multiple recent rejections from the same applicant' },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: admin.id, type: 'SYSTEM', title: 'Welcome',      body: 'Your admin account is ready.' },
      { userId: admin.id, type: 'ALERT',  title: 'Audit Passed', body: 'Lagoon Breeze Cabins passed the audit.' },
    ],
  });

  console.log({ admin: admin.id, auditor1: auditor1.id, auditor2: auditor2.id, service: service.id, a1: a1.id, a2: a2.id, a3: a3.id, a4: a4.id });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
