const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Discussion', 'Question', 'Experience', 'Teaching', 'Meditation', 'Study Group']
  },
  author: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true }
  },
  content: { type: String, required: true },
  tags: [String],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  replies: [{
    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String
    },
    content: String,
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  isPinned: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);