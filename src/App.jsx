import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Search, ArrowLeft, ThumbsUp, Share2, MoreHorizontal } from 'lucide-react';

const MobileVideoApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const videoRef = useRef(null);

  // Extended video data for 20 videos (2 columns x 10 rows)
  const videos = [
    {
      id: 1,
      title: "เรียนรู้ React.js เบื้องต้น",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23a855f7'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EReact Tutorial%3C/text%3E%3C/svg%3E",
      duration: "15:30",
      views: "125K",
      uploadTime: "2 วันที่แล้ว",
      channel: "Dev Academy",
      category: "education",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      id: 2,
      title: "ท่องเที่ยวเชียงใหม่ 3 วัน 2 คืน",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%2306b6d4'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3ETravel Vlog%3C/text%3E%3C/svg%3E",
      duration: "22:15",
      views: "89K",
      uploadTime: "5 วันที่แล้ว",
      channel: "Travel Thailand",
      category: "travel",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      id: 3,
      title: "สูตรข้าวผัดกุ้งแสนอร่อย",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f59e0b'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3ECooking%3C/text%3E%3C/svg%3E",
      duration: "8:45",
      views: "156K",
      uploadTime: "1 สัปดาห์ที่แล้ว",
      channel: "Chef Master",
      category: "cooking",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
      id: 4,
      title: "เพลงป๊อปยุค 90 รวมเพราะ",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23ef4444'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EMusic%3C/text%3E%3C/svg%3E",
      duration: "45:20",
      views: "234K",
      uploadTime: "3 วันที่แล้ว",
      channel: "Music Vintage",
      category: "music",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
      id: 5,
      title: "ข่าวเด็ด วันนี้",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%2310b981'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3ENews%3C/text%3E%3C/svg%3E",
      duration: "12:30",
      views: "67K",
      uploadTime: "6 ชั่วโมงที่แล้ว",
      channel: "News Today",
      category: "news",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    {
      id: 6,
      title: "วิธีทำพิซซ่าหน้าหนา",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f97316'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EPizza Recipe%3C/text%3E%3C/svg%3E",
      duration: "18:45",
      views: "92K",
      uploadTime: "4 วันที่แล้ว",
      channel: "Cooking Pro",
      category: "cooking",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    },
    {
      id: 7,
      title: "JavaScript ES6 ใหม่ล่าสุด",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23eab308'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EJavaScript%3C/text%3E%3C/svg%3E",
      duration: "25:12",
      views: "178K",
      uploadTime: "1 วันที่แล้ว",
      channel: "Code Master",
      category: "education",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    },
    {
      id: 8,
      title: "ภูเก็ต 5 วัน 4 คืน",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%230891b2'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EPhuket Trip%3C/text%3E%3C/svg%3E",
      duration: "28:30",
      views: "145K",
      uploadTime: "3 วันที่แล้ว",
      channel: "Travel Guru",
      category: "travel",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    },
    {
      id: 9,
      title: "เพลงลูกทุ่งเก่าๆ ฟังเพลิน",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23dc2626'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3ECountry Music%3C/text%3E%3C/svg%3E",
      duration: "52:15",
      views: "312K",
      uploadTime: "2 วันที่แล้ว",
      channel: "Thai Music",
      category: "music",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
    },
    {
      id: 10,
      title: "สถานการณ์การเมืองล่าสุด",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23059669'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EPolitics News%3C/text%3E%3C/svg%3E",
      duration: "35:20",
      views: "87K",
      uploadTime: "8 ชั่วโมงที่แล้ว",
      channel: "Political Talk",
      category: "news",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
    },
    {
      id: 11,
      title: "ทำแกงเขียวหวานแบบดั้งเดิม",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%2316a34a'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EGreen Curry%3C/text%3E%3C/svg%3E",
      duration: "16:45",
      views: "203K",
      uploadTime: "6 วันที่แล้ว",
      channel: "Thai Kitchen",
      category: "cooking",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
    },
    {
      id: 12,
      title: "Python สำหรับผู้เริ่มต้น",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%233b82f6'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EPython%3C/text%3E%3C/svg%3E",
      duration: "42:30",
      views: "256K",
      uploadTime: "5 วันที่แล้ว",
      channel: "Programming Hub",
      category: "education",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      id: 13,
      title: "กรุงเทพ Street Food ต้องลอง",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f59e0b'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EStreet Food%3C/text%3E%3C/svg%3E",
      duration: "19:15",
      views: "189K",
      uploadTime: "2 วันที่แล้ว",
      channel: "Food Hunter",
      category: "cooking",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      id: 14,
      title: "เที่ยวญี่ปุ่น 7 วัน งบ 30,000",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23ec4899'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EJapan Trip%3C/text%3E%3C/svg%3E",
      duration: "38:45",
      views: "412K",
      uploadTime: "1 สัปดาห์ที่แล้ว",
      channel: "Budget Travel",
      category: "travel",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
      id: 15,
      title: "ข่าวกีฬาฟุตบอลล่าสุด",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%2322c55e'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3ESports News%3C/text%3E%3C/svg%3E",
      duration: "24:10",
      views: "95K",
      uploadTime: "4 ชั่วโมงที่แล้ว",
      channel: "Sports Today",
      category: "news",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
      id: 16,
      title: "เพลงสตริง คลาสสิค",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%236366f1'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EString Music%3C/text%3E%3C/svg%3E",
      duration: "63:25",
      views: "287K",
      uploadTime: "3 วันที่แล้ว",
      channel: "Classic Thai",
      category: "music",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    {
      id: 17,
      title: "Node.js และ Express Tutorial",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%2315803d'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3ENode.js%3C/text%3E%3C/svg%3E",
      duration: "55:30",
      views: "167K",
      uploadTime: "4 วันที่แล้ว",
      channel: "Web Dev Pro",
      category: "education",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    },
    {
      id: 18,
      title: "ขนมไทยโบราณ ทำง่ายๆ",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23a855f7'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EThai Dessert%3C/text%3E%3C/svg%3E",
      duration: "21:40",
      views: "134K",
      uploadTime: "5 วันที่แล้ว",
      channel: "Sweet Memories",
      category: "cooking",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    },
    {
      id: 19,
      title: "เกาหลี 10 วัน ไปคนเดียว",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23be185d'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3EKorea Solo%3C/text%3E%3C/svg%3E",
      duration: "47:20",
      views: "298K",
      uploadTime: "2 วันที่แล้ว",
      channel: "Solo Traveler",
      category: "travel",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    },
    {
      id: 20,
      title: "วิเคราะห์เศรษฐกิจไทย 2025",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23ea580c'/%3E%3Ctext x='160' y='95' font-family='Arial' font-size='12' fill='white' text-anchor='middle'%3EEconomy Analysis%3C/text%3E%3C/svg%3E",
      duration: "41:15",
      views: "76K",
      uploadTime: "1 วันที่แล้ว",
      channel: "Economy Watch",
      category: "news",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
    }
  ];

  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'trending', name: 'กำลังฮิต' },
    { id: 'education', name: 'การศึกษา' },
    { id: 'travel', name: 'ท่องเที่ยว' },
    { id: 'cooking', name: 'ทำอาหาร' },
    { id: 'music', name: 'ดนตรี' },
    { id: 'news', name: 'ข่าว' }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                           activeCategory === 'trending' || 
                           video.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Video player controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="min-h-screen bg-white">
      {selectedVideo ? (
        /* Video Player View */
        <div className="pb-4">
          {/* Video Player */}
          <div className="relative bg-black">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              src={selectedVideo.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div 
                className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button onClick={togglePlay} className="hover:bg-white/20 p-2 rounded-full">
                    {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button onClick={toggleMute} className="hover:bg-white/20 p-1 rounded-full">
                      {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 accent-red-500"
                    />
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Header with Back Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              onClick={() => setSelectedVideo(null)}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              กลับ
            </button>
          </div>
          
          {/* Video Info */}
          <div className="p-4">
            <h1 className="text-lg font-semibold text-gray-900 mb-2">{selectedVideo.title}</h1>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <span>{selectedVideo.views} ครั้ง</span>
                <span>•</span>
                <span>{selectedVideo.uploadTime}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-red-500">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">ถูกใจ</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">แชร์</span>
                </button>
                <button className="p-1 text-gray-700 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-semibold text-white">
                  {selectedVideo.channel.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{selectedVideo.channel}</h3>
                  <p className="text-gray-600 text-sm mt-1">สร้างเนื้อหาคุณภาพเพื่อผู้ชม</p>
                  <button className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    ติดตาม
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Videos */}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">วิดีโอที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-2 gap-3">
              {filteredVideos.filter(v => v.id !== selectedVideo.id).slice(0, 6).map(video => (
                <div 
                  key={video.id}
                  className="cursor-pointer"
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mt-2 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-600 text-xs mt-1">{video.channel}</p>
                  <div className="text-gray-500 text-xs">
                    <span>{video.views} ครั้ง</span>
                    <span className="mx-1">•</span>
                    <span>{video.uploadTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Home/Browse View */
        <div>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white">
                    V
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">VideoStream</h1>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="ค้นหาวิดีโอ..."
                  className="w-full bg-gray-100 text-gray-900 px-4 py-2.5 pl-10 rounded-full focus:outline-none focus:bg-gray-50 border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>

              {/* Category Pills */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                      activeCategory === category.id 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Video Grid - 2 columns, 10 rows */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredVideos.slice(0, 20).map(video => (
                <div 
                  key={video.id}
                  className="cursor-pointer"
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{video.title}</h3>
                    <p className="text-gray-600 text-xs mb-1">{video.channel}</p>
                    <div className="text-gray-500 text-xs">
                      <span>{video.views} ครั้ง</span>
                      <span className="mx-1">•</span>
                      <span>{video.uploadTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-400 mb-2">ไม่พบวิดีโอที่ค้นหา</h2>
                <p className="text-gray-500">ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่ที่ต่างกัน</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileVideoApp;