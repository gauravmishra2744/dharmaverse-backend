const express = require('express');
const { getChallenges, getChallenge, getSolution, submitCode } = require('../controllers/challengeController');

const router = express.Router();

router.get('/', getChallenges);
router.get('/:id', getChallenge);
router.get('/:id/solution', getSolution);
router.post('/submit', submitCode);

module.exports = router;