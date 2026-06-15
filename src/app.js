'use strict';
const skillVerificationRoutes =
require('./routes/skillverification.routes');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const resumeRoutes = require('./routes/resume.routes');
const roadmapRoutes = require('./routes/roadmap.routes');
const skillRoutes = require('./routes/skill.routes');
const taskRoutes = require('./routes/task.routes');
const certificateRoutes = require('./routes/certificate.routes');
const progressRoutes = require('./routes/progress.routes');
const gamificationRoutes = require('./routes/gamification.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

// CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting
app.use('/api/', rateLimiter.general);
app.use('/api/auth/', rateLimiter.auth);

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Data Sanitization ───────────────────────────────────────────────────────
app.use(mongoSanitize()); // Against NoSQL injection
app.use(hpp());           // Against HTTP param pollution

// ─── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Growth Orbit API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);
app.use(`${API_PREFIX}/resume`, resumeRoutes);
app.use(`${API_PREFIX}/roadmap`, roadmapRoutes);
app.use(`${API_PREFIX}/skills`, skillRoutes);
app.use(`${API_PREFIX}/tasks`, taskRoutes);
app.use(`${API_PREFIX}/certificates`, certificateRoutes);
app.use(`${API_PREFIX}/progress`, progressRoutes);
app.use(`${API_PREFIX}/gamification`, gamificationRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(
  `${API_PREFIX}/skill-verification`,
  skillVerificationRoutes
);

// ─── 404 & Error Handling ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
