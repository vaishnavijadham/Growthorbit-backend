'use strict';

const { body } = require('express-validator');

const profileUpdateValidator = [
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-().]{7,20}$/).withMessage('Invalid phone number format'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),

  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const dob = new Date(value);
      const now = new Date();
      const age = (now - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 10 || age > 100) throw new Error('Please enter a valid date of birth');
      return true;
    }),

  body('linkedIn')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] }).withMessage('LinkedIn must be a valid URL'),

  body('github')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] }).withMessage('GitHub must be a valid URL'),

  body('portfolio')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] }).withMessage('Portfolio must be a valid URL'),

  body('languages')
    .optional()
    .isArray().withMessage('Languages must be an array'),

  body('languages.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Each language must be between 1 and 50 characters'),

  body('hobbies')
    .optional()
    .isArray().withMessage('Hobbies must be an array'),

  body('hobbies.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Each hobby must be between 1 and 100 characters'),

  body('education.past.percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),

  body('education.past.cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
];

module.exports = { profileUpdateValidator };
