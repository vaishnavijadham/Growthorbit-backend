'use strict';

const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

/**
 * Validate that a string is a valid MongoDB ObjectId.
 * Throws AppError if invalid.
 */
const validateObjectId = (id, label = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label} format.`, 400);
  }
};

/**
 * Build a case-insensitive regex search filter for multiple fields
 */
const buildSearchFilter = (searchTerm, fields) => {
  if (!searchTerm || !fields.length) return {};
  const regex = { $regex: searchTerm, $options: 'i' };
  return { $or: fields.map((field) => ({ [field]: regex })) };
};

/**
 * Build a date range filter
 * @param {string} field - MongoDB field name
 * @param {string} from  - ISO date string
 * @param {string} to    - ISO date string
 */
const buildDateRangeFilter = (field, from, to) => {
  const filter = {};
  if (from || to) {
    filter[field] = {};
    if (from) filter[field].$gte = new Date(from);
    if (to) filter[field].$lte = new Date(to);
  }
  return filter;
};

/**
 * Safely convert string to ObjectId
 */
const toObjectId = (id) => {
  validateObjectId(id);
  return new mongoose.Types.ObjectId(id);
};

module.exports = { validateObjectId, buildSearchFilter, buildDateRangeFilter, toObjectId };
