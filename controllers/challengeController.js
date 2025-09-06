const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');

// Fallback data when database is not available
const fallbackChallenges = [
  {
    _id: '1',
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
    _id: '2',
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

// Get all challenges
const getChallenges = async (req, res) => {
  try {
    // Try database first, fallback to static data
    let challenges;
    try {
      challenges = await Challenge.find().select('-solution');
    } catch (dbError) {
      challenges = fallbackChallenges.map(c => ({ ...c, solution: undefined }));
    }
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single challenge
const getChallenge = async (req, res) => {
  try {
    let challenge;
    try {
      challenge = await Challenge.findById(req.params.id).select('-solution');
    } catch (dbError) {
      challenge = fallbackChallenges.find(c => c._id === req.params.id);
      if (challenge) {
        challenge = { ...challenge, solution: undefined };
      }
    }
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get challenge solution
const getSolution = async (req, res) => {
  try {
    let challenge;
    try {
      challenge = await Challenge.findById(req.params.id).select('solution');
    } catch (dbError) {
      challenge = fallbackChallenges.find(c => c._id === req.params.id);
    }
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json({ solution: challenge.solution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit code
const submitCode = async (req, res) => {
  try {
    const { challengeId, code, userId } = req.body;
    
    let challenge;
    try {
      challenge = await Challenge.findById(challengeId);
    } catch (dbError) {
      challenge = fallbackChallenges.find(c => c._id === challengeId);
    }
    
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    // Simple code execution simulation
    let status = 'passed';
    let karmaPoints = 0;
    
    if (code.length > 50) {
      karmaPoints = challenge.difficulty === 'Easy' ? 10 : challenge.difficulty === 'Medium' ? 20 : 30;
    }

    // Try to save to database, but don't fail if unavailable
    try {
      const submission = new Submission({
        challengeId,
        userId: userId || 'anonymous',
        code,
        status,
        karmaPoints
      });
      await submission.save();
    } catch (dbError) {
      console.log('Submission not saved to database (using fallback mode)');
    }

    res.json({ message: 'Code submitted successfully', karmaPoints, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChallenges, getChallenge, getSolution, submitCode };