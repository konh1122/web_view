import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Interceptor สำหรับ error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const getAllVideos = async () => {
  try {
    const response = await api.get('/videos')
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลวิดีโอได้')
  }
}

export const getVideoById = async (id) => {
  try {
    const response = await api.get(`/videos/${id}`)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'ไม่พบวิดีโอที่ต้องการ')
  }
}

export const testConnection = async () => {
  try {
    const response = await api.get('/videos/test/connection')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'ทดสอบการเชื่อมต่อไม่สำเร็จ')
  }
}