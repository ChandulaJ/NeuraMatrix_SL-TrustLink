import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthUser = { id: number; role: 'ADMIN' | 'AUDITOR'; fullName: string };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'UNAUTHORIZED' });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}

export function requireRole(...roles: AuthUser['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHORIZED' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'FORBIDDEN' });
    next();
  };
}
