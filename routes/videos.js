const express = require('express');
const upload = require('../middleware/upload');
const {
  uploadVideo,
  getVideos,
  streamVideo,
  getThumbnail,
  startLiveStream,
  getLiveStreams,
  approveVideo
} = require('../controllers/videoController');

const router = express.Router();

// Upload video
router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), uploadVideo);

// Get all videos
router.get('/', getVideos);

// Stream video
router.get('/stream/:id', streamVideo);

// Get thumbnail
router.get('/thumbnail/:filename', getThumbnail);

// Live streaming
router.post('/live/start', startLiveStream);
router.get('/live', getLiveStreams);

// Admin routes
router.put('/approve/:id', approveVideo);

module.exports = router;