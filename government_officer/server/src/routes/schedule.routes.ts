import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { prisma } from '../prisma.js';
import { z } from 'zod';

const router = Router();

router.get('/my', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { from, to } = req.query as any;
    const where: any = { adminId: req.user!.id };
    if (from || to) where.start = { gte: from ? new Date(from) : undefined };
    if (to) where.end = { lte: new Date(to) };
    const items = await prisma.adminSchedule.findMany({ where, orderBy: { start: 'asc' } });
    res.json(items);
  } catch (e) { next(e); }
});

const createSchema = z.object({
  body: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
    title: z.string().min(2)
  })
});
router.post('/', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    createSchema.parse({ body: req.body });
    const item = await prisma.adminSchedule.create({
      data: {
        adminId: req.user!.id,
        start: new Date(req.body.start),
        end: new Date(req.body.end),
        title: req.body.title
      }
    });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.adminSchedule.delete({ where: { id, adminId: req.user!.id } as any });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
