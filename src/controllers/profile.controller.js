'use strict';

const Profile = require('../models/Profile.model');
const { awardXP } = require('../services/gamification.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const AppError = require('../utils/AppError');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email');
  if (!profile) throw new AppError('Profile not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Profile fetched successfully.', profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'bio', 'phone', 'dateOfBirth', 'linkedIn', 'github', 'portfolio',
    'location', 'education', 'languages', 'hobbies', 'achievements', 'avatar',
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  });

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    updateData,
    { new: true, runValidators: true }
  );

  if (!profile) throw new AppError('Profile not found.', 404);

  // Award XP if profile is now complete
  if (profile.completionPercent === 100) {
    await awardXP(req.user._id, 'PROFILE_COMPLETED', profile._id, 'Profile').catch(() => {});
  }

  sendSuccess(res, HTTP_STATUS.OK, 'Profile updated successfully.', profile);
});

const getProfileCompletion = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).select('completionPercent');
  if (!profile) throw new AppError('Profile not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Profile completion fetched.', {
    completionPercent: profile.completionPercent,
  });
});

module.exports = { getProfile, updateProfile, getProfileCompletion };
