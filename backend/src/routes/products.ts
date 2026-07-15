import { Router } from 'express';
import multer from 'multer';
import * as productController from '../controllers/productController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  },
});

const router = Router();

// Public
router.get('/', productController.list);
router.get('/featured', productController.featured);
router.get('/:slug', productController.get);

// Admin
router.get('/admin/all', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), productController.adminList);
router.post('/', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), upload.single('image'), productController.create);
router.put('/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), upload.single('image'), productController.update);
router.delete('/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), productController.remove);

export default router;
