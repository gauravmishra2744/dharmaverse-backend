const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Bhagavad Gita', 'Meditation', 'Spirituality', 'Philosophy', 'Mantras', 'Buddhism', 'Yoga', 'Devotional']
  },
  streamKey: { type: String, required: true, unique: true },
  streamerName: { type: String, required: true },
  channelName: { type: String, required: true },
  isLive: { type: Boolean, default: false },
  viewers: { type: Number, default: 0 },
  startTime: { type: Date },
  endTime: { type: Date },
  thumbnail: { type: String },
  spiritualContent: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('LiveStream', liveStreamSchema);