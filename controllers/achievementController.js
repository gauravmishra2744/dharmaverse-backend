const { Achievement, UserAchievement } = require('../models/Achievement');
const User = require('../models/User');

// Get user achievements
const getUserAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    const userAchievements = await UserAchievement.find({ userId: req.user.id });
    const user = await User.findById(req.user.id);
    
    // Merge achievement data with user progress
    const achievementsWithProgress = achievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => 
        ua.achievementId.toString() === achievement._id.toString()
      );
      
      return {
        id: achievement._id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        points: achievement.points,
        requirement: achievement.requirement,
        progress: userAchievement?.progress || 0,
        unlocked: userAchievement?.unlocked || false,
        unlockedAt: userAchievement?.unlockedAt
      };
    });
    
    const stats = {
      totalAchievements: achievements.length,
      unlockedAchievements: userAchievements.filter(ua => ua.unlocked).length,
      totalPoints: userAchievements
        .filter(ua => ua.unlocked)
        .reduce((sum, ua) => {
          const achievement = achievements.find(a => a._id.toString() === ua.achievementId.toString());
          return sum + (achievement?.points || 0);
        }, 0),
      completionRate: Math.round((userAchievements.filter(ua => ua.unlocked).length / achievements.length) * 100)
    };
    
    res.json({
      achievements: achievementsWithProgress,
      stats
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update achievement progress
const updateAchievementProgress = async (req, res) => {
  try {
    const { achievementId, progress } = req.body;
    
    let userAchievement = await UserAchievement.findOne({
      userId: req.user.id,
      achievementId
    });
    
    if (!userAchievement) {
      userAchievement = new UserAchievement({
        userId: req.user.id,
        achievementId,
        progress: Math.min(progress, 100)
      });
    } else {
      userAchievement.progress = Math.min(progress, 100);
    }
    
    // Check if achievement should be unlocked
    if (userAchievement.progress >= 100 && !userAchievement.unlocked) {
      userAchievement.unlocked = true;
      userAchievement.unlockedAt = new Date();
      
      // Award karma points
      const achievement = await Achievement.findById(achievementId);
      if (achievement) {
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { karmaPoints: achievement.points }
        });
      }
    }
    
    await userAchievement.save();
    res.json(userAchievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserAchievements,
  updateAchievementProgress
};