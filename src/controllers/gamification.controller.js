'use strict';

const gamificationService = require('../services/gamification.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

const getMySummary = asyncHandler(async (req, res) => {
  const summary = await gamificationService.getGamificationSummary(req.user._id);
  sendSuccess(res, HTTP_STATUS.OK, 'Gamification summary fetched.', summary);
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const leaderboard = await gamificationService.getLeaderboard(limit);
  sendSuccess(res, HTTP_STATUS.OK, 'Leaderboard fetched.', leaderboard);
});

module.exports = { getMySummary, getLeaderboard };
