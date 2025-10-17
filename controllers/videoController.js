const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
const User = require('../models/User');

// Upload video
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    const { title } = req.body;
    
    if (!title || title.trim().length === 0) {
      // Clean up uploaded file if title is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Video title is required'
      });
    }

    // Create video record
    const video = new Video({
      title: title.trim(),
      filename: req.file.filename,
      filePath: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      userId: req.user.userId
    });

    await video.save();

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        video: {
          id: video._id,
          title: video.title,
          filename: video.filename,
          size: video.size,
          sizeInMB: video.sizeInMB,
          mimeType: video.mimeType,
          uploadDate: video.uploadDate,
          userId: video.userId
        }
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during upload'
    });
  }
};

// Get all videos with pagination
const getVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    // Build query
    let query = { isPublic: true };
    
    if (search) {
      query.$text = { $search: search };
    }

    // Get videos with pagination
    const videos = await Video.find(query)
      .populate('userId', 'name email')
      .select('-filePath') // Exclude file path for security
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Video.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        videos,
        pagination: {
          currentPage: page,
          totalPages,
          totalVideos: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's own videos
const getMyVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ userId: req.user.userId })
      .select('-filePath') // Exclude file path for security
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({ userId: req.user.userId });
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        videos,
        pagination: {
          currentPage: page,
          totalPages,
          totalVideos: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get my videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single video details
const getVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id)
      .populate('userId', 'name email')
      .select('-filePath'); // Exclude file path for security

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Increment view count
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: { video }
    });

  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Stream video with range support
const streamVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const videoPath = video.filePath;

    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: 'Video file not found on server'
      });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Parse range header
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range
      if (start >= fileSize || end >= fileSize || start > end) {
        return res.status(416).json({
          success: false,
          message: 'Range Not Satisfiable'
        });
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': video.mimeType,
      };

      res.writeHead(206, head);
      file.pipe(res);

    } else {
      // No range header - send entire file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': video.mimeType,
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }

  } catch (error) {
    console.error('Stream video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during streaming'
    });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ 
      _id: id, 
      userId: req.user.userId 
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found or you do not have permission to delete it'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(video.filePath)) {
      fs.unlinkSync(video.filePath);
    }

    // Delete video record
    await Video.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  uploadVideo,
  getVideos,
  getMyVideos,
  getVideo,
  streamVideo,
  deleteVideo
};
