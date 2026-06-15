'use strict';

const { LEVEL_THRESHOLDS } = require('../constants');

/**
 * Calculate user level from total XP
 */
const calculateLevel = (totalXP) => {
  let currentLevel = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXP >= threshold.minXP) {
      currentLevel = threshold;
    } else {
      break;
    }
  }
  const nextLevel = LEVEL_THRESHOLDS.find((t) => t.minXP > totalXP) || null;
  const xpToNextLevel = nextLevel ? nextLevel.minXP - totalXP : 0;
  const progressPercent = nextLevel
    ? Math.floor(((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100)
    : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentLevelMinXP: currentLevel.minXP,
    nextLevelMinXP: nextLevel ? nextLevel.minXP : null,
    xpToNextLevel,
    progressPercent,
  };
};

module.exports = { calculateLevel };
