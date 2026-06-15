'use strict';

const openrouter = require('./openrouterTest.service');

const generateMCQs = async (skill) => {
  const questions = await openrouter.generateMCQs(skill);

  // safety check
  if (!Array.isArray(questions)) {
    throw new Error("Invalid MCQ format from AI");
  }

  return questions;
};

module.exports = {
  generateMCQs
};