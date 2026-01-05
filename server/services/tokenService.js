import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'access_token';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable.');
  }

  return process.env.JWT_SECRET;
};

export const signAuthToken = userId => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const buildCookieOptions = () => {
  const days = parseInt((process.env.JWT_COOKIE_DAYS || '7').trim(), 10);
  const maxAgeMs = Number.isFinite(days) ? days * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: maxAgeMs,
    path: '/'
  };
};

export const attachAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, buildCookieOptions());
};

export const clearAuthCookie = res => {
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
};

export const decodeToken = token => {
  return jwt.verify(token, getJwtSecret());
};

export const extractTokenFromRequest = req => {
  if (req.cookies?.[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};
