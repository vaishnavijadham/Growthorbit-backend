'use strict';

const { SkillCatalog, UserSkill } = require('../models/Skill.model');
const AppError = require('../utils/AppError');
const { SKILL_CATEGORIES } = require('../constants');
const logger = require('../utils/logger');

/**
 * Get all skills from catalog with optional filters
 */
const getCatalogSkills = async (filters = {}) => {
  const query = { isActive: true };
  if (filters.category) query.category = filters.category;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  if (filters.search) query.name = { $regex: filters.search, $options: 'i' };
  return SkillCatalog.find(query).sort({ category: 1, name: 1 });
};

/**
 * Get skills grouped by category
 */
const getSkillsByCategory = async () => {
  const skills = await SkillCatalog.find({ isActive: true }).sort({ name: 1 });

  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
};

/**
 * Create a new skill in the catalog (admin only)
 */
const createSkill = async (skillData) => {
  const existing = await SkillCatalog.findOne({ name: { $regex: `^${skillData.name}$`, $options: 'i' } });
  if (existing) throw new AppError(`Skill "${skillData.name}" already exists in catalog.`, 409);
  const skill = await SkillCatalog.create(skillData);
  logger.info(`Skill added to catalog: ${skill.name}`);
  return skill;
};

/**
 * Update a skill in catalog (admin only)
 */
const updateSkill = async (skillId, updateData) => {
  const skill = await SkillCatalog.findByIdAndUpdate(skillId, updateData, { new: true, runValidators: true });
  if (!skill) throw new AppError('Skill not found.', 404);
  return skill;
};

/**
 * Get user skill summary stats
 */
const getUserSkillStats = async (userId) => {
  const stats = await UserSkill.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { not_started: 0, learning: 0, completed: 0, total: 0 };
  stats.forEach((s) => {
    result[s._id] = s.count;
    result.total += s.count;
  });

  return result;
};

/**
 * Get user skills grouped by category
 */
const getUserSkillsByCategory = async (userId) => {
  return UserSkill.find({ user: userId })
    .populate('skill', 'name category difficulty icon learningUrl hasCertificate')
    .sort({ 'skill.category': 1, 'skill.name': 1 });
};

/**
 * Check if user has completed prerequisite skills for a given skill
 */
const checkPrerequisites = async (userId, skillId) => {
  const skill = await SkillCatalog.findById(skillId).populate('prerequisites');
  if (!skill) throw new AppError('Skill not found.', 404);

  if (!skill.prerequisites || skill.prerequisites.length === 0) {
    return { canProceed: true, missing: [] };
  }

  const completedSkills = await UserSkill.find({
    user: userId,
    skill: { $in: skill.prerequisites.map((p) => p._id) },
    testPassed: true,
  }).select('skill');

  const completedIds = completedSkills.map((s) => s.skill.toString());
  const missing = skill.prerequisites.filter((p) => !completedIds.includes(p._id.toString()));

  return {
    canProceed: missing.length === 0,
    missing: missing.map((m) => ({ id: m._id, name: m.name })),
  };
};

module.exports = {
  getCatalogSkills,
  getSkillsByCategory,
  createSkill,
  updateSkill,
  getUserSkillStats,
  getUserSkillsByCategory,
  checkPrerequisites,
};
