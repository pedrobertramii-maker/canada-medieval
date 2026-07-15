import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError, asyncHandler } from '../middlewares/error';
import { slugify, ensureUniqueSlug } from '../lib/slugify';
import { deleteImage, uploadImage } from '../lib/storage';
import { AuthRequest } from '../middlewares/auth';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, page = '1', limit = '9' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = { published: true };
  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { excerpt: { contains: String(search), mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.update.findMany({
      where,
      orderBy: [{ pinned: 'desc' }, { publishedAt: 'desc' }],
      skip,
      take: Number(limit),
      include: { author: { select: { name: true, username: true, avatar: true } } },
    }),
    prisma.update.count({ where }),
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const get = asyncHandler(async (req: Request, res: Response) => {
  const update = await prisma.update.findUnique({
    where: { slug: String(req.params.slug) },
    include: { author: { select: { name: true, username: true, avatar: true } } },
  });
  if (!update) throw new ApiError(404, 'Atualização não encontrada');
  await prisma.update.update({ where: { id: update.id }, data: { views: { increment: 1 } } });
  res.json({ update });
});

export const create = asyncHandler(async (req: any, res: Response) => {
  const { title, excerpt, content, pinned, published } = req.body;
  if (!title || !excerpt || !content) throw new ApiError(400, 'Campos obrigatórios: title, excerpt, content');
  if (!req.file) throw new ApiError(400, 'Imagem é obrigatória');

  const existing = await prisma.update.findMany({ select: { slug: true } });
  const slug = ensureUniqueSlug(slugify(title), existing.map(s => s.slug));

  const upload = await uploadImage(req.file.buffer, 'updates', slug);
  const author = (req as AuthRequest).admin!;

  const item = await prisma.update.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      pinned: pinned === 'true' || pinned === true,
      published: published === 'true' || published === true || published === undefined,
      imageUrl: upload.url,
      imagePublicId: upload.publicId,
      authorId: author.id,
    },
    include: { author: { select: { name: true, username: true } } },
  });

  res.status(201).json({ update: item });
});

export const update_ = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, excerpt, content, pinned, published } = req.body;

  const item = await prisma.update.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, 'Atualização não encontrada');

  const data: any = { excerpt, content, pinned: pinned === 'true', published: published === 'true' };
  if (title && title !== item.title) {
    const others = await prisma.update.findMany({ where: { NOT: { id } }, select: { slug: true } });
    data.title = title;
    data.slug = ensureUniqueSlug(slugify(title), others);
  }
  if (req.file) {
    if (item.imagePublicId) await deleteImage(item.imagePublicId);
    const upload = await uploadImage(req.file.buffer, 'updates', data.slug || item.slug);
    data.imageUrl = upload.url;
    data.imagePublicId = upload.publicId;
  }
  Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

  const updated = await prisma.update.update({ where: { id }, data, include: { author: { select: { name: true } } } });
  res.json({ update: updated });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.update.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, 'Atualização não encontrada');
  if (item.imagePublicId) await deleteImage(item.imagePublicId);
  await prisma.update.delete({ where: { id } });
  res.json({ message: 'Atualização removida' });
});
