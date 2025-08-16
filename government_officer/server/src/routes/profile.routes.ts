import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middlewares/auth.js';
import { z } from 'zod';

const router = Router();

const PERMISSION_LABEL: Record<string, string> = {
  VIEW_APPLICATIONS: 'View Applications',
  AUDIT_PROPERTIES: 'Audit Properties',
  GENERATE_REPORTS: 'Generate Reports',
  VIEW_REPORTS: 'View Reports',
  MANAGE_SCHEDULE: 'Manage Schedule',
  MANAGE_USERS: 'Manage Users',
};

function codeFrom(user: { employeeCode: string | null; id: number }) {
  return user.employeeCode ?? `U-${String(user.id).padStart(3, '0')}`;
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { permissions: true },
    });
    if (!me) return res.status(404).json({ error: 'NOT_FOUND' });

    const permissions = me.permissions.map((p: { permission: string | number; }) => ({
      key: p.permission,
      label: PERMISSION_LABEL[p.permission],
    }));

    res.json({
      id: me.id,
      code: codeFrom(me),
      fullName: me.fullName,
      title: me.title,
      email: me.email,
      phoneNumber: me.phoneNumber,
      role: me.role,
      department: me.department,
      location: me.location,
      bio: me.bio,
      joinedAt: me.createdAt,
      permissions,
    });
  } catch (e) {
    next(e);
  }
});

const updateSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phoneNumber: z.string().max(32).optional(),
    title: z.string().max(80).optional(),
    department: z.string().max(120).optional(),
    location: z.string().max(120).optional(),
    bio: z.string().max(1000).optional(),
  }),
});

// Update editable fields (email/role are immutable here)
router.patch('/', requireAuth, async (req, res, next) => {
  try {
    updateSchema.parse({ body: req.body });
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
      select: {
        id: true, fullName: true, title: true, email: true, phoneNumber: true,
        role: true, department: true, location: true, bio: true, createdAt: true, employeeCode: true,
      },
    });
    res.json({
      ...updated,
      code: updated.employeeCode ?? `U-${String(updated.id).padStart(3, '0')}`,
      joinedAt: updated.createdAt,
    });
  } catch (e) {
    next(e);
  }
});

// List permissions (handy for the left card)
router.get('/permissions', requireAuth, async (req, res, next) => {
  try {
    const perms = await prisma.userPermission.findMany({
      where: { userId: req.user!.id },
    });
    res.json(perms.map((p: { permission: string | number; }) => ({ key: p.permission, label: PERMISSION_LABEL[p.permission] })));
  } catch (e) {
    next(e);
  }
});

export default router;
