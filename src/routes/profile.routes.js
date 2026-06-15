'use strict';

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);
router.get('/completion', profileController.getProfileCompletion);

module.exports = router;
