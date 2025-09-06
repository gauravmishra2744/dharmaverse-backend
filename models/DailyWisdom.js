const mongoose = require('mongoose');

const dailyWisdomSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  quote: { type: String, required: true },
  source: { type: String, required: true },
  author: String,
  explanation: String,
  reflection: String,
  category: {
    type: String,
    enum: ['Dharma', 'Karma', 'Compassion', 'Wisdom', 'Peace', 'Devotion', 'Service', 'Truth']
  },
  language: { type: String, default: 'English' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DailyWisdom', dailyWisdomSchema);