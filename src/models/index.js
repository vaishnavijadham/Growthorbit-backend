'use strict';

const User = require('./User.model');
const Profile = require('./Profile.model');
const Resume = require('./Resume.model');
const Roadmap = require('./Roadmap.model');
const { SkillCatalog, UserSkill } = require('./Skill.model');
const { Question, Task, TestSubmission } = require('./Task.model');
const Certificate = require('./Certificate.model');
const Gamification = require('./Gamification.model');
const Progress = require('./Progress.model');

module.exports = {
  User,
  Profile,
  Resume,
  Roadmap,
  SkillCatalog,
  UserSkill,
  Question,
  Task,
  TestSubmission,
  Certificate,
  Gamification,
  Progress,
};
