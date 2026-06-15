'use strict';

const mongoose = require('mongoose');

const skillVerificationSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  skill: {
    type: String,
    required: true
  },

  certificateUrl: {
    type: String,
    default: ''
  },

  certificateUploaded: {
    type: Boolean,
    default: false
  },

  testScore: {
    type: Number,
    default: 0
  },

  passed: {
    type: Boolean,
    default: false
  },

  resumeUpdated: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

module.exports = mongoose.model(
  'SkillVerification',
  skillVerificationSchema
);