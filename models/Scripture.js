const mongoose = require('mongoose');

const scriptureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { 
    type: String, 
    required: true,
    enum: ['Bhagavad Gita', 'Upanishads', 'Vedas', 'Ramayana', 'Mahabharata', 'Puranas', 'Buddhist Texts', 'Other']
  },
  chapter: { type: String, required: true },
  verse: { type: String, required: true },
  sanskrit: { type: String },
  translation: { type: String, required: true },
  commentary: { type: String },
  tags: [String],
  category: {
    type: String,
    enum: ['Dharma', 'Karma', 'Moksha', 'Bhakti', 'Meditation', 'Ethics', 'Philosophy', 'Devotion']
  },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Scripture', scriptureSchema);