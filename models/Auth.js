const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users
  username: { type: String, required: true, unique: true },
  
  // Profile Information
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    dateOfBirth: Date,
    location: String,
    spiritualLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Master'], default: 'Beginner' }
  },

  // OAuth Providers
  providers: {
    google: {
      id: String,
      email: String,
      verified: { type: Boolean, default: false }
    },
    facebook: {
      id: String,
      email: String,
      verified: { type: Boolean, default: false }
    },
    github: {
      id: String,
      username: String,
      verified: { type: Boolean, default: false }
    }
  },

  // Gamification
  karma: {
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{
      name: String,
      icon: String,
      earnedAt: { type: Date, default: Date.now },
      description: String
    }],
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivity: Date
    }
  },

  // Preferences
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      dailyWisdom: { type: Boolean, default: true },
      challenges: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      showProgress: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true }
    }
  },

  // Security
  security: {
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String
  },

  // Activity Tracking
  activity: {
    challengesCompleted: { type: Number, default: 0 },
    videosWatched: { type: Number, default: 0 },
    meditationMinutes: { type: Number, default: 0 },
    communityPosts: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },

  // Account Status
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false },
  premiumExpires: Date,
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
authSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Hash password before saving
authSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
authSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
authSchema.methods.isLocked = function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
};

// Increment login attempts
authSchema.methods.incLoginAttempts = function() {
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1, 'security.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'security.loginAttempts': 1 } };
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { 'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Add karma points
authSchema.methods.addKarma = function(points, reason) {
  this.karma.points += points;
  this.karma.level = Math.floor(this.karma.points / 100) + 1;
  this.activity.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model('Auth', authSchema);