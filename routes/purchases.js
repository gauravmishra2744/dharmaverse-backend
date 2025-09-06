const express = require('express');
const router = express.Router();
const { getUserPurchases, createPurchase } = require('../controllers/purchaseController');
const { authenticate } = require('../middleware/auth');

// Get user purchases
router.get('/', authenticate, getUserPurchases);

// Create new purchase
router.post('/', authenticate, createPurchase);

module.exports = router;