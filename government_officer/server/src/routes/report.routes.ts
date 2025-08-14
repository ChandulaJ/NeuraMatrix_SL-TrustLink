import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { prisma } from '../prisma.js';

const router = Router();

// Dashboard summary
router.get('/summary', requireAuth, async (_req, res, next) => {
  try {
    const now = new Date();
    const start30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [awaitingFinal, auditsToday, approvals] = await Promise.all([
      prisma.application.count({ where: { status: 'AUDIT_PASSED' } }),
      prisma.auditReport.count({
        where: {
          date: {
            gte: new Date(new Date().toDateString() + ' 00:00:00'),
            lte: new Date(new Date().toDateString() + ' 23:59:59')
          }
        }
      }),
      prisma.application.findMany({
        where: { status: 'APPROVED', updatedAt: { gte: start30 } },
        select: { createdAt: true, updatedAt: true }
      })
    ]);

    // avg approval time (submission -> approval)
    const avgApprovalTimeDays =
      approvals.length === 0
        ? null
        : approvals
            .map(a => (a.updatedAt.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24))
            .reduce((a, b) => a + b, 0) / approvals.length;

    res.json({
      applicationsAwaitingFinalReview: awaitingFinal,
      auditsScheduledToday: auditsToday,
      avgApprovalTime30d: avgApprovalTimeDays
    });
  } catch (e) { next(e); }
});

// Simple charts data
router.get('/approvals-vs-rejections', requireAuth, async (_req, res, next) => {
  try {
    const now = new Date();
    const start30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const approved = await prisma.application.count({ where: { status: 'APPROVED', updatedAt: { gte: start30 } } });
    const rejected = await prisma.application.count({ where: { status: 'REJECTED', updatedAt: { gte: start30 } } });
    res.json({ approved, rejected, rangeDays: 30 });
  } catch (e) { next(e); }
});

router.get('/auditor-performance', requireAuth, async (_req, res, next) => {
  try {
    const rows = await prisma.auditReport.groupBy({
      by: ['auditorId'],
      _count: { _all: true },
      where: { result: 'PASSED' }
    });
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/status-breakdown', requireAuth, async (_req, res, next) => {
  try {
    const [passed, pending, approved, rejected] = await Promise.all([
      prisma.application.count({ where: { status: 'AUDIT_PASSED' } }),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
    ]);
    res.json({ auditPassed: passed, pending, approved, rejected });
  } catch (e) { next(e); }
});

export default router;
