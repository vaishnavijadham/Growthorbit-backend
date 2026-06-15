'use strict';

const { verifyAccessToken } = require('../utils/jwt.helper');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { USER_ROLES } = require('../constants');

/**
 * Protect routes — verifies JWT and attaches user to req
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1. Extract token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in. Please log in to get access.', 401);
  }

  // 2. Verify token
  const decoded = verifyAccessToken(token);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  // 4. Check if account is active
  if (!currentUser.isActive) {
    throw new AppError('This account has been deactivated. Please contact support.', 401);
  }

  // 5. Check if password changed after token was issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    throw new AppError('User recently changed password. Please log in again.', 401);
  }

  // Attach user to request
  req.user = currentUser;
  next();
});

/**
 * Restrict access to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

/**
 * Admin-only middleware shorthand
 */
const adminOnly = restrictTo(USER_ROLES.ADMIN);

module.exports = { protect, restrictTo, adminOnly };
