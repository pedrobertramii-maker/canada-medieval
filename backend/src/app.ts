import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import { env } from './lib/env';
import { errorHandler } from './middlewares/error';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import updateRoutes from './routes/updates';
import suggestionRoutes from './routes/suggestions';
import ownerRoutes from './routes/owners';
import adminRoutes from './routes/admins';
import settingRoutes from './routes/settings';

export function createApp(): Application {
  const app = express();

  // Segurança
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(xss());
  app.use(compression());

  // Rate limit global
  app.use(
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Muitas requisições, tente novamente mais tarde.' },
    })
  );

  // Body parsers
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Health
  app.get('/health', (_req, res) => res.json({ ok: true, service: 'canada-medieval-api' }));

  // API
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/updates', updateRoutes);
  app.use('/api/suggestions', suggestionRoutes);
  app.use('/api/owners', ownerRoutes);
  app.use('/api/admins', adminRoutes);
  app.use('/api/settings', settingRoutes);

  // 404
  app.use((_req, res) => res.status(404).json({ error: 'Endpoint não encontrado' }));

  // Error handler
  app.use(errorHandler);

  return app;
}
