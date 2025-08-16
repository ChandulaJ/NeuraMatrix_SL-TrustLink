import { Router } from 'express';
import { prisma } from '../prisma.js';
import { z } from 'zod';
import { hash, compare } from '../utils/bcrypt.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'AUDITOR']),
  }),
});

router.post('/register', async (req, res, next) => {
  try {
    registerSchema.parse({ body: req.body });
    const { fullName, username, email, password, role } = req.body;
  const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, username, email, passwordHash, role },
      select: { id: true, fullName: true, username: true, email: true, role: true },
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

const loginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

router.post('/login', async (req, res, next) => {
  try {
    loginSchema.parse({ body: req.body });
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  const ok = await compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });

    const token = jwt.sign(
      { id: user.id, role: user.role, fullName: user.fullName },
      env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ accessToken: token });
  } catch (e) {
    next(e);
  }
});

export default router;
