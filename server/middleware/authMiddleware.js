import User from '../models/userModel.js';
import { HttpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { decodeToken, extractTokenFromRequest } from '../services/tokenService.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractTokenFromRequest(req);

  if (!token) {
    throw new HttpError(401, 'Authentication required.');
  }

  try {
    const payload = decodeToken(token);
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new HttpError(401, 'Account unavailable.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification failed:', error.message);
    throw new HttpError(401, 'Invalid or expired session.');
  }
});

export const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new HttpError(403, 'Admin privileges required.');
  }

  next();
};
