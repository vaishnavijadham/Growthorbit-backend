'use strict';

const rateLimit = require('express-rate-limit');
const { HTTP_STATUS } = require('../constants');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      message,
    },
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  });

// General API limiter
const general = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  'Too many requests from this IP. Please try again after 15 minutes.'
);

// Strict limiter for auth routes
const auth = createLimiter(
  15 * 60 * 1000, // 15 min
  20,
  'Too many authentication attempts. Please try again after 15 minutes.'
);

// Very strict for password reset / sensitive operations
const strict = createLimiter(
  60 * 60 * 1000, // 1 hour
  5,
  'Too many requests for this operation. Please try again after 1 hour.'
);

module.exports = { general, auth, strict };
