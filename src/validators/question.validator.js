'use strict';

const { body } = require('express-validator');

const questionValidator = [
  body('skill')
    .notEmpty().withMessage('Skill ID is required')
    .isMongoId().withMessage('Invalid skill ID format'),

  body('questionText')
    .trim()
    .notEmpty().withMessage('Question text is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Question must be between 10 and 1000 characters'),

  body('options')
    .isArray({ min: 4, max: 4 }).withMessage('Exactly 4 options are required'),

  body('options.*.optionLabel')
    .notEmpty().withMessage('Option label is required')
    .isIn(['A', 'B', 'C', 'D']).withMessage('Option label must be A, B, C, or D'),

  body('options.*.optionText')
    .trim()
    .notEmpty().withMessage('Option text is required')
    .isLength({ max: 500 }).withMessage('Option text cannot exceed 500 characters'),

  body('correctAnswer')
    .notEmpty().withMessage('Correct answer is required')
    .isIn(['A', 'B', 'C', 'D']).withMessage('Correct answer must be A, B, C, or D'),

  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),

  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Explanation cannot exceed 1000 characters'),

  body('points')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Points must be between 1 and 10'),
];

const bulkQuestionValidator = [
  body('questions')
    .isArray({ min: 1 }).withMessage('Questions must be a non-empty array'),

  body('questions.*.skill')
    .notEmpty().withMessage('Each question must have a skill ID')
    .isMongoId().withMessage('Invalid skill ID format'),

  body('questions.*.questionText')
    .trim()
    .notEmpty().withMessage('Question text is required'),

  body('questions.*.correctAnswer')
    .notEmpty().withMessage('Correct answer is required')
    .isIn(['A', 'B', 'C', 'D']).withMessage('Correct answer must be A, B, C, or D'),
];

module.exports = { questionValidator, bulkQuestionValidator };
