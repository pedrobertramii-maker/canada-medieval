import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { ApiError, asyncHandler } from '../middlewares/error';
import { AuthRequest } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

export const dashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [products, suggestions, updates, admins] = await Promise.all([
    prisma.product.count(),
    prisma.suggestion.count(),
    prisma.update.count(),
    prisma.admin.count({ where: { isActive: true } }),
  ]);

  const [pendingSuggestions, recentSuggestions, recentUpdates, owners, categories] = await Promise.all([
    prisma.suggestion.count({ where: { status: 'PENDING' } }),
    prisma.suggestion.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.update.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { author: { select: { name: true } } } }),
    prisma.owner.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
  ]);

  res.json({
    stats: { products, suggestions, updates, admins },
    extra: { pendingSuggestions, owners, categories },
    recent: { suggestions: recentSuggestions, updates: recentUpdates },
  });
});

export const listAdmins = asyncHandler(async (_req: Request, res: Response) => {
  const admins = await prisma.admin.findMany({
    select: { id: true, username: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true, avatar: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ admins });
});

export const createAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { username, email, password, name, role } = req.body;
  if (!username || !email || !password || !name) throw new ApiError(400, 'Campos obrigatórios');
  if (password.length < 8) throw new ApiError(400, 'Senha deve ter no mínimo 8 caracteres');

  const exists = await prisma.admin.findFirst({ where: { OR: [{ username }, { email }] } });
  if (exists) throw new ApiError(409, 'Usuário ou email já cadastrado');

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: {
      username, email, passwordHash, name,
      role: (role as AdminRole) || AdminRole.STAFF,
    },
    select: { id: true, username: true, email: true, name: true, role: true, isActive: true, createdAt: true },
  });
  res.status(201).json({ admin });
});

export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, isActive, password } = req.body;
  const data: any = { name, email, role, isActive };
  if (password) {
    if (password.length < 8) throw new ApiError(400, 'Senha deve ter no mínimo 8 caracteres');
    data.passwordHash = await bcrypt.hash(password, 12);
  }
  Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);
  const admin = await prisma.admin.update({
    where: { id },
    data,
    select: { id: true, username: true, email: true, name: true, role: true, isActive: true },
  });
  res.json({ admin });
});

export const removeAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (id === req.admin!.id) throw new ApiError(400, 'Você não pode remover a si mesmo');

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new ApiError(404, 'Admin não encontrado');
  if (admin.role === AdminRole.OWNER) {
    const otherOwners = await prisma.admin.count({ where: { role: AdminRole.OWNER, NOT: { id } } });
    if (otherOwners === 0) throw new ApiError(400, 'Não é possível remover o último OWNER');
  }
  await prisma.admin.delete({ where: { id } });
  res.json({ message: 'Admin removido' });
});
