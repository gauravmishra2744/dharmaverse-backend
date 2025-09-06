const mongoose = require('mongoose');
const { Achievement } = require('./models/Achievement');
require('dotenv').config();

const achievements = [
  {
    title: "First Steps",
    description: "Complete your first spiritual question",
    icon: "🌱",
    category: "beginner",
    points: 50,
    requirement: "Ask 1 question"
  },
  {
    title: "Seeker of Truth",
    description: "Ask 10 spiritual questions",
    icon: "🔍",
    category: "questions",
    points: 100,
    requirement: "Ask 10 questions"
  },
  {
    title: "Wisdom Collector",
    description: "Earn 500 karma points",
    icon: "💎",
    category: "karma",
    points: 200,
    requirement: "Earn 500 karma points"
  },
  {
    title: "Daily Devotee",
    description: "Login for 7 consecutive days",
    icon: "🔥",
    category: "streak",
    points: 150,
    requirement: "7-day login streak"
  },
  {
    title: "Path Explorer",
    description: "Try all spiritual traditions",
    icon: "🌍",
    category: "exploration",
    points: 300,
    requirement: "Use 8 different traditions"
  },
  {
    title: "Meditation Master",
    description: "Complete 50 meditation sessions",
    icon: "🧘",
    category: "meditation",
    points: 400,
    requirement: "Complete 50 meditations"
  },
  {
    title: "Community Helper",
    description: "Help 25 fellow seekers",
    icon: "🤝",
    category: "community",
    points: 250,
    requirement: "Help 25 users"
  },
  {
    title: "Enlightened One",
    description: "Reach 1000 karma points",
    icon: "✨",
    category: "karma",
    points: 500,
    requirement: "Earn 1000 karma points"
  }
];

async function seedAchievements() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('Cleared existing achievements');
    
    // Insert new achievements
    await Achievement.insertMany(achievements);
    console.log('Seeded achievements successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }
}

seedAchievements();