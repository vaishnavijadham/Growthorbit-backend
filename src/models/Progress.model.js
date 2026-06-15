'use strict';

const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // Overall dashboard metrics
    overallPercent: { type: Number, default: 0, min: 0, max: 100 },
    // Tasks
    tasks: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      inProgress: { type: Number, default: 0 },
      locked: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
    },
    // Skills
    skills: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      learning: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
    },
    // Roadmap
    roadmap: {
      totalPhases: { type: Number, default: 0 },
      completedPhases: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
    },
    // Tests
    tests: {
      total: { type: Number, default: 0 },
      passed: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
    },
    // Certificates
    certificates: {
      total: { type: Number, default: 0 },
      verified: { type: Number, default: 0 },
    },
    // Weekly activity snapshot (last 7 days)
    weeklyActivity: [
      {
        date: { type: Date },
        tasksCompleted: { type: Number, default: 0 },
        xpEarned: { type: Number, default: 0 },
      },
    ],
    lastCalculatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
