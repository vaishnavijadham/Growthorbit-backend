'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/skillverification.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
  initSkillValidator,
  uploadCertificateValidator
} = require('../validators/skillverification.validator');

router.use(protect);

// INIT
router.post(
  '/',
  initSkillValidator,
  validate,
  controller.initSkillVerification
);

// CERTIFICATE
router.patch(
  '/certificate',
  uploadCertificateValidator,
  validate,
  controller.uploadCertificate
);

// GET TEST
router.get(
  '/:skill/test',
  controller.getTestQuestions
);

// SUBMIT TEST (IMPORTANT FIX)
router.post(
  '/:skill/test/submit',
  controller.submitTest
);

module.exports = router;