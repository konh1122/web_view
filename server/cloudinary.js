import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ฟังก์ชันดึงรายการวิดีโอ
export const getVideosFromCloudinary = async () => {
  try {
    const result = await cloudinary.api.resources({ 
      type: 'upload',
      resource_type: 'video',
      max_results: 50 
    });
    return result.resources;
  } catch (error) {
    console.error('Error fetching videos:', error);
    console.error('Config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
    });
    return [];
  }
};

// ฟังก์ชันทดสอบการเชื่อมต่อ
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
    return false;
  }
};