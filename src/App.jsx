import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const VideoStreamingApp = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewCounts, setViewCounts] = useState({});
  const [hasViewedVideos, setHasViewedVideos] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDurations, setVideoDurations] = useState({});
  const videoRef = useRef(null);

  const videosPerPage = 20;
  const categories = ['all', 'general', 'entertainment', 'education', 'music', 'sports', 'news', 'gaming', 'tech'];

  // Server API URL
  const API_BASE_URL = '/api';

  // Load video duration from video element
  const loadVideoDuration = (videoUrl, videoId) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      
      const onLoadedMetadata = () => {
        const duration = video.duration;
        setVideoDurations(prev => ({
          ...prev,
          [videoId]: duration
        }));
        resolve(duration);
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('error', onError);
      };
      
      const onError = () => {
        resolve(0);
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('error', onError);
      };
      
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('error', onError);
      video.src = videoUrl;
    });
  };

  // Fetch videos from Cloudinary API
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/videos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        const videosWithViews = data.data.map(video => {
          const baseViews = Math.floor(Math.random() * 100000) + 1000;
          const storedViews = localStorage.getItem(`video_views_${video.id}`);
          const actualViews = storedViews ? parseInt(storedViews) : baseViews;
          
          return {
            ...video,
            views: actualViews,
            title: video.title || video.context?.title || video.original_filename || 'Untitled Video',
            description: video.description || video.context?.description || '',
            category: video.category || video.context?.category || 'general',
            thumbnail: video.thumbnail || video.url.replace(/\.[^/.]+$/, ".jpg")
          };
        });
        
        // Load view counts from localStorage
        const counts = {};
        videosWithViews.forEach(video => {
          const storedCount = localStorage.getItem(`video_views_${video.id}`);
          counts[video.id] = storedCount ? parseInt(storedCount) : video.views;
        });
        setViewCounts(counts);
        
        // Load viewed videos set
        const viewedVideos = localStorage.getItem('viewed_videos');
        if (viewedVideos) {
          setHasViewedVideos(new Set(JSON.parse(viewedVideos)));
        }
        
        setVideos(videosWithViews);
        setFilteredVideos(videosWithViews);

        // Load durations for all videos
        videosWithViews.forEach(async (video) => {
          await loadVideoDuration(video.url, video.id);
        });
        
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(`ไม่สามารถโหลดวิดีโอได้: ${err.message}`);
      setVideos([]);
      setFilteredVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter videos based on search and category
  useEffect(() => {
    let filtered = videos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, videos]);

  // Handle video view tracking
  const handleVideoPlay = (video) => {
    if (!hasViewedVideos.has(video.id)) {
      const newViewCount = (viewCounts[video.id] || video.views) + 1;
      const updatedViewCounts = { ...viewCounts, [video.id]: newViewCount };
      
      setViewCounts(updatedViewCounts);
      const newViewedVideos = new Set([...hasViewedVideos, video.id]);
      setHasViewedVideos(newViewedVideos);
      
      localStorage.setItem(`video_views_${video.id}`, newViewCount.toString());
      localStorage.setItem('viewed_videos', JSON.stringify([...newViewedVideos]));
      
      const updatedVideos = videos.map(v => 
        v.id === video.id ? { ...v, views: newViewCount } : v
      );
      setVideos(updatedVideos);
      setFilteredVideos(prevFiltered => 
        prevFiltered.map(v => v.id === video.id ? { ...v, views: newViewCount } : v)
      );
    }
    
    setCurrentVideo({
      ...video,
      views: viewCounts[video.id] || video.views
    });
    setCurrentTime(0);
    setProgress(0);
  };

  // Get current view count for a video
  const getCurrentViews = (video) => {
    return viewCounts[video.id] || video.views;
  };

  // Get duration for video
  const getVideoDuration = (videoId) => {
    return videoDurations[videoId] || 0;
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const totalSeconds = Math.floor(Number(seconds));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format views
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get suggested videos
  const getSuggestedVideos = () => {
    if (!currentVideo) return [];
    return videos
      .filter(video => video.id !== currentVideo.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
  };

  // Handle video element events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo) return;

    const handleCanPlay = () => {
      video.muted = false;
      video.volume = 0.8;
      
      if (video.audioTracks && video.audioTracks.length > 0) {
        for (let i = 0; i < video.audioTracks.length; i++) {
          video.audioTracks[i].enabled = true;
        }
      }
    };

    const handleLoadedMetadata = () => {
      video.muted = false;
      video.volume = 0.8;
      
      // อัปเดต duration จาก video element เมื่อโหลดเสร็จ
      const actualDuration = video.duration;
      if (actualDuration && !isNaN(actualDuration)) {
        setVideoDurations(prev => ({
          ...prev,
          [currentVideo.id]: actualDuration
        }));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [currentVideo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (currentVideo) {
    const suggestedVideos = getSuggestedVideos();
    const currentVideoDuration = getVideoDuration(currentVideo.id);
    
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <button
              onClick={() => setCurrentVideo(null)}
              className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
            >
              ← กลับหน้าแรก
            </button>
            <h1 className="text-2xl font-bold">FreeVideo</h1>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={currentVideo.url}
                  controls
                  autoPlay
                  className="w-full h-auto"
                  poster={currentVideo.thumbnail}
                  preload="metadata"
                  crossOrigin="anonymous"
                  onLoadStart={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = false;
                      videoRef.current.volume = 0.8;
                    }
                  }}
                  onCanPlay={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = false;
                      videoRef.current.volume = 0.8;
                    }
                  }}
                >
                  เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                </video>
              </div>
              
              {/* Video Info */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                
                {/* Video Stats Row */}
                <div className="flex items-center gap-4 text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatViews(getCurrentViews(currentVideo))} ครั้ง
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(currentVideoDuration)}
                  </span>
                </div>

                {/* Description */}
                {currentVideo.description && (
                  <p className="text-gray-300 leading-relaxed">{currentVideo.description}</p>
                )}
              </div>
            </div>

            {/* Suggested Videos */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">วิดีโอที่แนะนำ</h3>
              <div className="space-y-4">
                {suggestedVideos.map(video => {
                  const videoDuration = getVideoDuration(video.id);
                  return (
                    <div
                      key={video.id}
                      onClick={() => handleVideoPlay(video)}
                      className="flex gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-xs px-1 rounded">
                          {formatDuration(videoDuration)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          {formatViews(getCurrentViews(video))} ครั้ง
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">FreeVideo</h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาวิดีโอ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'ทั้งหมด' : 
                 category === 'general' ? 'ทั่วไป' :
                 category === 'entertainment' ? 'บันเทิง' :
                 category === 'education' ? 'การศึกษา' :
                 category === 'music' ? 'เพลง' :
                 category === 'sports' ? 'กีฬา' :
                 category === 'news' ? 'ข่าว' :
                 category === 'gaming' ? 'เกม' :
                 category === 'tech' ? 'เทคโนโลยี' : category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Connection Status */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            <p className="font-semibold">เกิดข้อผิดพลาด</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchVideos}
              className="mt-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {videos.length === 0 && !loading && !error && (
          <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
            <p className="font-semibold">ยังไม่มีวิดีโอใน Cloudinary</p>
            <p className="text-sm">กรุณาอัพโหลดวิดีโอผ่าน API ก่อนใช้งาน</p>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {currentVideos.map(video => {
            const videoDuration = getVideoDuration(video.id);
            return (
              <div
                key={video.id}
                onClick={() => handleVideoPlay(video)}
                className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 sm:h-40 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs px-2 py-1 rounded">
                    {videoDuration > 0 ? formatDuration(videoDuration) : 'กำลังโหลด...'}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatViews(getCurrentViews(video))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 3 || page === currentPage + 3) {
                return <span key={page} className="text-gray-400">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {filteredVideos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">ไม่พบวิดีโอที่ค้นหา</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoStreamingApp;