const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, required: true },
  points: { type: Number, required: true },
  requirement: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const userAchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  unlocked: { type: Boolean, default: false },
  unlockedAt: Date
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

module.exports = { Achievement, UserAchievement };