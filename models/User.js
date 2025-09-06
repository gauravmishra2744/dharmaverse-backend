const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    spiritualLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }
  },
  karmaPoints: { type: Number, default: 0 },
  achievements: [{
    title: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  preferences: {
    favoriteScriptures: [String],
    meditationReminders: { type: Boolean, default: false },
    dailyWisdom: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Virtual for calculating user level based on karma points
userSchema.virtual('level').get(function() {
  const karma = this.karmaPoints || 0;
  if (karma < 100) return 1;
  if (karma < 500) return 2;
  if (karma < 1000) return 3;
  if (karma < 2500) return 4;
  if (karma < 5000) return 5;
  return Math.floor(karma / 1000) + 1;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);