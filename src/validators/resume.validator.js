'use strict';

const { body } = require('express-validator');

const resumeValidator = [
  body('personalInfo.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ max: 100 }).withMessage('Full name cannot exceed 100 characters'),

  body('personalInfo.email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('personalInfo.phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-().]{7,20}$/).withMessage('Invalid phone number format'),

  body('personalInfo.linkedIn')
    .optional()
    .trim()
    .isURL().withMessage('LinkedIn must be a valid URL'),

  body('personalInfo.github')
    .optional()
    .trim()
    .isURL().withMessage('GitHub/Portfolio must be a valid URL'),

  body('education.current.courseName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Course name cannot exceed 100 characters'),

  body('education.current.branchName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Branch name cannot exceed 100 characters'),

  body('education.past.percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),

  body('education.past.cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),

  body('declaration.agreed')
    .optional()
    .isBoolean().withMessage('Declaration must be a boolean'),

  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array'),

  body('skills.*.skillName')
    .optional()
    .trim()
    .notEmpty().withMessage('Skill name cannot be empty'),
];

const resumeUpdateValidator = [
  body('personalInfo.email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address'),

  body('personalInfo.phone')
    .optional()
    .matches(/^[+]?[\d\s\-().]{7,20}$/).withMessage('Invalid phone number format'),

  body('education.past.percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),

  body('education.past.cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
];

module.exports = { resumeValidator, resumeUpdateValidator };
