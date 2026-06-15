'use strict';

const mongoose = require('mongoose');
const {
  ROADMAP_STATUS,
  ROADMAP_PRESETS
} = require('../constants');


// ================= PHASE =================
const roadmapPhaseSchema = new mongoose.Schema(
  {
    phaseNumber: {
      type: Number,
      required: true
    },

    title: {
      type: String,
      trim: true,
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    durationWeeks: {
      type: Number,
      default: 4
    },

    skills: [
      {
        type: String,
        trim: true
      }
    ],

    resources: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        type: {
          type: String,
          enum: [
            'video',
            'article',
            'course',
            'book',
            'documentation',
            'project'
          ]
        }
      }
    ],

    milestones: [
      {
        type: String,
        trim: true
      }
    ],

    isCompleted: {
      type: Boolean,
      default: false
    },

    completedAt: {
      type: Date
    }
  },
  { _id: true }
);


// ================= ROADMAP =================
const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    field: {
      type: String,
      trim: true,
      required: [true, 'Field is required']
    },

    course: {
      type: String,
      trim: true,
      default: ROADMAP_PRESETS.COURSE
    },

    subcourse: {
      type: String,
      trim: true,
      default: ROADMAP_PRESETS.SUBCOURSE
    },

    goal: {
      type: String,
      trim: true,
      required: [true, 'Goal is required'],
      default: ROADMAP_PRESETS.GOAL
    },

    title: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // ================= AI CONTENT =================
    aiGeneratedContent: {
      phases: [roadmapPhaseSchema],

      totalDurationWeeks: {
        type: Number,
        default: 0
      },

      generatedAt: {
        type: Date,
        default: null
      },

      // ✅ FIX: allow fallback-safe handling
      status: {
        type: String,
        enum: ['pending', 'generated', 'failed'],
        default: 'pending'
      },

      rawResponse: {
        type: String,
        default: null
      },

      // ✅ NEW SAFE FLAG (IMPORTANT)
      isFallback: {
        type: Boolean,
        default: false
      }
    },

    // ================= ROADMAP STATUS =================
    status: {
      type: String,
      enum: Object.values(ROADMAP_STATUS),
      default: ROADMAP_STATUS.DRAFT
    },

    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    startedAt: Date,
    completedAt: Date,

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


// ================= INDEXES =================
roadmapSchema.index({ user: 1, status: 1 });
roadmapSchema.index({ user: 1, createdAt: -1 });


// ================= VIRTUAL =================
roadmapSchema.virtual('completedPhases').get(function () {
  return (
    this.aiGeneratedContent?.phases?.filter(p => p.isCompleted).length || 0
  );
});


module.exports = mongoose.model('Roadmap', roadmapSchema);