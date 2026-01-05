import express from 'express';

import {
  getPublicEvents,
  adminListEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent
} from '../controllers/eventController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicEvents);

router.get('/admin', protect, requireAdmin, adminListEvents);
router.post('/admin', protect, requireAdmin, adminCreateEvent);
router.put('/admin/:id', protect, requireAdmin, adminUpdateEvent);
router.delete('/admin/:id', protect, requireAdmin, adminDeleteEvent);

export default router;
