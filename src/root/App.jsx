import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer.jsx';
import VideoInfo from '../components/VideoInfo.jsx';
import VideoGrid from '../components/VideoGrid.jsx';
import Header from '../components/Header.jsx';
import { useVideoPlayer } from '../hooks/useVideoPlayer.js';
import { filterVideos, getRelatedVideos } from '../utils/videoFilters.js';
import { videos, categories } from '../data/videoData.js'; // Assuming you have a videoData.js file with videos and categories

const MobileVideoApp = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const videoPlayerHook = useVideoPlayer();

  const filteredVideos = filterVideos(videos, searchQuery, activeCategory);
  const relatedVideos = selectedVideo ? getRelatedVideos(videos, selectedVideo) : [];

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    videoPlayerHook.resetPlayer();
  };

  const handleBackToHome = () => {
    setSelectedVideo(null);
    videoPlayerHook.resetPlayer();
  };

  return (
    <div className="min-h-screen bg-white">
      {selectedVideo ? (
        /* Video Player View */
        <div className="pb-4">
          {/* Video Player */}
          <VideoPlayer
            {...videoPlayerHook}
            selectedVideo={selectedVideo}
            onTogglePlay={videoPlayerHook.togglePlay}
            onToggleMute={videoPlayerHook.toggleMute}
            onVolumeChange={videoPlayerHook.handleVolumeChange}
            onSeek={videoPlayerHook.handleSeek}
            onTimeUpdate={videoPlayerHook.handleTimeUpdate}
            onLoadedMetadata={videoPlayerHook.handleLoadedMetadata}
            formatTime={videoPlayerHook.formatTime}
          />
          
          {/* Header with Back Button */}
          <Header
            showBackButton={true}
            onBackClick={handleBackToHome}
          />
          
          {/* Video Info */}
          <VideoInfo selectedVideo={selectedVideo} />
          
          {/* Related Videos */}
          <VideoGrid 
            videos={relatedVideos}
            onVideoSelect={handleVideoSelect}
            isRelated={true}
          />
        </div>
      ) : (
        /* Home/Browse View */
        <div>
          {/* Header */}
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
          />

          {/* Video Grid */}
          <VideoGrid 
            videos={filteredVideos}
            onVideoSelect={handleVideoSelect}
          />
        </div>
      )}
    </div>
  );
};

export default MobileVideoApp;