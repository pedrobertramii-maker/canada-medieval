import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { env } from '../lib/env';
import { ApiError, asyncHandler } from '../middlewares/error';
import { AuthRequest } from '../middlewares/auth';

function signAccess(admin: { id: string; username: string; role: string }) {
  return jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpires }
  );
}

function signRefresh(admin: { id: string }) {
  return jwt.sign({ id: admin.id }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpires });
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Dados inválidos', errors.array());

  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !admin.isActive) throw new ApiError(401, 'Credenciais inválidas');

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new ApiError(401, 'Credenciais inválidas');

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

  res.json({
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      avatar: admin.avatar,
    },
    accessToken: signAccess(admin),
    refreshToken: signRefresh(admin),
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'Refresh token ausente');

  const decoded: any = jwt.verify(refreshToken, env.jwt.refreshSecret);
  const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
  if (!admin || !admin.isActive) throw new ApiError(401, 'Token inválido');

  res.json({ accessToken: signAccess(admin) });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ admin: req.admin });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(400, 'Senhas obrigatórias');
  if (newPassword.length < 8) throw new ApiError(400, 'Nova senha deve ter no mínimo 8 caracteres');

  const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id } });
  if (!admin) throw new ApiError(404, 'Admin não encontrado');

  const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!ok) throw new ApiError(401, 'Senha atual incorreta');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

  res.json({ message: 'Senha alterada com sucesso' });
});
