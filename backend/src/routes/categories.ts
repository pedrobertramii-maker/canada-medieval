import { Router } from 'express';
import * as controller from '../controllers/categoryController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

const router = Router();

router.get('/', controller.list);
router.get('/admin/all', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.adminList);
router.get('/:slug', controller.get);
router.post('/', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.create);
router.put('/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.update);
router.delete('/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.remove);

export default router;
