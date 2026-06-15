'use strict';

const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamification.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/me', gamificationController.getMySummary);
router.get('/leaderboard', gamificationController.getLeaderboard);

module.exports = router;
