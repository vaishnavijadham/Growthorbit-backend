'use strict';

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

/**
 * Runs after express-validator chains.
 * Collects all errors and returns 422 if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return sendError(
      res,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'Validation failed',
      formattedErrors
    );
  }
  next();
};

module.exports = validate;
