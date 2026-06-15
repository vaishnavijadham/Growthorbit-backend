'use strict';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 5000,

  db: {
    uri: process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI || 'mongodb://localhost:27017/growth_orbit',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change_me_in_production_secret_key_min_32_chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change_me_in_production_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },

  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate critical config on startup
const validateConfig = () => {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
  }

  if (missing.length > 0) {
    console.warn(`⚠️  WARNING: Missing environment variables (using defaults): ${missing.join(', ')}`);
  }
};

validateConfig();

module.exports = config;
