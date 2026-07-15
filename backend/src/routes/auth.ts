import { Router } from 'express';
import { body } from 'express-validator';
import { login, refresh, me, changePassword } from '../controllers/authController';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

const router = Router();

router.post(
  '/login',
  [
    body('username').isString().trim().isLength({ min: 3, max: 50 }),
    body('password').isString().isLength({ min: 6, max: 100 }),
  ],
  login
);

router.post('/refresh', refresh);
router.get('/me', authMiddleware, me);
router.post('/change-password', authMiddleware, changePassword);

export default router;
