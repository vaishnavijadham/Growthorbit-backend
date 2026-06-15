'use strict';

const { body } = require('express-validator');
const { SKILL_CATEGORIES } = require('../constants');

const skillCatalogValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Skill name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Skill name must be between 1 and 100 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(Object.values(SKILL_CATEGORIES)).withMessage(`Category must be one of: ${Object.values(SKILL_CATEGORIES).join(', ')}`),

  body('learningUrl')
    .optional()
    .trim()
    .isURL().withMessage('Learning URL must be valid'),

  body('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),

  body('hasCertificate')
    .optional()
    .isBoolean().withMessage('hasCertificate must be a boolean'),
];

const addUserSkillValidator = [
  body('skillId')
    .notEmpty().withMessage('Skill ID is required')
    .isMongoId().withMessage('Invalid skill ID format'),
];

const updateUserSkillValidator = [
  body('status')
    .optional()
    .isIn(['not_started', 'learning', 'completed']).withMessage('Status must be not_started, learning, or completed'),

  body('proficiency')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid proficiency level'),
];

module.exports = { skillCatalogValidator, addUserSkillValidator, updateUserSkillValidator };
