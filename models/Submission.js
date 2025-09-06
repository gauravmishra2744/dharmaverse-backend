const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  userId: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
  testResults: [{
    testCase: Number,
    passed: Boolean,
    error: String
  }],
  karmaPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);