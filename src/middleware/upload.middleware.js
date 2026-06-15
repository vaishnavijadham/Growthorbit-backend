'use strict';

const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

const ALLOWED_CERT_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, `cert-${uniqueSuffix}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_CERT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF and image files (JPG, PNG, WEBP) are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadCertificate = upload.single('certificate');

// Wrap multer errors into AppErrors
const handleUpload = (req, res, next) => {
  uploadCertificate(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError(`File size cannot exceed ${MAX_FILE_SIZE / 1024 / 1024}MB.`, 400));
      }
      return next(new AppError(err.message, 400));
    }
    next(err);
  });
};

module.exports = { handleUpload };
