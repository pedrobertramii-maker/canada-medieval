import { Router } from 'express';
import * as controller from '../controllers/settingController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

const router = Router();

router.get('/', controller.publicList);
router.get('/admin/all', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.list);
router.put('/admin/all', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.update);

export default router;
