import express from 'express';

import {
  getPublicGallery,
  adminListGallery,
  adminCreateGalleryItem,
  adminUpdateGalleryItem,
  adminDeleteGalleryItem
} from '../controllers/galleryController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublicGallery);

router.get('/admin', protect, requireAdmin, adminListGallery);
router.post('/admin', protect, requireAdmin, adminCreateGalleryItem);
router.put('/admin/:id', protect, requireAdmin, adminUpdateGalleryItem);
router.delete('/admin/:id', protect, requireAdmin, adminDeleteGalleryItem);

export default router;
