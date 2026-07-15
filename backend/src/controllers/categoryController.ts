import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError, asyncHandler } from '../middlewares/error';
import { slugify, ensureUniqueSlug } from '../lib/slugify';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  res.json({ categories });
});

export const adminList = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  res.json({ categories });
});

export const get = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });
  if (!category) throw new ApiError(404, 'Categoria não encontrada');
  res.json({ category });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, icon, color, order } = req.body;
  if (!name) throw new ApiError(400, 'Nome é obrigatório');

  const existing = await prisma.category.findMany({ select: { slug: true } });
  const slug = ensureUniqueSlug(slugify(name), existing);

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      icon,
      color,
      order: order ? Number(order) : 0,
    },
  });
  res.status(201).json({ category });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, icon, color, order, isActive } = req.body;

  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat) throw new ApiError(404, 'Categoria não encontrada');

  const data: any = { description, icon, color, isActive, order: order ? Number(order) : 0 };
  if (name && name !== cat.name) {
    const others = await prisma.category.findMany({ where: { NOT: { id } }, select: { slug: true } });
    data.name = name;
    data.slug = ensureUniqueSlug(slugify(name), others);
  }

  const updated = await prisma.category.update({ where: { id }, data });
  res.json({ category: updated });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) throw new ApiError(400, 'Existem produtos vinculados a esta categoria');
  await prisma.category.delete({ where: { id } });
  res.json({ message: 'Categoria removida' });
});
