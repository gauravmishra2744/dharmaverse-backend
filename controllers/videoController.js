const Video = require('../models/Video');
const LiveStream = require('../models/LiveStream');
const path = require('path');
const fs = require('fs-extra');

// Upload video
const uploadVideo = async (req, res) => {
  try {
    const { title, description, category, tags, channelName, uploadedBy } = req.body;
    
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    // Spiritual content validation
    const spiritualKeywords = ['spiritual', 'meditation', 'yoga', 'dharma', 'karma', 'bhagavad', 'gita', 'buddha', 'mantra', 'prayer', 'devotion', 'enlightenment'];
    const isSpiritual = spiritualKeywords.some(keyword => 
      title.toLowerCase().includes(keyword) || 
      description.toLowerCase().includes(keyword) ||
      (tags && tags.some(tag => tag.toLowerCase().includes(keyword)))
    );

    if (!isSpiritual) {
      // Delete uploaded files if not spiritual
      fs.unlinkSync(videoFile.path);
      if (thumbnailFile) fs.unlinkSync(thumbnailFile.path);
      return res.status(400).json({ message: 'Only spiritual content is allowed on DharmaVerse' });
    }

    const video = new Video({
      title,
      description,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      filename: videoFile.filename,
      originalName: videoFile.originalname,
      fileSize: videoFile.size,
      thumbnail: thumbnailFile ? thumbnailFile.filename : null,
      uploadedBy,
      channelName,
      spiritualContent: isSpiritual
    });

    await video.save();
    res.json({ message: 'Video uploaded successfully! Pending approval.', videoId: video._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all videos (approved only)
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isApproved: true }).sort({ createdAt: -1 });
    const videosWithUrls = videos.map(video => ({
      ...video.toObject(),
      videoUrl: `/api/videos/stream/${video._id}`,
      thumbnailUrl: video.thumbnail ? `/api/videos/thumbnail/${video.filename}` : null
    }));
    res.json(videosWithUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stream video
const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const videoPath = path.join(__dirname, '../uploads/videos', video.filename);
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get thumbnail
const getThumbnail = (req, res) => {
  const thumbnailPath = path.join(__dirname, '../uploads/thumbnails', req.params.filename);
  if (fs.existsSync(thumbnailPath)) {
    res.sendFile(thumbnailPath);
  } else {
    res.status(404).json({ message: 'Thumbnail not found' });
  }
};

// Start live stream
const startLiveStream = async (req, res) => {
  try {
    const { title, description, category, streamerName, channelName } = req.body;
    
    const streamKey = 'live_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const liveStream = new LiveStream({
      title,
      description,
      category,
      streamKey,
      streamerName,
      channelName,
      isLive: true,
      startTime: new Date()
    });

    await liveStream.save();
    res.json({ message: 'Live stream started!', streamKey, streamId: liveStream._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get live streams
const getLiveStreams = async (req, res) => {
  try {
    const liveStreams = await LiveStream.find({ isLive: true, isApproved: true });
    res.json(liveStreams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve video (admin function)
const approveVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    video.isApproved = true;
    await video.save();
    res.json({ message: 'Video approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadVideo,
  getVideos,
  streamVideo,
  getThumbnail,
  startLiveStream,
  getLiveStreams,
  approveVideo
};