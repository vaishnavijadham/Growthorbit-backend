'use strict';

const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const { uploadCertificateValidator, verifyCertificateValidator } = require('../validators/certificate.validator');

router.use(protect);

router.post('/upload', handleUpload, uploadCertificateValidator, validate, certificateController.uploadCertificate);
router.get('/my', certificateController.getMyCertificates);
router.get('/my/:id', certificateController.getCertificate);
router.delete('/my/:id', certificateController.deleteCertificate);

// Admin
router.patch('/:id/verify', adminOnly, verifyCertificateValidator, validate, certificateController.verifyCertificate);

module.exports = router;
