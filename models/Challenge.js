const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  moralTwist: { type: String, required: true },
  example: { type: String, required: true },
  solution: { type: String, required: true },
  teaching: {
    scripture: { type: String, required: true },
    verse: { type: String, required: true },
    lesson: { type: String, required: true }
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);