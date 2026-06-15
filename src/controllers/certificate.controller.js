'use strict';

const Certificate = require('../models/Certificate.model');
const { UserSkill } = require('../models/Skill.model');
const testService = require('../services/test.service');
const { awardXP } = require('../services/gamification.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { HTTP_STATUS, CERTIFICATE_STATUS } = require('../constants');
const AppError = require('../utils/AppError');
const { getPagination } = require('../helpers/pagination.helper');
const path = require('path');

const uploadCertificate = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Please upload a certificate file.', 400);
  const { skillId, certificateName, issuingOrganization, issueDate, credentialId, credentialUrl } = req.body;

  if (!skillId) throw new AppError('Skill ID is required.', 400);

  const fileUrl = `/uploads/${req.file.filename}`;

  // Create or update user skill record
  await UserSkill.findOneAndUpdate(
    { user: req.user._id, skill: skillId },
    {
      user: req.user._id,
      skill: skillId,
      status: 'learning',
      certificateUploaded: true,
    },
    { upsert: true }
  );

  const certificate = await Certificate.create({
    user: req.user._id,
    skill: skillId,
    fileName: req.file.originalname,
    fileUrl,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    certificateName,
    issuingOrganization,
    issueDate: issueDate ? new Date(issueDate) : undefined,
    credentialId,
    credentialUrl,
    verificationStatus: CERTIFICATE_STATUS.PENDING,
  });

  // Link certificate to user skill
  await UserSkill.findOneAndUpdate({ user: req.user._id, skill: skillId }, { certificateId: certificate._id });

  // Award XP for uploading
  await awardXP(req.user._id, 'CERTIFICATE_UPLOAD', certificate._id, 'Certificate').catch(() => {});

  sendSuccess(res, HTTP_STATUS.CREATED, 'Certificate uploaded. Pending verification.', certificate);
});

const getMyCertificates = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { user: req.user._id };
  if (req.query.status) filter.verificationStatus = req.query.status;

  const [certs, total] = await Promise.all([
    Certificate.find(filter).populate('skill', 'name category').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Certificate.countDocuments(filter),
  ]);

  sendPaginated(res, HTTP_STATUS.OK, 'Certificates fetched.', certs, { total, page, limit });
});

const getCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findOne({ _id: req.params.id, user: req.user._id })
    .populate('skill', 'name category');
  if (!cert) throw new AppError('Certificate not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Certificate fetched.', cert);
});

// Admin: verify or reject certificate
const verifyCertificate = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  if (![CERTIFICATE_STATUS.VERIFIED, CERTIFICATE_STATUS.REJECTED].includes(status)) {
    throw new AppError('Status must be "verified" or "rejected".', 400);
  }

  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) throw new AppError('Certificate not found.', 404);

  certificate.verificationStatus = status;
  certificate.verifiedAt = new Date();
  certificate.verifiedBy = req.user._id;
  if (status === CERTIFICATE_STATUS.REJECTED) certificate.rejectionReason = rejectionReason;

  await certificate.save();

  // If verified: unlock the test
  if (status === CERTIFICATE_STATUS.VERIFIED) {
    await testService.unlockTest(certificate.user, certificate.skill, certificate._id);
  }

  sendSuccess(res, HTTP_STATUS.OK, `Certificate ${status}.`, certificate);
});

const deleteCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!cert) throw new AppError('Certificate not found.', 404);
  sendSuccess(res, HTTP_STATUS.OK, 'Certificate deleted.');
});

module.exports = { uploadCertificate, getMyCertificates, getCertificate, verifyCertificate, deleteCertificate };
