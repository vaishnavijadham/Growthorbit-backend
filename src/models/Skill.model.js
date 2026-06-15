'use strict';

const mongoose = require('mongoose');
const { SKILL_CATEGORIES } = require('../constants');

// ── Master Skill Catalog (admin-managed) ────────────────────────────────────
const skillCatalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: Object.values(SKILL_CATEGORIES),
      index: true,
    },
    description: { type: String, trim: true },
    learningUrl: {
      type: String,
      trim: true,
    },
    officialDocs: {
      type: String,
      trim: true,
    },
    hasCertificate: {
      type: Boolean,
      default: false,
    },
    certificateProvider: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SkillCatalog',
      },
    ],
    tags: [{ type: String, trim: true, lowercase: true }],
    isActive: { type: Boolean, default: true },
    icon: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name
skillCatalogSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

skillCatalogSchema.index({ category: 1, difficulty: 1 });
skillCatalogSchema.index({ tags: 1 });

// ── User Skill Tracker ───────────────────────────────────────────────────────
const userSkillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillCatalog',
      required: true,
    },
    status: {
      type: String,
      enum: ['not_started', 'learning', 'completed'],
      default: 'not_started',
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    // Certificate unlock logic
    certificateUploaded: { type: Boolean, default: false },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
    },
    testUnlocked: { type: Boolean, default: false },
    testPassed: { type: Boolean, default: false },
    testPassedAt: { type: Date },
    // Progress tracking
    startedAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String, trim: true },
    // Auto-add to resume flag
    addedToResume: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSkillSchema.index({ user: 1, skill: 1 }, { unique: true });
userSkillSchema.index({ user: 1, status: 1 });

const SkillCatalog = mongoose.model('SkillCatalog', skillCatalogSchema);
const UserSkill = mongoose.model('UserSkill', userSkillSchema);

module.exports = { SkillCatalog, UserSkill };
