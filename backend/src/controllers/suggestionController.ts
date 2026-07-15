import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError, asyncHandler } from '../middlewares/error';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, discord, title, description } = req.body;
  if (!name || !title || !description) throw new ApiError(400, 'Campos obrigatórios: name, title, description');
  if (String(description).length < 5) throw new ApiError(400, 'Descrição muito curta');
  if (String(description).length > 2000) throw new ApiError(400, 'Descrição muito longa (max 2000)');

  const suggestion = await prisma.suggestion.create({
    data: {
      name: String(name).trim().substring(0, 80),
      discord: discord ? String(discord).trim().substring(0, 80) : null,
      title: String(title).trim().substring(0, 120),
      description: String(description).trim(),
    },
  });

  res.status(201).json({ suggestion: { id: suggestion.id, message: 'Sugestão enviada com sucesso!' } });
});

export const adminList = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {};
  if (status) where.status = String(status);

  const items = await prisma.suggestion.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  res.json({ items });
});

export const markAs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;
  const valid = ['PENDING', 'READ', 'APPROVED', 'REJECTED', 'IMPLEMENTED'];
  if (!valid.includes(status)) throw new ApiError(400, 'Status inválido');

  const item = await prisma.suggestion.update({
    where: { id },
    data: { status, adminNote },
  });
  res.json({ item });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.suggestion.delete({ where: { id } });
  res.json({ message: 'Sugestão removida' });
});
