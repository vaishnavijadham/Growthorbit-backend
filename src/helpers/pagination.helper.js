'use strict';

/**
 * Build pagination params from query string
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build sort object from query string
 * e.g. ?sort=-createdAt,name => { createdAt: -1, name: 1 }
 */
const getSort = (sortQuery, defaultSort = { createdAt: -1 }) => {
  if (!sortQuery) return defaultSort;
  return sortQuery.split(',').reduce((acc, field) => {
    if (field.startsWith('-')) {
      acc[field.slice(1)] = -1;
    } else {
      acc[field] = 1;
    }
    return acc;
  }, {});
};

module.exports = { getPagination, getSort };
