const Purchase = require('../models/Purchase');
const User = require('../models/User');

// Get user purchases
const getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);
    
    res.json({
      purchases,
      stats: {
        totalPurchases: purchases.length,
        totalSpent,
        completedPurchases: purchases.filter(p => p.status === 'completed').length
      }
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new purchase
const createPurchase = async (req, res) => {
  try {
    const { title, author, price, category, image } = req.body;
    
    const purchase = new Purchase({
      userId: req.user.id,
      title,
      author,
      price,
      category,
      image: image || '📚',
      karmaEarned: Math.floor(price * 10) // 10 karma per dollar
    });
    
    await purchase.save();
    
    // Update user karma points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { karmaPoints: purchase.karmaEarned }
    });
    
    res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserPurchases,
  createPurchase
};