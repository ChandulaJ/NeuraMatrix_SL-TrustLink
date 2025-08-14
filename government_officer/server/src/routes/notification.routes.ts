import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { prisma } from '../prisma.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const unreadOnly = String(req.query.unreadOnly ?? '') === '1';
    const where: any = { userId: req.user!.id };
    if (unreadOnly) where.read = false;
    const items = await prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    res.json(updated);
  } catch (e) { next(e); }
});

export default router;
