'use strict';

const mongoose = require('mongoose');

// ── Question ────────────────────────────────────────────────────────────────
const questionSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true });

// ── Task ────────────────────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillCatalog' },

  status: {
    type: String,
    enum: ['available', 'in_progress', 'completed', 'locked'],
    default: 'available'
  },
  priority: { type: Number, default: 0 },

  certificateUrl: { type: String },
  unlocked:       { type: Boolean, default: false },
  testScore:      { type: Number,  default: 0 },
  passed:         { type: Boolean, default: false },
  resumeUpdated:  { type: Boolean, default: false }
}, { timestamps: true });

// ── TestSubmission ───────────────────────────────────────────────────────────
const testSubmissionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill:       { type: mongoose.Schema.Types.ObjectId, ref: 'SkillCatalog' },
  score:       { type: Number, default: 0 },
  passed:      { type: Boolean, default: false },
  answers:     [{ questionId: mongoose.Schema.Types.ObjectId, selected: String }],
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Question       = mongoose.model('Question',       questionSchema);
const Task           = mongoose.model('Task',           taskSchema);
const TestSubmission = mongoose.model('TestSubmission', testSubmissionSchema);

module.exports = { Question, Task, TestSubmission };