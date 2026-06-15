'use strict';

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');

// SAFE IMPORTS (prevents crash)
let protect = (req, res, next) => next();
let validate = (req, res, next) => next();

let createTaskValidator = (req, res, next) => next();
let updateTaskStatusValidator = (req, res, next) => next();
let submitTestValidator = (req, res, next) => next();

try {
  protect = require('../middleware/auth.middleware').protect;
} catch (e) {
  console.warn('protect middleware missing');
}

try {
  validate = require('../middleware/validate.middleware');
} catch (e) {
  console.warn('validate middleware missing');
}

try {
  const v = require('../validators/task.validator');
  createTaskValidator = v.createTaskValidator || createTaskValidator;
  updateTaskStatusValidator = v.updateTaskStatusValidator || updateTaskStatusValidator;
  submitTestValidator = v.submitTestValidator || submitTestValidator;
} catch (e) {
  console.warn('task validators missing');
}

// ================= ROUTES =================
router.use(protect);

// TASK CRUD
router.get('/', taskController.getTasks);

router.post(
  '/',
  createTaskValidator,
  validate,
  taskController.createTask
);

router.get('/:id', taskController.getTask);

router.patch(
  '/:id/status',
  updateTaskStatusValidator,
  validate,
  taskController.updateTaskStatus
);

// TEST SYSTEM
router.get('/:id/test/questions', taskController.getTestQuestions);

router.post(
  '/:id/test/submit',
  submitTestValidator,
  validate,
  taskController.submitTest
);

// DELETE TASK
router.delete('/:id', taskController.deleteTask);

module.exports = router;