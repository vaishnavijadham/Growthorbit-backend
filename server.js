'use strict';

const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/database/connection');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Connect to database then start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Growth Orbit server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...', {
        error: err.message,
        stack: err.stack,
      });
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown on SIGTERM
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated.');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();