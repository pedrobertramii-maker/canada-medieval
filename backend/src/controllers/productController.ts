import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError, asyncHandler } from '../middlewares/error';
import { slugify, ensureUniqueSlug } from '../lib/slugify';
import { deleteImage, uploadImage } from '../lib/storage';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, sort = 'recent', minPrice, maxPrice, featured } = req.query;

  const where: any = { status: 'ACTIVE' };
  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } },
      { category: { name: { contains: String(search), mode: 'insensitive' } } },
    ];
  }
  if (category) where.categoryId = String(category);
  if (featured === 'true') where.featured = true;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const orderBy: any =
    sort === 'price_asc' ? { price: 'asc' } :
    sort === 'price_desc' ? { price: 'desc' } :
    sort === 'name' ? { name: 'asc' } :
    { createdAt: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });

  res.json({ products });
});

export const featured = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE', featured: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { category: true },
  });
  res.json({ products });
});

export const get = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { slug: String(req.params.slug) },
    include: { category: true },
  });
  if (!product) throw new ApiError(404, 'Produto não encontrado');
  await prisma.product.update({ where: { id: product.id }, data: { views: { increment: 1 } } });
  res.json({ product });
});

export const create = asyncHandler(async (req: any, res: Response) => {
  const { name, description, price, oldPrice, categoryId, stock, featured, status } = req.body;
  if (!name || !description || !price || !categoryId) {
    throw new ApiError(400, 'Campos obrigatórios: name, description, price, categoryId');
  }
  if (!req.file) throw new ApiError(400, 'Imagem é obrigatória');

  const existing = await prisma.product.findMany({ select: { slug: true } });
  const slug = ensureUniqueSlug(slugify(name), existing.map(p => p.slug));

  const upload = await uploadImage(req.file.buffer, 'products', slug);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      stock: stock ? Number(stock) : null,
      featured: featured === 'true' || featured === true,
      status: status || 'ACTIVE',
      imageUrl: upload.url,
      imagePublicId: upload.publicId,
      categoryId,
    },
    include: { category: true },
  });

  res.status(201).json({ product });
});

export const update = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, description, price, oldPrice, categoryId, stock, featured, status } = req.body;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError(404, 'Produto não encontrado');

  let updateData: any = {
    description,
    price: price ? Number(price) : undefined,
    oldPrice: oldPrice ? Number(oldPrice) : null,
    stock: stock ? Number(stock) : null,
    featured: featured === 'true' || featured === true,
    status: status || product.status,
    categoryId,
  };

  if (name && name !== product.name) {
    const others = await prisma.product.findMany({ where: { NOT: { id } }, select: { slug: true } });
    updateData.name = name;
    updateData.slug = ensureUniqueSlug(slugify(name), others.map(p => p.slug));
  }

  if (req.file) {
    if (product.imagePublicId) await deleteImage(product.imagePublicId);
    const upload = await uploadImage(req.file.buffer, 'products', updateData.slug || product.slug);
    updateData.imageUrl = upload.url;
    updateData.imagePublicId = upload.publicId;
  }

  Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

  const updated = await prisma.product.update({ where: { id }, data: updateData, include: { category: true } });
  res.json({ product: updated });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError(404, 'Produto não encontrado');
  if (product.imagePublicId) await deleteImage(product.imagePublicId);
  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Produto removido' });
});

export const adminList = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
  res.json({ products });
});
