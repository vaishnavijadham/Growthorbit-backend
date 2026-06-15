'use strict';

const User = require('../models/User.model');
const Certificate = require('../models/Certificate.model');
const { SkillCatalog } = require('../models/Skill.model');
const { Question } = require('../models/Task.model');
const testService = require('../services/test.service');
const certificateService = require('../services/certificate.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { HTTP_STATUS, CERTIFICATE_STATUS } = require('../constants');
const AppError = require('../utils/AppError');
const { getPagination, getSort } = require('../helpers/pagination.helper');

// ── User Management ───────────────────────────────────────────────────────────

const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const sort = getSort(req.query.sort, { createdAt: -1 });
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).select('-password -refreshToken').sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  sendPaginated(res, HTTP_STATUS.OK, 'Users fetched.', users, { total, page, limit });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshToken')
    .populate('profile');
  if (!user) throw new AppError('User not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'User fetched.', user);
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found.', 404);
  if (user.role === 'admin') throw new AppError('Cannot deactivate an admin account.', 403);

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, HTTP_STATUS.OK, `User account ${user.isActive ? 'activated' : 'deactivated'}.`, {
    id: user._id,
    isActive: user.isActive,
  });
});

// ── Certificate Management ─────────────────────────────────────────────────────

const getPendingCertificates = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [certs, total] = await Promise.all([
    Certificate.find({ verificationStatus: CERTIFICATE_STATUS.PENDING })
      .populate('user', 'name email')
      .populate('skill', 'name category')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),
    Certificate.countDocuments({ verificationStatus: CERTIFICATE_STATUS.PENDING }),
  ]);
  sendPaginated(res, HTTP_STATUS.OK, 'Pending certificates fetched.', certs, { total, page, limit });
});

// ── Question Bank Management ──────────────────────────────────────────────────

const createQuestion = asyncHandler(async (req, res) => {
  const question = await Question.create(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Question added.', question);
});

const bulkCreateQuestions = asyncHandler(async (req, res) => {
  const { questions } = req.body;
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new AppError('Questions array is required.', 400);
  }
  const created = await Question.insertMany(questions, { ordered: false });
  sendSuccess(res, HTTP_STATUS.CREATED, `${created.length} questions added.`, { count: created.length });
});

const getQuestions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.skill) filter.skill = req.query.skill;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;

  const [questions, total] = await Promise.all([
    Question.find(filter).populate('skill', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Question.countDocuments(filter),
  ]);

  sendPaginated(res, HTTP_STATUS.OK, 'Questions fetched.', questions, { total, page, limit });
});

const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!question) throw new AppError('Question not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Question updated.', question);
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) throw new AppError('Question not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Question deleted.');
});

// ── Skill Catalog Management ──────────────────────────────────────────────────

const updateSkill = asyncHandler(async (req, res) => {
  const skill = await SkillCatalog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) throw new AppError('Skill not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Skill updated.', skill);
});

const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await SkillCatalog.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!skill) throw new AppError('Skill not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Skill deactivated.');
});

module.exports = {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  getPendingCertificates,
  createQuestion,
  bulkCreateQuestions,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  updateSkill,
  deleteSkill,
};
