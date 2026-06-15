'use strict';

const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// ─── Handle specific Mongoose/JWT errors ─────────────────────────────────────

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`Duplicate field value: "${value}" for field "${field}". Please use a different value.`, 409);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${errors.join('. ')}`, 422, errors);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// ─── Dev vs Prod error response ───────────────────────────────────────────────

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err.errors || null,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Operational errors: safe to send to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || null,
    });
  }
  // Programming / unknown errors: don't leak details
  logger.error('UNKNOWN ERROR:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};

// ─── Global Error Handler ─────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }

  // Transform known errors into operational AppErrors
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return sendErrorProd(error, res);
};

module.exports = errorHandler;
