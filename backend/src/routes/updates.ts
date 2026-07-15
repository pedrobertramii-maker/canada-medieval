import { Router } from 'express';
import multer from 'multer';
import * as controller from '../controllers/updateController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpe?g|png|webp)$/i.test(file.mimetype)) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  },
});

const router = Router();

router.get('/', controller.list);
router.get('/:slug', controller.get);
router.post('/', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN, AdminRole.STAFF), upload.single('image'), controller.create);
router.put('/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN, AdminRole.STAFF), upload.single('image'), controller.update_);
router.delete('/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.remove);

export default router;
