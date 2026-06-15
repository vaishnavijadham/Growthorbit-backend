'use strict';

/**
 * Database Seeder
 * Run: node src/database/seeder.js
 * Run: node src/database/seeder.js --destroy   (to wipe all data)
 */

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const { SkillCatalog } = require('../models/Skill.model');
const User = require('../models/User.model');
const Profile = require('../models/Profile.model');
const Gamification = require('../models/Gamification.model');
const Progress = require('../models/Progress.model');
const logger = require('../utils/logger');
const { SKILL_CATEGORIES } = require('../constants');

// ── Seed Data ────────────────────────────────────────────────────────────────

const skillSeedData = [
  // Frontend
  { name: 'HTML5', category: SKILL_CATEGORIES.FRONTEND, difficulty: 'Beginner', learningUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML', hasCertificate: false, tags: ['web', 'markup'] },
  { name: 'CSS3', category: SKILL_CATEGORIES.FRONTEND, difficulty: 'Beginner', learningUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS', hasCertificate: false, tags: ['web', 'styling'] },
  { name: 'JavaScript', category: SKILL_CATEGORIES.FRONTEND, difficulty: 'Intermediate', learningUrl: 'https://javascript.info', hasCertificate: true, certificateProvider: 'freeCodeCamp', tags: ['programming', 'web'] },
  { name: 'React.js', category: SKILL_CATEGORIES.FRONTEND, difficulty: 'Intermediate', learningUrl: 'https://react.dev', hasCertificate: true, certificateProvider: 'Meta', tags: ['framework', 'react'] },
  { name: 'TypeScript', category: SKILL_CATEGORIES.FRONTEND, difficulty: 'Intermediate', learningUrl: 'https://www.typescriptlang.org/docs', hasCertificate: false, tags: ['programming', 'typed'] },
  { name: 'Tailwind CSS', category: SKILL_CATEGORIES.FRONTEND, difficulty: 'Beginner', learningUrl: 'https://tailwindcss.com/docs', hasCertificate: false, tags: ['css', 'utility'] },

  // Backend
  { name: 'Node.js', category: SKILL_CATEGORIES.BACKEND, difficulty: 'Intermediate', learningUrl: 'https://nodejs.org/docs', hasCertificate: true, certificateProvider: 'OpenJS Foundation', tags: ['runtime', 'javascript'] },
  { name: 'Express.js', category: SKILL_CATEGORIES.BACKEND, difficulty: 'Intermediate', learningUrl: 'https://expressjs.com', hasCertificate: false, tags: ['framework', 'node'] },
  { name: 'REST API Design', category: SKILL_CATEGORIES.BACKEND, difficulty: 'Intermediate', learningUrl: 'https://restfulapi.net', hasCertificate: false, tags: ['api', 'design'] },
  { name: 'GraphQL', category: SKILL_CATEGORIES.BACKEND, difficulty: 'Advanced', learningUrl: 'https://graphql.org/learn', hasCertificate: false, tags: ['api', 'query'] },

  // Database
  { name: 'MongoDB', category: SKILL_CATEGORIES.DATABASE, difficulty: 'Intermediate', learningUrl: 'https://www.mongodb.com/docs', hasCertificate: true, certificateProvider: 'MongoDB University', tags: ['nosql', 'database'] },
  { name: 'MySQL', category: SKILL_CATEGORIES.DATABASE, difficulty: 'Intermediate', learningUrl: 'https://dev.mysql.com/doc', hasCertificate: true, certificateProvider: 'Oracle', tags: ['sql', 'relational'] },
  { name: 'PostgreSQL', category: SKILL_CATEGORIES.DATABASE, difficulty: 'Intermediate', learningUrl: 'https://www.postgresql.org/docs', hasCertificate: false, tags: ['sql', 'relational'] },
  { name: 'Redis', category: SKILL_CATEGORIES.DATABASE, difficulty: 'Intermediate', learningUrl: 'https://redis.io/docs', hasCertificate: true, certificateProvider: 'Redis University', tags: ['cache', 'nosql'] },

  // Tools
  { name: 'Git & GitHub', category: SKILL_CATEGORIES.TOOLS, difficulty: 'Beginner', learningUrl: 'https://git-scm.com/doc', hasCertificate: false, tags: ['vcs', 'collaboration'] },
  { name: 'Docker', category: SKILL_CATEGORIES.TOOLS, difficulty: 'Intermediate', learningUrl: 'https://docs.docker.com', hasCertificate: true, certificateProvider: 'Docker', tags: ['containers', 'devops'] },
  { name: 'Postman', category: SKILL_CATEGORIES.TOOLS, difficulty: 'Beginner', learningUrl: 'https://learning.postman.com', hasCertificate: true, certificateProvider: 'Postman', tags: ['api', 'testing'] },
  { name: 'VS Code', category: SKILL_CATEGORIES.TOOLS, difficulty: 'Beginner', learningUrl: 'https://code.visualstudio.com/docs', hasCertificate: false, tags: ['editor', 'ide'] },

  // DevOps
  { name: 'Linux Basics', category: SKILL_CATEGORIES.DEVOPS, difficulty: 'Beginner', learningUrl: 'https://linuxcommand.org', hasCertificate: false, tags: ['os', 'terminal'] },
  { name: 'CI/CD with GitHub Actions', category: SKILL_CATEGORIES.DEVOPS, difficulty: 'Intermediate', learningUrl: 'https://docs.github.com/en/actions', hasCertificate: false, tags: ['automation', 'ci'] },
  { name: 'AWS Basics', category: SKILL_CATEGORIES.DEVOPS, difficulty: 'Intermediate', learningUrl: 'https://aws.amazon.com/training', hasCertificate: true, certificateProvider: 'AWS', tags: ['cloud', 'aws'] },

  // CS Fundamentals
  { name: 'Data Structures', category: SKILL_CATEGORIES.CS_FUNDAMENTALS, difficulty: 'Intermediate', learningUrl: 'https://www.geeksforgeeks.org/data-structures', hasCertificate: false, tags: ['dsa', 'algorithms'] },
  { name: 'Algorithms', category: SKILL_CATEGORIES.CS_FUNDAMENTALS, difficulty: 'Intermediate', learningUrl: 'https://www.khanacademy.org/computing/computer-science/algorithms', hasCertificate: false, tags: ['dsa', 'problem-solving'] },
  { name: 'Operating Systems', category: SKILL_CATEGORIES.CS_FUNDAMENTALS, difficulty: 'Intermediate', learningUrl: 'https://www.geeksforgeeks.org/operating-systems', hasCertificate: false, tags: ['os', 'systems'] },
  { name: 'Computer Networks', category: SKILL_CATEGORIES.CS_FUNDAMENTALS, difficulty: 'Intermediate', learningUrl: 'https://www.geeksforgeeks.org/computer-network-tutorials', hasCertificate: false, tags: ['networking', 'tcp'] },

  // Security
  { name: 'Web Security Basics', category: SKILL_CATEGORIES.SECURITY, difficulty: 'Intermediate', learningUrl: 'https://owasp.org/www-project-web-security-testing-guide', hasCertificate: false, tags: ['owasp', 'security'] },
  { name: 'JWT & OAuth', category: SKILL_CATEGORIES.SECURITY, difficulty: 'Intermediate', learningUrl: 'https://jwt.io/introduction', hasCertificate: false, tags: ['auth', 'tokens'] },

  // Soft Skills
  { name: 'Technical Communication', category: SKILL_CATEGORIES.SOFT_SKILLS, difficulty: 'Beginner', learningUrl: 'https://www.coursera.org/learn/technical-writing', hasCertificate: false, tags: ['communication', 'writing'] },
  { name: 'Problem Solving', category: SKILL_CATEGORIES.SOFT_SKILLS, difficulty: 'Beginner', learningUrl: 'https://leetcode.com', hasCertificate: false, tags: ['logic', 'critical-thinking'] },

  // Advanced
  { name: 'System Design', category: SKILL_CATEGORIES.ADVANCED, difficulty: 'Advanced', learningUrl: 'https://github.com/donnemartin/system-design-primer', hasCertificate: false, tags: ['architecture', 'scalability'] },
  { name: 'Microservices', category: SKILL_CATEGORIES.ADVANCED, difficulty: 'Advanced', learningUrl: 'https://microservices.io', hasCertificate: false, tags: ['architecture', 'distributed'] },
];

const adminSeedData = {
  name: 'Growth Orbit Admin',
  email: 'admin@growthorbit.com',
  password: 'Admin@1234!',
  role: 'admin',
};

// ── Seeder Functions ──────────────────────────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/growth_orbit');
    logger.info('MongoDB connected for seeding...');

    // Insert skills (skip duplicates)
    let insertedCount = 0;
    for (const skillData of skillSeedData) {
      const exists = await SkillCatalog.findOne({ name: skillData.name });
      if (!exists) {
        await SkillCatalog.create(skillData);
        insertedCount++;
      }
    }
    logger.info(`✅ Skills seeded: ${insertedCount} new, ${skillSeedData.length - insertedCount} already existed`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: adminSeedData.email });
    if (!adminExists) {
      const admin = await User.create(adminSeedData);
      await Profile.create({ user: admin._id });
      await Gamification.create({ user: admin._id });
      await Progress.create({ user: admin._id });
      await User.findByIdAndUpdate(admin._id, { profile: (await Profile.findOne({ user: admin._id }))._id });
      logger.info(`✅ Admin user created: ${adminSeedData.email}`);
    } else {
      logger.info('ℹ️  Admin user already exists — skipped');
    }

    logger.info('🌱 Database seeding complete!');
  } catch (err) {
    logger.error('Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

const destroyDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/growth_orbit');
    logger.warn('⚠️  Destroying all data...');

    await Promise.all([
      SkillCatalog.deleteMany(),
      User.deleteMany(),
      Profile.deleteMany(),
      Gamification.deleteMany(),
      Progress.deleteMany(),
    ]);

    logger.info('🗑️  All data destroyed.');
  } catch (err) {
    logger.error('Destroy failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

// ── CLI Entry ─────────────────────────────────────────────────────────────────
if (process.argv[2] === '--destroy') {
  destroyDB();
} else {
  seedDB();
}
