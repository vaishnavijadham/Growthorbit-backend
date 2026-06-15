'use strict';

const { body } = require('express-validator');

const roadmapValidator = [
  body('field')
    .trim()
    .notEmpty().withMessage('Field is required')
    .isLength({ max: 100 }).withMessage('Field cannot exceed 100 characters'),

  body('goal')
    .trim()
    .notEmpty().withMessage('Goal is required')
    .isLength({ max: 200 }).withMessage('Goal cannot exceed 200 characters'),

  body('course')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Course cannot exceed 100 characters'),

  body('subcourse')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Subcourse cannot exceed 100 characters'),
];

module.exports = { roadmapValidator };
