const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Auth = require('../models/Auth');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await Auth.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or username' 
      });
    }

    // Create new user
    const user = new Auth({
      email,
      password,
      username,
      profile: { firstName, lastName },
      security: {
        emailVerificationToken: crypto.randomBytes(32).toString('hex')
      }
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to DharmaVerse 🕉️',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.profile.avatar,
        karmaPoints: user.karma.points,
        level: user.karma.level
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({ 
        success: false, 
        message: 'Account temporarily locked due to too many failed attempts' 
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await user.incLoginAttempts();
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.security.lastLogin = new Date();
    user.security.loginAttempts = 0;
    user.security.lockUntil = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful! Welcome back to DharmaVerse 🙏',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.profile.avatar,
        karmaPoints: user.karma.points,
        level: user.karma.level,
        spiritualLevel: user.profile.spiritualLevel
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

// Google OAuth Login
exports.googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, given_name, family_name } = payload;

    // Check if user exists
    let user = await Auth.findOne({ 
      $or: [
        { email },
        { 'providers.google.id': googleId }
      ]
    });

    if (user) {
      // Update Google info if not set
      if (!user.providers.google.id) {
        user.providers.google = { id: googleId, email, verified: true };
        await user.save();
      }
    } else {
      // Create new user
      user = new Auth({
        email,
        username: email.split('@')[0] + '_' + Date.now(),
        profile: {
          firstName: given_name || name.split(' ')[0],
          lastName: family_name || name.split(' ').slice(1).join(' '),
          avatar: picture
        },
        providers: {
          google: { id: googleId, email, verified: true }
        },
        security: {
          emailVerified: true
        }
      });
      await user.save();
    }

    // Update last login
    user.security.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google authentication successful! 🌟',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.profile.avatar,
        karmaPoints: user.karma.points,
        level: user.karma.level
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Google authentication failed', 
      error: error.message 
    });
  }
};

// Facebook OAuth Login
exports.facebookAuth = async (req, res) => {
  try {
    const { accessToken, userID } = req.body;

    // Verify Facebook token (simplified - in production use Facebook SDK)
    const response = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
    const fbUser = await response.json();

    if (fbUser.error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid Facebook token' 
      });
    }

    // Check if user exists
    let user = await Auth.findOne({ 
      $or: [
        { email: fbUser.email },
        { 'providers.facebook.id': fbUser.id }
      ]
    });

    if (user) {
      // Update Facebook info if not set
      if (!user.providers.facebook.id) {
        user.providers.facebook = { id: fbUser.id, email: fbUser.email, verified: true };
        await user.save();
      }
    } else {
      // Create new user
      const nameParts = fbUser.name.split(' ');
      user = new Auth({
        email: fbUser.email,
        username: fbUser.email.split('@')[0] + '_fb_' + Date.now(),
        profile: {
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          avatar: fbUser.picture?.data?.url
        },
        providers: {
          facebook: { id: fbUser.id, email: fbUser.email, verified: true }
        },
        security: {
          emailVerified: true
        }
      });
      await user.save();
    }

    // Update last login
    user.security.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Facebook authentication successful! 📘',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.profile.avatar,
        karmaPoints: user.karma.points,
        level: user.karma.level
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Facebook authentication failed', 
      error: error.message 
    });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await Auth.findById(req.userId).select('-password -security.passwordResetToken');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        karma: user.karma,
        preferences: user.preferences,
        activity: user.activity,
        isPremium: user.isPremium,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile', 
      error: error.message 
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logged out successfully. May your path be filled with wisdom! 🙏'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Logout failed', 
      error: error.message 
    });
  }
};