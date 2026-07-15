import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/error';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.setting.findMany();
  const obj: Record<string, any> = {};
  for (const s of settings) {
    if (s.type === 'json') {
      try { obj[s.key] = JSON.parse(s.value); } catch { obj[s.key] = s.value; }
    } else if (s.type === 'boolean') {
      obj[s.key] = s.value === 'true';
    } else if (s.type === 'number') {
      obj[s.key] = Number(s.value);
    } else {
      obj[s.key] = s.value;
    }
  }
  res.json({ settings: obj });
});

export const publicList = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.setting.findMany({
    where: { group: { in: ['general', 'social', 'theme'] } },
  });
  const obj: Record<string, any> = {};
  for (const s of settings) obj[s.key] = s.value;
  res.json({ settings: obj });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Payload inválido' });
  }
  const ops = Object.entries(updates).map(([key, value]: [string, any]) =>
    prisma.setting.upsert({
      where: { key },
      update: { value: String(value), type: typeof value === 'object' ? 'json' : typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string' },
      create: { key, value: String(value), type: typeof value === 'object' ? 'json' : typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string' },
    })
  );
  await Promise.all(ops);
  res.json({ message: 'Configurações atualizadas' });
});
