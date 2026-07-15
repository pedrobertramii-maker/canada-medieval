import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env';
import { prisma } from '../lib/prisma';
import { AdminRole } from '@prisma/client';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    username: string;
    email: string;
    role: AdminRole;
    name: string;
  };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = header.split(' ')[1];
    const decoded: any = jwt.verify(token, env.jwt.accessSecret);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, role: true, name: true, isActive: true },
    });
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Conta inativa ou inexistente' });
    }
    req.admin = admin;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin) return res.status(401).json({ error: 'Não autenticado' });
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}
