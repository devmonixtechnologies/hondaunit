import express from 'express';

import {
  register,
  login,
  userLogin,
  adminLogin,
  logout,
  getCurrentUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/user/login', userLogin);
router.post('/admin/login', adminLogin);

router.post('/logout', logout);
router.post('/user/logout', logout);
router.post('/admin/logout', logout);

router.get('/me', protect, getCurrentUser);

export default router;
