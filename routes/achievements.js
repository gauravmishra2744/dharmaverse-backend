const express = require('express');
const router = express.Router();
const { getUserAchievements, updateAchievementProgress } = require('../controllers/achievementController');
const { authenticate } = require('../middleware/auth');

// Get user achievements
router.get('/', authenticate, getUserAchievements);

// Update achievement progress
router.put('/progress', authenticate, updateAchievementProgress);

module.exports = router;