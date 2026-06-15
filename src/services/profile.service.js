'use strict';

const Profile = require('../models/Profile.model');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Get profile by userId, optionally populate user fields
 */
const getProfileByUserId = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).populate('user', 'name email role createdAt');
  if (!profile) throw new AppError('Profile not found.', 404);
  return profile;
};

/**
 * Update profile fields (partial update)
 */
const updateProfile = async (userId, updateData) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!profile) throw new AppError('Profile not found.', 404);
  logger.info(`Profile updated for user: ${userId}`);
  return profile;
};

/**
 * Calculate and return profile completion percentage
 */
const getCompletionStatus = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).select(
    'completionPercent bio phone dateOfBirth linkedIn github avatar education languages hobbies'
  );
  if (!profile) throw new AppError('Profile not found.', 404);

  const sections = {
    personal: !!(profile.bio && profile.phone && profile.dateOfBirth),
    social: !!(profile.linkedIn || profile.github),
    education: !!(profile.education?.current?.institution && profile.education?.current?.course),
    extras: !!(profile.languages?.length && profile.hobbies?.length),
    avatar: !!profile.avatar,
  };

  const completedSections = Object.values(sections).filter(Boolean).length;
  const totalSections = Object.keys(sections).length;
  const percent = Math.floor((completedSections / totalSections) * 100);

  return {
    completionPercent: percent,
    sections,
    completedSections,
    totalSections,
  };
};

/**
 * Create a profile for an existing user (if not yet created)
 */
const ensureProfile = async (userId) => {
  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    profile = await Profile.create({ user: userId });
    await User.findByIdAndUpdate(userId, { profile: profile._id });
    logger.info(`Profile auto-created for user: ${userId}`);
  }
  return profile;
};

module.exports = { getProfileByUserId, updateProfile, getCompletionStatus, ensureProfile };
