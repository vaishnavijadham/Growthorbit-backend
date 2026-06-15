'use strict';

const { body } = require('express-validator');

const uploadCertificateValidator = [
  body('skillId')
    .notEmpty().withMessage('Skill ID is required')
    .isMongoId().withMessage('Invalid skill ID format'),

  body('certificateName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Certificate name cannot exceed 200 characters'),

  body('issuingOrganization')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Issuing organization cannot exceed 200 characters'),

  body('issueDate')
    .optional()
    .isISO8601().withMessage('Issue date must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Issue date cannot be in the future');
      }
      return true;
    }),

  body('credentialId')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Credential ID cannot exceed 200 characters'),

  body('credentialUrl')
    .optional()
    .trim()
    .isURL().withMessage('Credential URL must be a valid URL'),
];

const verifyCertificateValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['verified', 'rejected']).withMessage('Status must be verified or rejected'),

  body('rejectionReason')
    .if(body('status').equals('rejected'))
    .notEmpty().withMessage('Rejection reason is required when rejecting a certificate')
    .trim()
    .isLength({ max: 500 }).withMessage('Rejection reason cannot exceed 500 characters'),
];

module.exports = { uploadCertificateValidator, verifyCertificateValidator };
