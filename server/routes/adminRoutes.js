import express from 'express';

import {
  getAdminOverview,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
  getBranchesAdmin,
  createBranch,
  updateBranch,
  deleteBranch
} from '../controllers/adminController.js';
import { adminListUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '../controllers/userController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

// Overview
router.get('/overview', getAdminOverview);

// Users management
router.get('/users', adminListUsers);
router.post('/users', adminCreateUser);
router.put('/users/:id', adminUpdateUser);
router.delete('/users/:id', adminDeleteUser);

// Gallery management
router.get('/gallery', getGalleryItems);
router.post('/gallery', createGalleryItem);
router.put('/gallery/:id', updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// Events management
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Contact messages management
router.get('/contact', getContactMessages);
router.put('/contact/:id', updateContactMessage);
router.delete('/contact/:id', deleteContactMessage);

// Branch management
router.get('/branches', getBranchesAdmin);
router.post('/branches', createBranch);
router.put('/branches/:id', updateBranch);
router.delete('/branches/:id', deleteBranch);

export default router;
