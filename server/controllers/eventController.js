import { z } from 'zod';

import Event from '../models/eventModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const dateSchema = z.preprocess(value => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}, z.date({ required_error: 'Date is required.', invalid_type_error: 'Invalid date.' }));

const baseEventSchema = {
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().trim().max(2000).optional(),
  location: z.string().trim().max(255).optional(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  coverImage: z.string().trim().url().optional(),
  isPublished: z.boolean().optional()
};

const createEventSchema = z.object(baseEventSchema);
const updateEventSchema = z
  .object({ ...baseEventSchema })
  .partial()
  .refine(data => Object.keys(data).length > 0, 'Provide at least one field.');

const parsePagination = query => {
  const limit = Math.min(parseInt(query.limit || '20', 10), 100);
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const skip = (page - 1) * limit;
  return { limit, page, skip };
};

export const getPublicEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isPublished: true }).sort({ startDate: 1 });
  res.json({ events });
});

export const adminListEvents = asyncHandler(async (req, res) => {
  const { limit, page, skip } = parsePagination(req.query);
  const filters = {};

  if (req.query.published) {
    filters.isPublished = req.query.published === 'true';
  }

  const [events, total] = await Promise.all([
    Event.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Event.countDocuments(filters)
  ]);

  res.json({ events, pagination: { total, page, pages: Math.ceil(total / limit) } });
});

export const adminCreateEvent = asyncHandler(async (req, res) => {
  const payload = createEventSchema.parse(req.body || {});

  if (payload.endDate && payload.endDate < payload.startDate) {
    throw new HttpError(400, 'End date cannot be earlier than start date.');
  }

  const event = await Event.create({ ...payload, createdBy: req.user._id });

  res.status(201).json({ event });
});

export const adminUpdateEvent = asyncHandler(async (req, res) => {
  const payload = updateEventSchema.parse(req.body || {});
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new HttpError(404, 'Event not found.');
  }

  if (payload.endDate && payload.startDate && payload.endDate < payload.startDate) {
    throw new HttpError(400, 'End date cannot be earlier than start date.');
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      event[key] = value;
    }
  });

  await event.save();

  res.json({ event });
});

export const adminDeleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new HttpError(404, 'Event not found.');
  }

  await event.deleteOne();
  res.status(204).send();
});
