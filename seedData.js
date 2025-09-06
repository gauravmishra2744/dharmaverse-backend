require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('./models/Challenge');

const challenges = [
  {
    title: "Compassionate Sorting",
    description: "Write a sorting algorithm that prioritizes kind acts over selfish ones.",
    difficulty: "Medium",
    moralTwist: "Acts of kindness should always come first, regardless of their numerical value.",
    example: "Input: [{act: 'helping elderly', value: 3}, {act: 'stealing', value: 10}, {act: 'charity', value: 5}]",
    solution: `function compassionateSort(acts) {
  const kindActs = ['helping', 'charity', 'sharing', 'caring', 'giving'];
  const selfishActs = ['stealing', 'lying', 'cheating', 'hurting'];
  
  return acts.sort((a, b) => {
    const aIsKind = kindActs.some(kind => a.act.includes(kind));
    const bIsKind = kindActs.some(kind => b.act.includes(kind));
    const aIsSelfish = selfishActs.some(selfish => a.act.includes(selfish));
    const bIsSelfish = selfishActs.some(selfish => b.act.includes(selfish));
    
    if (aIsKind && !bIsKind) return -1;
    if (!aIsKind && bIsKind) return 1;
    if (aIsSelfish && !bIsSelfish) return 1;
    if (!aIsSelfish && bIsSelfish) return -1;
    
    return b.value - a.value;
  });
}`,
    teaching: {
      scripture: "Bhagavad Gita 3.21",
      verse: "Whatever action a great person performs, common people follow. Whatever standards they set, the world pursues.",
      lesson: "In programming as in life, we must prioritize moral actions over personal gain. Our code should reflect our values."
    }
  },
  {
    title: "Truth Validator",
    description: "Create a function that validates data integrity with absolute honesty.",
    difficulty: "Easy",
    moralTwist: "The function must never return false positives, even if it means admitting uncertainty.",
    example: "Input: userData with potential inconsistencies",
    solution: `function truthValidator(data) {
  const validations = {
    isValid: true,
    uncertainties: [],
    errors: []
  };
  
  if (!data || typeof data !== 'object') {
    validations.isValid = false;
    validations.errors.push('Invalid data structure');
    return validations;
  }
  
  Object.keys(data).forEach(key => {
    if (data[key] === undefined || data[key] === null) {
      validations.uncertainties.push(\`Cannot verify \${key}\`);
    }
  });
  
  if (validations.uncertainties.length > 0) {
    validations.isValid = false;
  }
  
  return validations;
}`,
    teaching: {
      scripture: "Quran 17:81",
      verse: "And say: Truth has come and falsehood has vanished. Indeed, falsehood is bound to vanish.",
      lesson: "Honest code builds trust. Never compromise truth for convenience - uncertainty is better than false certainty."
    }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dharmaverse');
    await Challenge.deleteMany({});
    await Challenge.insertMany(challenges);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();