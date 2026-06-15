'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { signupValidator, loginValidator, changePasswordValidator } = require('../validators/auth.validator');

// Public routes
router.post('/signup', signupValidator, validate, authController.signup);
router.post('/login', loginValidator, validate, authController.login);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.patch('/change-password', changePasswordValidator, validate, authController.changePassword);
router.delete('/deactivate', authController.deactivateAccount);

module.exports = router;
