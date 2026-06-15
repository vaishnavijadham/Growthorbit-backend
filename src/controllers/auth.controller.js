'use strict';

const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.signup({ name, email, password });
  sendSuccess(res, HTTP_STATUS.CREATED, 'Account created successfully. Please log in.', result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  sendSuccess(res, HTTP_STATUS.OK, 'Login successful.', result);
});

const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, HTTP_STATUS.OK, 'User details fetched.', {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    lastLogin: req.user.lastLogin,
    createdAt: req.user.createdAt,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const tokens = await authService.changePassword(req.user._id, { currentPassword, newPassword });
  sendSuccess(res, HTTP_STATUS.OK, 'Password changed successfully.', tokens);
});

const deactivateAccount = asyncHandler(async (req, res) => {
  await authService.deactivateAccount(req.user._id);
  sendSuccess(res, HTTP_STATUS.OK, 'Account deactivated successfully.');
});

module.exports = { signup, login, getMe, changePassword, deactivateAccount };
