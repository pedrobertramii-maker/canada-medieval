import { Router } from 'express';
import * as controller from '../controllers/adminController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

const router = Router();

router.get('/dashboard', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN, AdminRole.STAFF), controller.dashboard);
router.get('/users', authMiddleware, requireRole(AdminRole.OWNER), controller.listAdmins);
router.post('/users', authMiddleware, requireRole(AdminRole.OWNER), controller.createAdmin);
router.put('/users/:id', authMiddleware, requireRole(AdminRole.OWNER), controller.updateAdmin);
router.delete('/users/:id', authMiddleware, requireRole(AdminRole.OWNER), controller.removeAdmin);

export default router;
