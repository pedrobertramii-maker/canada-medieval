import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError, asyncHandler } from '../middlewares/error';
import { getSkinData, getSkinUrls } from '../lib/skin';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const owners = await prisma.owner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  // Enriquece com URLs de skin
  const enriched = await Promise.all(
    owners.map(async (o) => {
      const skin = getSkinUrls(o.minecraftNick, 256);
      return { ...o, skin };
    })
  );

  res.json({ owners: enriched });
});

export const adminList = asyncHandler(async (_req: Request, res: Response) => {
  const owners = await prisma.owner.findMany({ orderBy: { order: 'asc' } });
  res.json({ owners });
});

export const skin = asyncHandler(async (req: Request, res: Response) => {
  const { nick } = req.params;
  const data = await getSkinData(nick);
  res.json(data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, minecraftNick, role, description, order } = req.body;
  if (!name || !minecraftNick || !role || !description) {
    throw new ApiError(400, 'Campos obrigatórios: name, minecraftNick, role, description');
  }
  const existing = await prisma.owner.findUnique({ where: { minecraftNick } });
  if (existing) throw new ApiError(409, 'Já existe um dono com este nick');

  const owner = await prisma.owner.create({
    data: {
      name,
      minecraftNick,
      role,
      description,
      order: order ? Number(order) : 99,
    },
  });
  res.status(201).json({ owner });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, minecraftNick, role, description, order, isActive } = req.body;

  const owner = await prisma.owner.findUnique({ where: { id } });
  if (!owner) throw new ApiError(404, 'Dono não encontrado');

  const data: any = { name, role, description, isActive, order: order ? Number(order) : owner.order };
  if (minecraftNick && minecraftNick !== owner.minecraftNick) {
    const dup = await prisma.owner.findUnique({ where: { minecraftNick } });
    if (dup) throw new ApiError(409, 'Já existe um dono com este nick');
    data.minecraftNick = minecraftNick;
  }
  Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

  const updated = await prisma.owner.update({ where: { id }, data });
  res.json({ owner: updated });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.owner.delete({ where: { id } });
  res.json({ message: 'Dono removido' });
});
