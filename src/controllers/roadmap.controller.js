'use strict';

const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const AppError = require('../utils/AppError'); // ✅ FIXED

const {
  createRoadmapService,
  getRoadmapsService,
  getRoadmapService,
  updateRoadmapService,
  completePhaseService,
  deleteRoadmapService
} = require('../services/roadmap.service');


// ================= CREATE =================
const createRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await createRoadmapService(req.user._id, req.body);

  return sendSuccess(
    res,
    HTTP_STATUS.CREATED,
    'Roadmap created successfully.',
    roadmap
  );
});


// ================= GET ALL =================
const getRoadmaps = asyncHandler(async (req, res) => {
  const result = await getRoadmapsService(req.user._id, req.query);

  return sendPaginated(
    res,
    HTTP_STATUS.OK,
    'Roadmaps fetched successfully.',
    result.roadmaps,
    result.pagination
  );
});


// ================= GET ONE =================
const getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await getRoadmapService(req.user._id, req.params.id);

  return sendSuccess(
    res,
    HTTP_STATUS.OK,
    'Roadmap fetched successfully.',
    roadmap
  );
});


// ================= UPDATE =================
const updateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await updateRoadmapService(
    req.user._id,
    req.params.id,
    req.body
  );

  return sendSuccess(
    res,
    HTTP_STATUS.OK,
    'Roadmap updated successfully.',
    roadmap
  );
});


// ================= COMPLETE PHASE =================
const completePhase = asyncHandler(async (req, res) => {
  const phaseNumber = Number(req.body.phaseNumber);

  if (Number.isNaN(phaseNumber)) {
    throw new AppError('Valid phaseNumber is required', 422);
  }

  const roadmap = await completePhaseService(
    req.user._id,
    req.params.id,
    phaseNumber
  );

  return sendSuccess(
    res,
    HTTP_STATUS.OK,
    'Phase completed successfully.',
    roadmap
  );
});


// ================= DELETE =================
const deleteRoadmap = asyncHandler(async (req, res) => {
  await deleteRoadmapService(req.user._id, req.params.id);

  return sendSuccess(
    res,
    HTTP_STATUS.OK,
    'Roadmap deleted successfully.'
  );
});


// ================= EXPORT =================
module.exports = {
  createRoadmap,
  getRoadmaps,
  getRoadmap,
  updateRoadmap,
  completePhase,
  deleteRoadmap
};