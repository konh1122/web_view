import { useState, useEffect } from 'react'
import { getAllVideos } from '../services/api'

export const useVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        const videosData = await getAllVideos()
        setVideos(videosData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const refetch = () => {
    fetchVideos()
  }

  return { videos, loading, error, refetch }
}

export default useVideos