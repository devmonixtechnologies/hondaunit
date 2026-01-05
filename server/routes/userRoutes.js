import express from 'express';

import {
  getPublicUsers,
  getPublicProfile,
  updateProfile,
  updatePassword,
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
} from '../controllers/userController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoints
router.get('/', getPublicUsers);
router.get('/:slug', getPublicProfile);

// Authenticated user dashboard
router.put('/me', protect, updateProfile);
router.put('/me/password', protect, updatePassword);

// Admin endpoints
router.get('/admin/list', protect, requireAdmin, adminListUsers);
router.post('/admin', protect, requireAdmin, adminCreateUser);
router.put('/admin/:id', protect, requireAdmin, adminUpdateUser);
router.delete('/admin/:id', protect, requireAdmin, adminDeleteUser);

export default router;
