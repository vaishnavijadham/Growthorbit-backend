'use strict';

const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * Generate a signed JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'growth-orbit',
  });
};

/**
 * Generate a signed JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: 'growth-orbit',
  });
};

/**
 * Verify a JWT access token
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }
    throw new AppError('Token verification failed.', 401);
  }
};

/**
 * Verify a JWT refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError('Invalid or expired refresh token.', 401);
  }
};

/**
 * Build token response payload
 */
const createTokenResponse = (user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createTokenResponse,
};
