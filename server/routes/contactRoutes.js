import express from 'express';

import {
  submitContactMessage,
  adminListContactMessages,
  adminUpdateContactMessage
} from '../controllers/contactController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactMessage);

router.get('/admin', protect, requireAdmin, adminListContactMessages);
router.put('/admin/:id', protect, requireAdmin, adminUpdateContactMessage);

export default router;
