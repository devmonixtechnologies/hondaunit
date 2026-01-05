import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { HttpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { attachAuthCookie, clearAuthCookie, signAuthToken } from '../services/tokenService.js';

const sanitizeUser = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  title: user.title,
  bio: user.bio,
  location: user.location,
  avatarUrl: user.avatarUrl,
  coverImage: user.coverImage,
  description: user.description,
  age: user.age,
  instagram: user.instagram,
  machine: user.machine,
  socialLinks: user.socialLinks,
  publicSlug: user.publicSlug,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const verifyCredentials = async ({ email, password, role }) => {
  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required.');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, 'Invalid credentials.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new HttpError(401, 'Invalid credentials.');
  }

  if (role && user.role !== role) {
    throw new HttpError(403, role === 'admin' ? 'Use the admin portal to sign in.' : 'Use the member portal to sign in.');
  }

  user.lastLoginAt = new Date();
  user.lastLoginIp = user.lastLoginIp || undefined;

  return user;
};

const respondWithSession = async (res, user) => {
  await user.save({ validateBeforeSave: false });

  const token = signAuthToken(user._id);
  attachAuthCookie(res, token);

  res.json({ user: sanitizeUser(user) });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError(400, 'Name, email, and password are required.');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new HttpError(409, 'Email already in use.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'admin' : 'user';

  const user = await User.create({ name, email, passwordHash, role });

  const token = signAuthToken(user._id);
  attachAuthCookie(res, token);

  res.status(201).json({ user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await verifyCredentials({ email: req.body?.email, password: req.body?.password });
  user.lastLoginIp = req.ip;
  await respondWithSession(res, user);
});

export const userLogin = asyncHandler(async (req, res) => {
  const user = await verifyCredentials({ email: req.body?.email, password: req.body?.password, role: 'user' });
  user.lastLoginIp = req.ip;
  await respondWithSession(res, user);
});

export const adminLogin = asyncHandler(async (req, res) => {
  const user = await verifyCredentials({ email: req.body?.email, password: req.body?.password, role: 'admin' });
  user.lastLoginIp = req.ip;
  await respondWithSession(res, user);
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, 'Not authenticated.');
  }

  res.json({ user: sanitizeUser(req.user) });
});
