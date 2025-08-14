import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { level } = req.query as any;
    const where: any = {};
    if (level) where.level = level;
    const items = await prisma.integrityFlag.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/:id/resolve', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.integrityFlag.update({
      where: { id },
      data: { status: 'RESOLVED' }
    });
    res.json(updated);
  } catch (e) { next(e); }
});

export default router;
