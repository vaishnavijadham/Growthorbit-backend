'use strict';

const User = require('../models/User.model');
const Profile = require('../models/Profile.model');
const Gamification = require('../models/Gamification.model');
const Progress = require('../models/Progress.model');
const AppError = require('../utils/AppError');
const { createTokenResponse } = require('../utils/jwt.helper');
const logger = require('../utils/logger');

/**
 * Register a new user, create associated profile + gamification + progress docs
 */
const signup = async ({ name, email, password }) => {
  // Check duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // Create user (password hashed via pre-save hook)
  const user = await User.create({ name, email, password });

  // Create associated profile
  const profile = await Profile.create({ user: user._id });

  // Link profile to user
  await User.findByIdAndUpdate(user._id, { profile: profile._id });

  // Initialize gamification record
  await Gamification.create({ user: user._id });

  // Initialize progress record
  await Progress.create({ user: user._id });

  logger.info(`New user registered: ${email}`);

  // Generate tokens
  const tokens = createTokenResponse(user);

  // Save refresh token
  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    ...tokens,
  };
};

/**
 * Login existing user
 */
const login = async ({ email, password }) => {
  // Find user with password field
  const user = await User.findOne({ email }).select('+password +refreshToken');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const tokens = createTokenResponse(user);

  // Persist refresh token
  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  logger.info(`User logged in: ${email}`);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    },
    ...tokens,
  };
};

/**
 * Change user password
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found.', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect.', 400);

  user.password = newPassword;
  await user.save();

  const tokens = createTokenResponse(user);
  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  logger.info(`Password changed for user: ${user.email}`);
  return tokens;
};

/**
 * Deactivate account (soft delete)
 */
const deactivateAccount = async (userId) => {
  await User.findByIdAndUpdate(userId, { isActive: false });
  logger.info(`Account deactivated: ${userId}`);
};

module.exports = { signup, login, changePassword, deactivateAccount };
