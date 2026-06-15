'use strict';

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s\-().]{7,20}$/, 'Invalid phone number format'],
    },
    dateOfBirth: {
      type: Date,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    education: {
      current: {
        institution: { type: String, trim: true },
        course: { type: String, trim: true },
        branch: { type: String, trim: true },
        specialization: { type: String, trim: true },
        semester: { type: String, trim: true },
        startYear: { type: Number },
        endYear: { type: Number },
      },
      past: {
        institution: { type: String, trim: true },
        course: { type: String, trim: true },
        percentage: { type: Number, min: 0, max: 100 },
        cgpa: { type: Number, min: 0, max: 10 },
        year: { type: Number },
      },
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    hobbies: [
      {
        type: String,
        trim: true,
      },
    ],
    achievements: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        year: { type: Number },
      },
    ],
    // Track profile completion percentage
    completionPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Resume reference
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
profileSchema.index({ user: 1 }, { unique: true });

// ─── Pre-save: Calculate completion % ────────────────────────────────────────
profileSchema.pre('save', function (next) {
  const fields = [
    this.avatar,
    this.bio,
    this.phone,
    this.dateOfBirth,
    this.linkedIn,
    this.github,
    this.location?.city,
    this.education?.current?.institution,
    this.education?.current?.course,
    this.languages?.length > 0,
    this.hobbies?.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  this.completionPercent = Math.floor((filled / fields.length) * 100);
  next();
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
