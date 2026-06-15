'use strict';

const Certificate = require('../models/Certificate.model');
const { UserSkill } = require('../models/Skill.model');
const { Task } = require('../models/Task.model');
const AppError = require('../utils/AppError');
const { CERTIFICATE_STATUS, TASK_STATUS } = require('../constants');
const logger = require('../utils/logger');

/**
 * Create certificate record after file upload
 */
const createCertificate = async (userId, skillId, fileData, metaData) => {
  // Ensure UserSkill record exists
  await UserSkill.findOneAndUpdate(
    { user: userId, skill: skillId },
    { $setOnInsert: { user: userId, skill: skillId, status: 'learning' }, certificateUploaded: true },
    { upsert: true, new: true }
  );

  const certificate = await Certificate.create({
    user: userId,
    skill: skillId,
    fileName: fileData.originalname,
    fileUrl: fileData.path,
    fileType: fileData.mimetype,
    fileSize: fileData.size,
    ...metaData,
    verificationStatus: CERTIFICATE_STATUS.PENDING,
  });

  logger.info(`Certificate uploaded: ${certificate._id} for skill ${skillId} by user ${userId}`);
  return certificate;
};

/**
 * Get all pending certificates (admin dashboard)
 */
const getPendingCertificates = async () => {
  return Certificate.find({ verificationStatus: CERTIFICATE_STATUS.PENDING })
    .populate('user', 'name email')
    .populate('skill', 'name category')
    .sort({ createdAt: 1 }); // oldest first
};

/**
 * Admin: verify a certificate and trigger test unlock
 */
const verifyCertificate = async (certificateId, adminId, { status, rejectionReason }) => {
  const certificate = await Certificate.findById(certificateId);
  if (!certificate) throw new AppError('Certificate not found.', 404);

  if (certificate.verificationStatus !== CERTIFICATE_STATUS.PENDING) {
    throw new AppError('Certificate has already been reviewed.', 400);
  }

  certificate.verificationStatus = status;
  certificate.verifiedAt = new Date();
  certificate.verifiedBy = adminId;
  if (status === CERTIFICATE_STATUS.REJECTED) {
    certificate.rejectionReason = rejectionReason;
  }

  await certificate.save();
  logger.info(`Certificate ${certificateId} ${status} by admin ${adminId}`);
  return certificate;
};

/**
 * Get certificate stats for a user
 */
const getUserCertificateStats = async (userId) => {
  const stats = await Certificate.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$verificationStatus',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { pending: 0, verified: 0, rejected: 0, total: 0 };
  stats.forEach((s) => {
    result[s._id] = s.count;
    result.total += s.count;
  });
  return result;
};

module.exports = {
  createCertificate,
  getPendingCertificates,
  verifyCertificate,
  getUserCertificateStats,
};
