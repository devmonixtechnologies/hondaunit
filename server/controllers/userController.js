import bcrypt from 'bcryptjs';
import { z } from 'zod';

import User from '../models/userModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { toSafeUser } from '../lib/userSerializer.js';

const socialLinkSchema = z.object({
  platform: z.string().trim().min(1),
  url: z
    .string()
    .trim()
    .optional()
    .refine(val => !val || /^https?:\/\//.test(val), 'Social link must be a valid URL.'),
  handle: z.string().trim().optional()
});

const profileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  title: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(600).optional(),
  location: z.string().trim().max(120).optional(),
  avatarUrl: z.string().trim().url().optional(),
  coverImage: z.string().trim().url().optional(),
  description: z.string().trim().max(2000).optional(),
  age: z.number().min(13).max(120).optional(),
  instagram: z.string().trim().optional(),
  machine: z.string().trim().optional(),
  socialLinks: z.array(socialLinkSchema).max(8).optional()
});

const adminUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role: z.enum(['user', 'admin']).default('user')
});

const adminUserUpdateSchema = profileSchema.extend({
  role: z.enum(['user', 'admin']).optional(),
  email: z.string().trim().email().optional(),
  isActive: z.boolean().optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8)
});

const parsePagination = query => {
  const limit = Math.min(parseInt(query.limit || '20', 10), 100);
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const skip = (page - 1) * limit;
  return { limit, page, skip };
};

export const getPublicUsers = asyncHandler(async (req, res) => {
  const { limit, page, skip } = parsePagination(req.query);
  const filters = { isActive: true };

  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { title: { $regex: req.query.search, $options: 'i' } },
      { instagram: { $regex: req.query.search, $options: 'i' } },
      { machine: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filters)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filters)
  ]);

  res.json({
    users: users.map(user => user.toPublicProfile()),
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ publicSlug: req.params.slug, isActive: true });

  if (!user) {
    throw new HttpError(404, 'Profile not found.');
  }

  res.json({ profile: user.toPublicProfile() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const payload = profileSchema.parse(req.body || {});
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new HttpError(404, 'User not found.');
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      user[key] = value;
    }
  });

  if (payload.socialLinks) {
    user.socialLinks = payload.socialLinks.filter(link => link.platform?.trim());
  }

  await user.save();

  res.json({ user: toSafeUser(user) });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = passwordSchema.parse(req.body || {});
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new HttpError(404, 'User not found.');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isMatch) {
    throw new HttpError(400, 'Current password is incorrect.');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json({ message: 'Password updated successfully.' });
});

export const adminListUsers = asyncHandler(async (req, res) => {
  const { limit, page, skip } = parsePagination(req.query);
  const filters = {};

  if (req.query.role) {
    filters.role = req.query.role;
  }

  if (req.query.active) {
    filters.isActive = req.query.active === 'true';
  }

  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filters)
  ]);

  res.json({
    users: users.map(toSafeUser),
    pagination: { total, page, pages: Math.ceil(total / limit) }
  });
});

export const adminCreateUser = asyncHandler(async (req, res) => {
  const payload = adminUserSchema.parse(req.body || {});

  const exists = await User.findOne({ email: payload.email });

  if (exists) {
    throw new HttpError(409, 'Email already registered.');
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    passwordHash,
    role: payload.role
  });

  res.status(201).json({ user: toSafeUser(user) });
});

export const adminUpdateUser = asyncHandler(async (req, res) => {
  const payload = adminUserUpdateSchema.parse(req.body || {});
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new HttpError(404, 'User not found.');
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      user[key] = value;
    }
  });

  await user.save();

  res.json({ user: toSafeUser(user) });
});

export const adminDeleteUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    throw new HttpError(400, 'You cannot delete your own account.');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new HttpError(404, 'User not found.');
  }

  await user.deleteOne();

  res.status(204).send();
});
