'use strict';

const Gamification = require('../models/Gamification.model');
const { XP_VALUES } = require('../constants');
const { calculateLevel } = require('../helpers/xp.helper');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Award XP to a user for a specific action.
 * Updates level, history, and stats automatically.
 */
const awardXP = async (userId, action, referenceId = null, referenceModel = null, customXP = null) => {
  const xpAmount = customXP || XP_VALUES[action];
  if (!xpAmount) {
    throw new AppError(`Unknown XP action: ${action}`, 400);
  }

  const gamification = await Gamification.findOne({ user: userId });
  if (!gamification) {
    throw new AppError('Gamification record not found.', 404);
  }

  // Add XP
  gamification.totalXP += xpAmount;

  // Recalculate level
  const levelInfo = calculateLevel(gamification.totalXP);
  const leveledUp = levelInfo.level > gamification.currentLevel;
  gamification.currentLevel = levelInfo.level;
  gamification.levelTitle = levelInfo.title;

  // Record history
  gamification.xpHistory.push({
    action,
    xpAmount,
    description: `Earned ${xpAmount} XP for ${action.replace(/_/g, ' ').toLowerCase()}`,
    referenceId,
    referenceModel,
    earnedAt: new Date(),
  });

  // Update stats
  if (action === 'TASK_COMPLETION') gamification.stats.tasksCompleted += 1;
  if (action === 'TEST_PASS') gamification.stats.testsPassed += 1;
  if (action === 'CERTIFICATE_UPLOAD') gamification.stats.certificatesUploaded += 1;

  // Streak logic
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActivity = gamification.lastActivityDate
    ? new Date(gamification.lastActivityDate).setHours(0, 0, 0, 0)
    : null;

  if (!lastActivity) {
    gamification.currentStreak = 1;
  } else if (today === lastActivity) {
    // Same day, no streak change
  } else if (today - lastActivity === 86400000) {
    // Next consecutive day
    gamification.currentStreak += 1;
    if (gamification.currentStreak > gamification.longestStreak) {
      gamification.longestStreak = gamification.currentStreak;
    }
  } else {
    // Streak broken
    gamification.currentStreak = 1;
  }
  gamification.lastActivityDate = new Date();

  await gamification.save();

  logger.info(`XP awarded: ${xpAmount} to user ${userId} for action ${action}`);

  return {
    xpEarned: xpAmount,
    totalXP: gamification.totalXP,
    leveledUp,
    currentLevel: gamification.currentLevel,
    levelTitle: gamification.levelTitle,
    levelInfo,
  };
};

/**
 * Get gamification summary for a user
 */
const getGamificationSummary = async (userId) => {
  const gamification = await Gamification.findOne({ user: userId });
  if (!gamification) throw new AppError('Gamification record not found.', 404);

  const levelInfo = calculateLevel(gamification.totalXP);

  return {
    totalXP: gamification.totalXP,
    currentLevel: gamification.currentLevel,
    levelTitle: gamification.levelTitle,
    levelInfo,
    streak: {
      current: gamification.currentStreak,
      longest: gamification.longestStreak,
      lastActivity: gamification.lastActivityDate,
    },
    stats: gamification.stats,
    badges: gamification.badges,
    recentXP: gamification.xpHistory.slice(-10).reverse(),
  };
};

/**
 * Get leaderboard (top N users by XP)
 */
const getLeaderboard = async (limit = 10) => {
  return Gamification.find()
    .sort({ totalXP: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .select('totalXP currentLevel levelTitle user stats');
};

module.exports = { awardXP, getGamificationSummary, getLeaderboard };
