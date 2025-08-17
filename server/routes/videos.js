import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { getVideosFromCloudinary, testCloudinaryConnection } from '../cloudinary.js';

const router = express.Router();

// Multer configuration สำหรับอัพโหลดไฟล์
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('กรุณาอัพโหลดไฟล์วิดีโอเท่านั้น'), false);
    }
  }
});

// POST /api/videos/upload - อัพโหลดวิดีโอพร้อมชื่อและคำอธิบาย
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบไฟล์วิดีโอที่อัพโหลด'
      });
    }

    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุชื่อวิดีโอ'
      });
    }

    // อัพโหลดไปยัง Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'videos', // โฟลเดอร์ใน Cloudinary
          public_id: `video_${Date.now()}`, // ชื่อไฟล์ที่ไม่ซ้ำกัน
          quality: 'auto', // ปรับคุณภาพอัตโนมัติ
          format: 'mp4', // บังคับให้เป็นรูปแบบ MP4
          // เพิ่ม context สำหรับเก็บ title และ description
          context: {
            title: title.trim(),
            description: description ? description.trim() : '',
            uploaded_at: new Date().toISOString()
          }
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    const formattedVideo = {
      id: uploadResult.public_id,
      title: title.trim(),
      description: description ? description.trim() : '',
      url: uploadResult.secure_url,
      thumbnail: uploadResult.secure_url.replace(/\.[^/.]+$/, ".jpg"),
      duration: uploadResult.duration,
      created_at: uploadResult.created_at,
      width: uploadResult.width,
      height: uploadResult.height,
      file_size: uploadResult.bytes
    };

    res.json({
      success: true,
      message: 'อัพโหลดวิดีโอสำเร็จ',
      data: formattedVideo
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'การอัพโหลดล้มเหลว',
      error: error.message
    });
  }
});

// GET /api/videos - ดึงรายการวิดีโอทั้งหมด
router.get('/', async (req, res) => {
  try {
    const videos = await getVideosFromCloudinary();
    const formattedVideos = videos.map(video => ({
      id: video.public_id,
      title: video.context?.title || video.display_name || video.public_id,
      description: video.context?.description || '',
      url: video.secure_url,
      thumbnail: video.secure_url.replace(/\.[^/.]+$/, ".jpg"),
      duration: video.duration,
      created_at: video.created_at,
      width: video.width,
      height: video.height
    }));
    
    // เรียงลำดับตามวันที่สร้างใหม่สุดก่อน
    formattedVideos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json({
      success: true,
      data: formattedVideos,
      count: formattedVideos.length
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos',
      error: error.message
    });
  }
});

// GET /api/videos/:id - ดึงข้อมูลวิดีโอเฉพาะ
router.get('/:id', async (req, res) => {
  try {
    const videos = await getVideosFromCloudinary();
    const video = videos.find(v => v.public_id === req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const formattedVideo = {
      id: video.public_id,
      title: video.context?.title || video.display_name || video.public_id,
      description: video.context?.description || '',
      url: video.secure_url,
      thumbnail: video.secure_url.replace(/\.[^/.]+$/, ".jpg"),
      duration: video.duration,
      created_at: video.created_at,
      width: video.width,
      height: video.height
    };
    
    res.json({
      success: true,
      data: formattedVideo
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video',
      error: error.message
    });
  }
});

// GET /api/videos/test/connection - ทดสอบการเชื่อมต่อ
router.get('/test/connection', async (req, res) => {
  try {
    const isConnected = await testCloudinaryConnection();
    res.json({
      success: isConnected,
      message: isConnected ? 'Connected to Cloudinary' : 'Failed to connect to Cloudinary'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    });
  }
});

export default router;