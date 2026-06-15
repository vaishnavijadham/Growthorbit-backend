'use strict';

const express = require('express');
const router = express.Router();

console.log('ROADMAP ROUTES LOADING');

const roadmapController = require('../controllers/roadmap.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { roadmapValidator } = require('../validators/roadmap.validator');

// Protect all roadmap routes
router.use(protect);

// ================= ROUTES =================

// CREATE ROADMAP
router.post(
  '/',
  roadmapValidator,
  validate,
  roadmapController.createRoadmap
);

// GET ALL ROADMAPS
router.get('/', roadmapController.getRoadmaps);

// GET SINGLE ROADMAP
router.get('/:id', roadmapController.getRoadmap);

// UPDATE ROADMAP
router.patch('/:id', roadmapController.updateRoadmap);

// COMPLETE PHASE
router.patch('/:id/complete-phase', roadmapController.completePhase);

// DELETE ROADMAP
router.delete('/:id', roadmapController.deleteRoadmap);

module.exports = router;