'use strict';

const authService = require('./auth.service');
const profileService = require('./profile.service');
const resumeService = require('./resume.service');
const roadmapService = require('./roadmap.service');
const skillService = require('./skill.service');
const testService = require('./test.service');
const certificateService = require('./certificate.service');
const gamificationService = require('./gamification.service');
const progressService = require('./progress.service');
const dashboardService = require('./dashboard.service');

module.exports = {
  authService,
  profileService,
  resumeService,
  roadmapService,
  skillService,
  testService,
  certificateService,
  gamificationService,
  progressService,
  dashboardService,
};
