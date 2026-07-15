import { Router } from 'express';
import * as controller from '../controllers/ownerController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

const router = Router();

router.get('/', controller.list);
router.get('/skin/:nick', controller.skin);
router.get('/admin/all', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.adminList);
router.post('/', authMiddleware, requireRole(AdminRole.OWNER), controller.create);
router.put('/:id', authMiddleware, requireRole(AdminRole.OWNER), controller.update);
router.delete('/:id', authMiddleware, requireRole(AdminRole.OWNER), controller.remove);

export default router;
