'use strict';

const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

const getDashboard = asyncHandler(async (req, res) => {
  const summary = await dashboardService.buildDashboardSummary(req.user._id);
  sendSuccess(res, HTTP_STATUS.OK, 'Dashboard data fetched successfully.', summary);
});

const getActivityTimeline = asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const timeline = await dashboardService.getActivityTimeline(req.user._id, limit);
  sendSuccess(res, HTTP_STATUS.OK, 'Activity timeline fetched.', timeline);
});

module.exports = { getDashboard, getActivityTimeline };
