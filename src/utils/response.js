'use strict';

/**
 * Send a standardized success response
 */
const sendSuccess = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    status: 'success',
    message,
  };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 */
const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    status: 'error',
    message,
  };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
const sendPaginated = (res, statusCode, message, data, pagination) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
