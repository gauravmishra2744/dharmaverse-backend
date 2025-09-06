require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Connect to database
let dbConnected = false;
connectDB().then(connected => {
  dbConnected = connected;
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/achievements', require('./routes/achievements'));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'DharmaVerse Backend is running!',
    database: dbConnected ? 'Connected' : 'Using fallback data'
  });
});

// Export db status for controllers
app.locals.dbConnected = () => dbConnected;

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 DharmaVerse Backend running on port ${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Endpoint: http://localhost:${PORT}/api/ai/ask`);
});