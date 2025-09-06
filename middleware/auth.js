const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');

// Verify JWT Token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Auth.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user not found.' 
      });
    }

    req.userId = user._id;
    req.user = { ...user.toObject(), id: user._id };
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.', 
      error: error.message 
    });
  }
};

// Optional Authentication (for public routes that can benefit from user context)
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Auth.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.userId = user._id;
        req.user = { ...user.toObject(), id: user._id };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions.' 
      });
    }

    next();
  };
};

// Rate limiting middleware
exports.rateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    if (attempts.has(key)) {
      attempts.set(key, attempts.get(key).filter(time => time > windowStart));
    }

    const userAttempts = attempts.get(key) || [];
    
    if (userAttempts.length >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil((userAttempts[0] + windowMs - now) / 1000)
      });
    }

    userAttempts.push(now);
    attempts.set(key, userAttempts);
    next();
  };
};