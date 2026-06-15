'use strict';

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const certificateController = require('../controllers/certificate.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { verifyCertificateValidator } = require('../validators/certificate.validator');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── User management ────────────────────────────────────────────────────────────
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

// ── Certificate review ─────────────────────────────────────────────────────────
router.get('/certificates/pending', adminController.getPendingCertificates);
router.patch('/certificates/:id/verify', verifyCertificateValidator, validate, certificateController.verifyCertificate);

// ── Question bank ──────────────────────────────────────────────────────────────
router.get('/questions', adminController.getQuestions);
router.post('/questions', adminController.createQuestion);
router.post('/questions/bulk', adminController.bulkCreateQuestions);
router.patch('/questions/:id', adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);

// ── Skill catalog ──────────────────────────────────────────────────────────────
router.patch('/skills/:id', adminController.updateSkill);
router.delete('/skills/:id', adminController.deleteSkill);

module.exports = router;
