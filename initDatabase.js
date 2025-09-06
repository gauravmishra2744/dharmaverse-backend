require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('./models/User');
const Challenge = require('./models/Challenge');
const Video = require('./models/Video');
const Submission = require('./models/Submission');
const LiveStream = require('./models/LiveStream');
const Scripture = require('./models/Scripture');
const Meditation = require('./models/Meditation');
const DailyWisdom = require('./models/DailyWisdom');
const Community = require('./models/Community');

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dharmaverse', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create indexes for better performance
    await User.createIndexes();
    await Challenge.createIndexes();
    await Video.createIndexes();
    await Scripture.createIndexes();
    await Meditation.createIndexes();
    await DailyWisdom.createIndexes();
    await Community.createIndexes();
    
    console.log('✅ Database indexes created');

    // Sample data insertion
    await insertSampleData();
    
    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  // Sample Scripture
  const sampleScripture = await Scripture.findOne({ title: 'Karma Yoga' });
  if (!sampleScripture) {
    await Scripture.create({
      title: 'Karma Yoga',
      source: 'Bhagavad Gita',
      chapter: '2',
      verse: '47',
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      translation: 'You have a right to perform your prescribed duty, but not to the fruits of action.',
      commentary: 'This verse teaches the principle of selfless action without attachment to results.',
      tags: ['karma', 'duty', 'detachment'],
      category: 'Karma'
    });
    console.log('📜 Sample scripture added');
  }

  // Sample Daily Wisdom
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayWisdom = await DailyWisdom.findOne({ date: today });
  if (!todayWisdom) {
    await DailyWisdom.create({
      date: today,
      quote: 'The mind is everything. What you think you become.',
      source: 'Buddha',
      explanation: 'Our thoughts shape our reality and determine our path in life.',
      category: 'Wisdom'
    });
    console.log('🌅 Daily wisdom added');
  }

  // Sample Meditation
  const sampleMeditation = await Meditation.findOne({ title: 'Basic Mindfulness' });
  if (!sampleMeditation) {
    await Meditation.create({
      title: 'Basic Mindfulness',
      description: 'A simple mindfulness meditation for beginners',
      type: 'Mindfulness',
      duration: 10,
      difficulty: 'Beginner',
      instructions: [
        'Sit comfortably with your back straight',
        'Close your eyes and focus on your breath',
        'When your mind wanders, gently return to the breath',
        'Continue for the full duration'
      ],
      benefits: ['Reduces stress', 'Improves focus', 'Increases awareness'],
      tags: ['mindfulness', 'breathing', 'beginner']
    });
    console.log('🧘 Sample meditation added');
  }
};

// Run initialization
initDatabase();