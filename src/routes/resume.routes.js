'use strict';

const express =
require('express');

const router =
express.Router();

const resumeController =
require('../controllers/resume.controller');

const {
protect
} =
require('../middleware/auth.middleware');

const validate =
require('../middleware/validate.middleware');

const {
resumeValidator,
resumeUpdateValidator
} =
require('../validators/resume.validator');

// ───────── AUTH ─────────

router.use(
protect
);

// ───────── CREATE ─────────

router.post(
'/',
resumeValidator,
validate,
resumeController.createResume
);

// ───────── GET CURRENT ─────────

router.get(
'/',
resumeController.getResume
);

// ───────── ATS ─────────

router.post(
'/generate-ats',
resumeController.generateATSResume
);

router.get(
'/ats',
resumeController.getATSResume
);

// ───────── HISTORY ─────────

router.get(
'/history',
resumeController.getResumeHistory
);

// ───────── GET BY ID ─────────

router.get(
'/:id',
resumeController.getResumeById
);

// ───────── UPDATE ─────────

router.patch(
'/',
resumeUpdateValidator,
validate,
resumeController.updateResume
);

// ───────── DELETE ─────────

router.delete(
'/:id',
resumeController.deleteResume
);

module.exports =
router;
