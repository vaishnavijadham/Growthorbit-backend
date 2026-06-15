'use strict';

const { body } = require('express-validator');

const initSkillValidator = [
  body('skill')
    .notEmpty()
    .withMessage('Skill is required')
];

const uploadCertificateValidator = [
  body('skill')
    .notEmpty()
    .withMessage('Skill is required'),

  body('certificateUrl')
    .notEmpty()
    .withMessage('Certificate URL is required')
];

const submitTestValidator = [
  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),

  body('questions')
    .isArray()
    .withMessage('Questions must be an array')
];

module.exports = {
  initSkillValidator,
  uploadCertificateValidator,
  submitTestValidator
};