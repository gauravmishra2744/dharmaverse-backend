const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Bhagavad Gita', 'Meditation', 'Spirituality', 'Philosophy', 'Mantras', 'Buddhism', 'Yoga', 'Devotional']
  },
  tags: [String],
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  duration: { type: String },
  thumbnail: { type: String },
  uploadedBy: { type: String, required: true },
  channelName: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  isLive: { type: Boolean, default: false },
  liveStreamKey: { type: String },
  spiritualContent: { type: Boolean, default: true },
  moderationNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);