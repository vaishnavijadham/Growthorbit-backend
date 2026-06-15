'use strict';

const { SkillCatalog, UserSkill } = require('../models/Skill.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');
const AppError = require('../utils/AppError');
const { getPagination, getSort } = require('../helpers/pagination.helper');

// ── Catalog (Admin / Read-only for users) ────────────────────────────────────

const getAllSkills = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const sort = getSort(req.query.sort, { name: 1 });

  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const [skills, total] = await Promise.all([
    SkillCatalog.find(filter).sort(sort).skip(skip).limit(limit).select('-__v'),
    SkillCatalog.countDocuments(filter),
  ]);

  sendPaginated(res, HTTP_STATUS.OK, 'Skills fetched.', skills, { total, page, limit });
});

const getSkillById = asyncHandler(async (req, res) => {
  const skill = await SkillCatalog.findById(req.params.id).populate('prerequisites', 'name category');
  if (!skill) throw new AppError('Skill not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Skill fetched.', skill);
});

// Admin: create skill
const createSkill = asyncHandler(async (req, res) => {
  const skill = await SkillCatalog.create(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Skill added to catalog.', skill);
});

// ── User Skill Tracking ───────────────────────────────────────────────────────

const getUserSkills = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter['skill.category'] = req.query.category;

  const skills = await UserSkill.find(filter)
    .populate('skill', 'name category learningUrl hasCertificate difficulty icon')
    .sort({ updatedAt: -1 });

  sendSuccess(res, HTTP_STATUS.OK, 'User skills fetched.', skills);
});

const addUserSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.body;

  const skillExists = await SkillCatalog.findById(skillId);
  if (!skillExists) throw new AppError('Skill not found in catalog.', 404);

  const existing = await UserSkill.findOne({ user: req.user._id, skill: skillId });
  if (existing) throw new AppError('Skill already added to your list.', 409);

  const userSkill = await UserSkill.create({
    user: req.user._id,
    skill: skillId,
    status: 'learning',
    startedAt: new Date(),
  });

  sendSuccess(res, HTTP_STATUS.CREATED, 'Skill added to your learning list.', userSkill);
});

const updateUserSkill = asyncHandler(async (req, res) => {
  const allowedFields = ['status', 'proficiency', 'notes'];
  const updateData = {};
  allowedFields.forEach((f) => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

  if (updateData.status === 'completed') updateData.completedAt = new Date();

  const userSkill = await UserSkill.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updateData,
    { new: true, runValidators: true }
  ).populate('skill', 'name category');

  if (!userSkill) throw new AppError('User skill record not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Skill updated.', userSkill);
});

const removeUserSkill = asyncHandler(async (req, res) => {
  const deleted = await UserSkill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) throw new AppError('User skill record not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Skill removed from your list.');
});

module.exports = {
  getAllSkills, getSkillById, createSkill,
  getUserSkills, addUserSkill, updateUserSkill, removeUserSkill,
};
