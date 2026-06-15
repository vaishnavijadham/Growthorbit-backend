'use strict';

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', dashboardController.getDashboard);
router.get('/activity', dashboardController.getActivityTimeline);

module.exports = router;
