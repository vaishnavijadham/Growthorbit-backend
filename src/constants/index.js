'use strict';

// ─── HTTP Status Codes ────────────────────────────────────────────────────────
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// ─── User Roles ───────────────────────────────────────────────────────────────
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// ─── Skill Categories ─────────────────────────────────────────────────────────
const SKILL_CATEGORIES = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  TOOLS: 'Tools',
  DEVOPS: 'DevOps',
  CS_FUNDAMENTALS: 'CS Fundamentals',
  SECURITY: 'Security',
  SOFT_SKILLS: 'Soft Skills',
  ADVANCED: 'Advanced',
};

// ─── Roadmap Goal Presets ─────────────────────────────────────────────────────
const ROADMAP_PRESETS = {
  COURSE: 'B.Tech',
  SUBCOURSE: 'CSE',
  GOAL: 'Web Developer',
};

// ─── XP Values ────────────────────────────────────────────────────────────────
const XP_VALUES = {
  TASK_COMPLETION: 50,
  TEST_PASS: 200,
  CERTIFICATE_UPLOAD: 100,
  MILESTONE_REACHED: 500,
  RESUME_UPDATED: 30,
  PROFILE_COMPLETED: 75,
  ROADMAP_CREATED: 100,
};

// ─── Level Thresholds ─────────────────────────────────────────────────────────
const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, title: 'Rookie' },
  { level: 2, minXP: 200, title: 'Explorer' },
  { level: 3, minXP: 500, title: 'Learner' },
  { level: 4, minXP: 1000, title: 'Builder' },
  { level: 5, minXP: 2000, title: 'Developer' },
  { level: 6, minXP: 3500, title: 'Engineer' },
  { level: 7, minXP: 5500, title: 'Expert' },
  { level: 8, minXP: 8000, title: 'Master' },
  { level: 9, minXP: 11000, title: 'Champion' },
  { level: 10, minXP: 15000, title: 'Legend' },
];

// ─── Test Config ──────────────────────────────────────────────────────────────
const TEST_CONFIG = {
  TOTAL_QUESTIONS: 100,
  PASS_SCORE: 85,
  TIME_LIMIT_MINUTES: 90,
};

// ─── Certificate Statuses ─────────────────────────────────────────────────────
const CERTIFICATE_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// ─── Task Statuses ────────────────────────────────────────────────────────────
const TASK_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// ─── Roadmap Statuses ─────────────────────────────────────────────────────────
const ROADMAP_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  SKILL_CATEGORIES,
  ROADMAP_PRESETS,
  XP_VALUES,
  LEVEL_THRESHOLDS,
  TEST_CONFIG,
  CERTIFICATE_STATUS,
  TASK_STATUS,
  ROADMAP_STATUS,
};
