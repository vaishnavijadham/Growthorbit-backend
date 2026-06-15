'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

/**
 * Delete a file from disk safely (no error thrown if missing)
 */
const deleteFile = (filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`File deleted: ${fullPath}`);
    }
  } catch (err) {
    logger.warn(`Could not delete file: ${filePath}`, err.message);
  }
};

/**
 * Ensure a directory exists, create it recursively if not
 */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Directory created: ${dirPath}`);
  }
};

/**
 * Get file size in human-readable format
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Build public URL for uploaded file
 */
const getFileUrl = (filename, baseUrl = '') => {
  return `${baseUrl}/uploads/${filename}`;
};

module.exports = { deleteFile, ensureDir, formatFileSize, getFileUrl };
