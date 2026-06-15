'use strict';

const progressService = require('../services/progress.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

const getProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.getProgress(req.user._id);
  sendSuccess(res, HTTP_STATUS.OK, 'Progress fetched.', progress);
});

const recalculateProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.recalculateProgress(req.user._id);
  sendSuccess(res, HTTP_STATUS.OK, 'Progress recalculated.', progress);
});

module.exports = { getProgress, recalculateProgress };
