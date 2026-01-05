import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { z } from 'zod';
import User from '../models/userModel.js';
import Event from '../models/eventModel.js';
import GalleryItem from '../models/galleryModel.js';
import ContactMessage from '../models/contactModel.js';
import Branch from '../models/branchModel.js';

// Validation schemas
const galleryItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().url(),
  category: z.string().trim().optional(),
  isFeatured: z.boolean().optional()
});

const eventSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  startDate: z.string().transform(val => new Date(val)),
  endDate: z.string().transform(val => val ? new Date(val) : undefined).optional(),
  coverImage: z.string().trim().url().optional(),
  isPublished: z.boolean().optional()
});

const contactUpdateSchema = z.object({
  status: z.enum(['new', 'in_progress', 'resolved']).optional(),
  adminNotes: z.string().trim().optional(),
  archived: z.boolean().optional()
});

const branchSchema = z.object({
  name: z.string().trim().min(1, 'Branch name is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  est: z.string().trim().optional().default(''),
  members: z.string().trim().optional().default(''),
  description: z.string().trim().optional().default('')
});

export const getAdminOverview = asyncHandler(async (_req, res) => {
  const [totalUsers, activeUsers, adminUsers, totalEvents, publishedEvents, totalGallery, featuredGallery, inboxNew, inboxOpen] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'admin' }),
      Event.countDocuments(),
      Event.countDocuments({ isPublished: true }),
      GalleryItem.countDocuments(),
      GalleryItem.countDocuments({ isFeatured: true }),
      ContactMessage.countDocuments({ status: 'new', archived: false }),
      ContactMessage.countDocuments({ status: { $in: ['new', 'in_progress'] }, archived: false })
    ]);

  res.json({
    users: {
      total: totalUsers,
      active: activeUsers,
      admins: adminUsers
    },
    events: {
      total: totalEvents,
      published: publishedEvents
    },
    gallery: {
      total: totalGallery,
      featured: featuredGallery
    },
    inbox: {
      new: inboxNew,
      open: inboxOpen
    }
  });
});

// Gallery CRUD
export const getGalleryItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category } = req.query;
  const filters = {};
  
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (category) {
    filters.category = category;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [items, total] = await Promise.all([
    GalleryItem.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email'),
    GalleryItem.countDocuments(filters)
  ]);

  res.json({
    items,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  const payload = galleryItemSchema.parse(req.body);
  const item = await GalleryItem.create({
    ...payload,
    createdBy: req.user.id
  });
  
  const populatedItem = await GalleryItem.findById(item._id)
    .populate('createdBy', 'name email');
    
  res.status(201).json({ item: populatedItem });
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const payload = galleryItemSchema.parse(req.body);
  const item = await GalleryItem.findById(req.params.id);
  
  if (!item) {
    throw new HttpError(404, 'Gallery item not found.');
  }

  Object.assign(item, payload);
  await item.save();
  
  const populatedItem = await GalleryItem.findById(item._id)
    .populate('createdBy', 'name email');
    
  res.json({ item: populatedItem });
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  
  if (!item) {
    throw new HttpError(404, 'Gallery item not found.');
  }

  await item.deleteOne();
  res.status(204).send();
});

// Events CRUD
export const getEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filters = {};
  
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [events, total] = await Promise.all([
    Event.find(filters)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email'),
    Event.countDocuments(filters)
  ]);

  res.json({
    events,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const payload = eventSchema.parse(req.body);
  const event = await Event.create({
    ...payload,
    createdBy: req.user.id
  });
  
  const populatedEvent = await Event.findById(event._id)
    .populate('createdBy', 'name email');
    
  res.status(201).json({ event: populatedEvent });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const payload = eventSchema.parse(req.body);
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    throw new HttpError(404, 'Event not found.');
  }

  Object.assign(event, payload);
  await event.save();
  
  const populatedEvent = await Event.findById(event._id)
    .populate('createdBy', 'name email');
    
  res.json({ event: populatedEvent });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    throw new HttpError(404, 'Event not found.');
  }

  await event.deleteOne();
  res.status(204).send();
});

// Contact Messages Management
export const getContactMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const filters = { archived: false };
  
  if (status) {
    filters.status = status;
  }
  
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [messages, total] = await Promise.all([
    ContactMessage.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    ContactMessage.countDocuments(filters)
  ]);

  res.json({
    messages,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const payload = contactUpdateSchema.parse(req.body);
  const message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    throw new HttpError(404, 'Contact message not found.');
  }

  Object.assign(message, payload);
  
  if (payload.status === 'resolved' && message.status !== 'resolved') {
    message.respondedAt = new Date();
  }
  
  await message.save();
  res.json({ message });
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    throw new HttpError(404, 'Contact message not found.');
  }

  await message.deleteOne();
  res.status(204).send();
});

// Branch Management
export const getBranchesAdmin = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filters = {};

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  const branches = await Branch.find(filters).sort({ createdAt: -1 });

  res.json({ branches });
});

export const createBranch = asyncHandler(async (req, res) => {
  const payload = branchSchema.parse({
    ...req.body,
    lat: Number(req.body.lat),
    lng: Number(req.body.lng)
  });

  const branch = await Branch.create({
    ...payload,
    createdBy: req.user.id
  });

  res.status(201).json({ branch });
});

export const updateBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    throw new HttpError(404, 'Branch not found.');
  }

  const payload = branchSchema.partial().parse({
    ...req.body,
    lat: req.body.lat !== undefined ? Number(req.body.lat) : branch.lat,
    lng: req.body.lng !== undefined ? Number(req.body.lng) : branch.lng
  });

  Object.assign(branch, payload);
  await branch.save();

  res.json({ branch });
});

export const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    throw new HttpError(404, 'Branch not found.');
  }

  await branch.deleteOne();
  res.status(204).send();
});
