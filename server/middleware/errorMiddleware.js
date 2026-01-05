import { HttpError } from '../utils/httpError.js';

export const notFound = (req, _res, next) => {
  next(new HttpError(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal server error'
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
