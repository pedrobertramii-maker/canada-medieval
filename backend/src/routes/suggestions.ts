import { Router } from 'express';
import { body } from 'express-validator';
import * as controller from '../controllers/suggestionController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { AdminRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  [
    body('name').isString().trim().isLength({ min: 2, max: 80 }),
    body('title').isString().trim().isLength({ min: 3, max: 120 }),
    body('description').isString().trim().isLength({ min: 5, max: 2000 }),
    body('discord').optional().isString().trim().isLength({ max: 80 }),
  ],
  controller.create
);

router.get('/admin/all', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN, AdminRole.STAFF), controller.adminList);
router.patch('/admin/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN, AdminRole.STAFF), controller.markAs);
router.delete('/admin/:id', authMiddleware, requireRole(AdminRole.OWNER, AdminRole.ADMIN), controller.remove);

export default router;
