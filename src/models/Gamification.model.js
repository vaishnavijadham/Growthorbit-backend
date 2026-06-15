'use strict';

const mongoose = require('mongoose');
const { XP_VALUES } = require('../constants');

const xpEventSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: Object.keys(XP_VALUES),
      required: true,
    },
    xpAmount: { type: Number, required: true },
    description: { type: String, trim: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // task/cert/roadmap id
    referenceModel: {
      type: String,
      enum: ['Task', 'Certificate', 'Roadmap', 'Resume', 'Profile'],
    },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const gamificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalXP: { type: Number, default: 0, min: 0 },
    currentLevel: { type: Number, default: 1 },
    levelTitle: { type: String, default: 'Rookie' },
    // XP history log
    xpHistory: [xpEventSchema],
    // Streaks
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    // Milestones/badges
    badges: [
      {
        name: { type: String, trim: true },
        description: { type: String, trim: true },
        icon: { type: String, trim: true },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    // Stats
    stats: {
      tasksCompleted: { type: Number, default: 0 },
      testsPassed: { type: Number, default: 0 },
      certificatesUploaded: { type: Number, default: 0 },
      roadmapsCompleted: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gamificationSchema.index({ totalXP: -1 }); // For leaderboards

const Gamification = mongoose.model('Gamification', gamificationSchema);
module.exports = Gamification;
