import { z } from 'zod';

import GalleryItem from '../models/galleryModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const gallerySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().max(2000).optional(),
  imageUrl: z.string().trim().url(),
  category: z.string().trim().max(120).optional(),
  isFeatured: z.boolean().optional()
});

const updateGallerySchema = gallerySchema.partial().refine(data => Object.keys(data).length > 0, {
  message: 'Provide at least one field to update.'
});

export const getPublicGallery = asyncHandler(async (_req, res) => {
  const gallery = await GalleryItem.find({}).sort({ createdAt: -1 });
  res.json({ gallery });
});

export const adminListGallery = asyncHandler(async (_req, res) => {
  const gallery = await GalleryItem.find({}).sort({ createdAt: -1 });
  res.json({ gallery });
});

export const adminCreateGalleryItem = asyncHandler(async (req, res) => {
  const payload = gallerySchema.parse(req.body || {});
  const item = await GalleryItem.create({ ...payload, createdBy: req.user._id });
  res.status(201).json({ item });
});

export const adminUpdateGalleryItem = asyncHandler(async (req, res) => {
  const payload = updateGallerySchema.parse(req.body || {});
  const item = await GalleryItem.findById(req.params.id);

  if (!item) {
    throw new HttpError(404, 'Gallery item not found.');
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      item[key] = value;
    }
  });

  await item.save();
  res.json({ item });
});

export const adminDeleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);

  if (!item) {
    throw new HttpError(404, 'Gallery item not found.');
  }

  await item.deleteOne();
  res.status(204).send();
});
