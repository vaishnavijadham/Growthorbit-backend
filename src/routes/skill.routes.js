'use strict';

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { skillCatalogValidator, addUserSkillValidator, updateUserSkillValidator } = require('../validators/skill.validator');

router.use(protect);

// Catalog
router.get('/catalog', skillController.getAllSkills);
router.get('/catalog/:id', skillController.getSkillById);
router.post('/catalog', adminOnly, skillCatalogValidator, validate, skillController.createSkill);

// User skill tracking
router.get('/my', skillController.getUserSkills);
router.post('/my', addUserSkillValidator, validate, skillController.addUserSkill);
router.patch('/my/:id', updateUserSkillValidator, validate, skillController.updateUserSkill);
router.delete('/my/:id', skillController.removeUserSkill);

module.exports = router;
