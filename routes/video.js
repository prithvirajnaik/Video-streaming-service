const express = require('express');
const router = express.Router();
const { 
  uploadVideo, 
  getVideos, 
  getMyVideos, 
  getVideo, 
  streamVideo, 
  deleteVideo 
} = require('../controllers/videoController');
const { authenticate } = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', getVideos); // Get all public videos
router.get('/:id', getVideo); // Get video details
router.get('/:id/stream', streamVideo); // Stream video

// Protected routes (require authentication)
router.post('/upload', authenticate, upload.single('video'), handleUploadError, uploadVideo);
router.get('/my/videos', authenticate, getMyVideos); // Get user's own videos
router.delete('/:id', authenticate, deleteVideo); // Delete user's own video

module.exports = router;
