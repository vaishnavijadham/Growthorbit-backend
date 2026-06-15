'use strict';

const { body } = require('express-validator');
const { TASK_STATUS } = require('../constants');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),

  body('skill')
    .notEmpty().withMessage('Skill ID is required')
    .isMongoId().withMessage('Invalid skill ID format'),

  body('roadmap')
    .optional()
    .isMongoId().withMessage('Invalid roadmap ID format'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),

  body('xpReward')
    .optional()
    .isInt({ min: 0, max: 1000 }).withMessage('XP reward must be between 0 and 1000'),
];

const updateTaskStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn([TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED])
    .withMessage(`Status must be one of: ${TASK_STATUS.IN_PROGRESS}, ${TASK_STATUS.COMPLETED}`),
];

const submitTestValidator = [
  body('answers')
    .isArray({ min: 1 }).withMessage('Answers must be a non-empty array'),

  body('answers.*.question')
    .notEmpty().withMessage('Each answer must reference a question ID')
    .isMongoId().withMessage('Invalid question ID format'),

  body('answers.*.selectedAnswer')
    .notEmpty().withMessage('Each answer must have a selected option')
    .isIn(['A', 'B', 'C', 'D']).withMessage('Selected answer must be A, B, C, or D'),

  body('startedAt')
    .notEmpty().withMessage('Test start time is required')
    .isISO8601().withMessage('startedAt must be a valid ISO date'),
];

module.exports = { createTaskValidator, updateTaskStatusValidator, submitTestValidator };
