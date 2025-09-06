const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const videoDir = path.join(uploadDir, 'videos');
const thumbnailDir = path.join(uploadDir, 'thumbnails');

fs.ensureDirSync(videoDir);
fs.ensureDirSync(thumbnailDir);

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, videoDir);
    } else if (file.fieldname === 'thumbnail') {
      cb(null, thumbnailDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for spiritual content
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  } else if (file.fieldname === 'thumbnail') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails!'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;