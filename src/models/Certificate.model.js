'use strict';

const mongoose = require('mongoose');
const { CERTIFICATE_STATUS } = require('../constants');

const certificateSchema = new mongoose.Schema(
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
    // Certificate file details
    fileName: { type: String, trim: true, required: true },
    fileUrl: { type: String, trim: true, required: true },
    fileType: {
      type: String,
      enum: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    },
    fileSize: { type: Number }, // bytes
    // Certificate metadata
    certificateName: { type: String, trim: true },
    issuingOrganization: { type: String, trim: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    credentialId: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
    // Verification
    verificationStatus: {
      type: String,
      enum: Object.values(CERTIFICATE_STATUS),
      default: CERTIFICATE_STATUS.PENDING,
      index: true,
    },
    verifiedAt: { type: Date },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: { type: String, trim: true },
    // After verification, test gets unlocked
    testUnlocked: { type: Boolean, default: false },
    testUnlockedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

certificateSchema.index({ user: 1, skill: 1 });
certificateSchema.index({ user: 1, verificationStatus: 1 });
certificateSchema.index({ createdAt: -1 });

// Virtual: is expired
certificateSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
