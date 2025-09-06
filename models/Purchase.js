const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' },
  image: { type: String, default: '📚' },
  category: { type: String, enum: ['book', 'course', 'audio', 'video'], default: 'book' },
  downloadUrl: String,
  karmaEarned: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);