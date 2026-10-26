import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').optional().isString()],
  validate,
  authController.register
);

router.post('/login', [body('email').isEmail(), body('password').exists()], validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
