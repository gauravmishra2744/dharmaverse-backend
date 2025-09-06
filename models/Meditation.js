const mongoose = require('mongoose');

const meditationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['Mindfulness', 'Mantra', 'Breathing', 'Walking', 'Loving-kindness', 'Visualization', 'Body Scan']
  },
  duration: { type: Number, required: true }, // in minutes
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  audioFile: String,
  instructions: [String],
  benefits: [String],
  tags: [String],
  guidedBy: String,
  isGuided: { type: Boolean, default: true },
  completions: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Meditation', meditationSchema);