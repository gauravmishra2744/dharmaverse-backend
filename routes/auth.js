const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, rateLimit } = require('../middleware/auth');

// Apply rate limiting to auth routes
const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authRateLimit, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authRateLimit, authController.login);

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', authController.googleAuth);

// @route   POST /api/auth/facebook
// @desc    Facebook OAuth login
// @access  Public
router.post('/facebook', authController.facebookAuth);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, authController.getProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, authController.logout);

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      avatar: req.user.profile.avatar,
      karmaPoints: req.user.karma.points,
      level: req.user.karma.level
    }
  });
});

module.exports = router;