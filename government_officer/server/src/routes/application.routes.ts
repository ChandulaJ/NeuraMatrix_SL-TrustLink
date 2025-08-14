import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { env } from '../config/env.js';
import { detectOverlap } from '../utils/overlap.js';
import { mintLicenseNumber } from '../utils/license.js';
import { z } from 'zod';

const router = Router();

// List with filters
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status, q, page = '1', pageSize = '20' } = req.query as any;
    const skip = (Number(page) - 1) * Number(pageSize);
    const where: any = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { notes: { contains: q, mode: 'insensitive' } },
        { locationText: { contains: q, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(pageSize),
        include: { service: true, user: true, auditReport: true },
      }),
      prisma.application.count({ where }),
    ]);
    res.json({ items, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (e) { next(e); }
});

// Detail incl. overlap summary
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const app = await prisma.application.findUnique({
      where: { id },
      include: {
        documents: true,
        auditReport: true,
        user: true,
        service: true
      },
    });
    if (!app) return res.status(404).json({ error: 'NOT_FOUND' });

    // Only admins have schedule conflicts relevant; infer admin = requester
    const adminId = req.user!.id;
    let requestedSlotOverlap: null | {
      hasConflict: boolean;
      durationMinutes: number;
      conflicts: { scheduleId: number; start: Date; end: Date; title: string | undefined; }[];
    } = null;

    if (app.scheduledAt) {
      const duration = env.DEFAULT_APPOINTMENT_MINUTES;
      const busy = await prisma.adminSchedule.findMany({
        where: { adminId, start: { lt: new Date(app.scheduledAt) } },
      });
      const { hasConflict, conflicts } = detectOverlap(new Date(app.scheduledAt), duration, busy);
      requestedSlotOverlap = {
        hasConflict,
        durationMinutes: duration,
        conflicts: conflicts.map(b => ({
          scheduleId: b.id!,
          start: b.start,
          end: b.end,
          title: b.title,
        })),
      };
    }

    res.json({ ...app, requestedSlotOverlap });
  } catch (e) { next(e); }
});

// Accept appointment (with conflict check and optional force)
const acceptSchema = z.object({
  body: z.object({
    scheduledFor: z.string().datetime(),
    force: z.boolean().optional()
  })
});
router.post('/:id/appointment/accept', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    acceptSchema.parse({ body: req.body });
    const id = Number(req.params.id);
    const app = await prisma.application.findUnique({ where: { id } });
    if (!app) return res.status(404).json({ error: 'NOT_FOUND' });

    const scheduledFor = new Date(req.body.scheduledFor);
    const duration = env.DEFAULT_APPOINTMENT_MINUTES;

    const busy = await prisma.adminSchedule.findMany({ where: { adminId: req.user!.id } });
    const result = detectOverlap(scheduledFor, duration, busy);

    const appointment = await prisma.appointment.create({
      data: {
        applicationId: id,
        decidedBy: req.user!.id,
        requestedAt: app.scheduledAt ?? null,
        accepted: result.hasConflict ? !!req.body.force : true,
        scheduledFor,
        overlapDetected: result.hasConflict,
        overlapCount: result.conflicts.length,
      }
    });

    res.json({
      appointmentId: appointment.id,
      accepted: appointment.accepted,
      overlapDetected: appointment.overlapDetected,
      overlaps: result.conflicts.map(c => ({ scheduleId: c.id, start: c.start, end: c.end, title: c.title }))
    });
  } catch (e) { next(e); }
});

// Approve + optional appointment acceptance in one call
const approveSchema = z.object({
  body: z.object({
    appointment: z.object({
      scheduledFor: z.string().datetime(),
      force: z.boolean().optional()
    }).optional()
  })
});
router.post('/:id/approve', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    approveSchema.parse({ body: req.body });
    const id = Number(req.params.id);
    const app = await prisma.application.findUnique({ where: { id } });
    if (!app) return res.status(404).json({ error: 'NOT_FOUND' });

    let appointmentResult: any = null;

    if (req.body.appointment) {
      // reuse same logic
      const scheduledFor = new Date(req.body.appointment.scheduledFor);
      const busy = await prisma.adminSchedule.findMany({ where: { adminId: req.user!.id } });
      const result = detectOverlap(scheduledFor, env.DEFAULT_APPOINTMENT_MINUTES, busy);
      const accepted = result.hasConflict ? !!req.body.appointment.force : true;

      await prisma.appointment.create({
        data: {
          applicationId: id,
          decidedBy: req.user!.id,
          requestedAt: app.scheduledAt ?? null,
          accepted,
          scheduledFor,
          overlapDetected: result.hasConflict,
          overlapCount: result.conflicts.length
        }
      });

      appointmentResult = { accepted, overlapDetected: result.hasConflict };
    }

    const seq = await prisma.application.count({ where: { status: 'APPROVED' } }) + 1;
    const licenseNumber = mintLicenseNumber(seq);

    const updated = await prisma.application.update({
      where: { id },
      data: { status: 'APPROVED', licenseNumber }
    });

    res.json({ status: updated.status, licenseNumber, appointment: appointmentResult });
  } catch (e) { next(e); }
});

const rejectSchema = z.object({
  body: z.object({ reason: z.string().min(3) })
});
router.post('/:id/reject', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    rejectSchema.parse({ body: req.body });
    const id = Number(req.params.id);
    const updated = await prisma.application.update({
      where: { id },
      data: { status: 'REJECTED', notes: (req.body.reason ?? '').substring(0, 500) }
    });
    res.json({ status: updated.status });
  } catch (e) { next(e); }
});

// Create/Update audit report (Auditor)
const reportSchema = z.object({
  body: z.object({
    date: z.string().datetime(),
    result: z.enum(['PASSED', 'FAILED']),
    notes: z.string().optional(),
    photoEvidenceUrl: z.string().url().optional(),
    checklist: z.object({
      fireSafety: z.boolean(),
      hygiene: z.boolean(),
      emergencyExits: z.boolean(),
    })
  })
});
router.post('/:id/audit-report', requireAuth, requireRole('AUDITOR', 'ADMIN'), async (req, res, next) => {
  try {
    reportSchema.parse({ body: req.body });
    const id = Number(req.params.id);
    const app = await prisma.application.findUnique({ where: { id } });
    if (!app) return res.status(404).json({ error: 'NOT_FOUND' });

    const upserted = await prisma.auditReport.upsert({
      where: { applicationId: id },
      create: {
        applicationId: id,
        auditorId: req.user!.id,
        date: new Date(req.body.date),
        result: req.body.result,
        notes: req.body.notes,
        photoEvidenceUrl: req.body.photoEvidenceUrl,
  checklist: JSON.stringify(req.body.checklist)
      },
      update: {
        auditorId: req.user!.id,
        date: new Date(req.body.date),
        result: req.body.result,
        notes: req.body.notes,
        photoEvidenceUrl: req.body.photoEvidenceUrl,
  checklist: JSON.stringify(req.body.checklist)
      }
    });

    if (upserted.result === 'PASSED' && app.status === 'PENDING') {
      await prisma.application.update({ where: { id }, data: { status: 'AUDIT_PASSED' } });
    }

    res.json(upserted);
  } catch (e) { next(e); }
});

export default router;
