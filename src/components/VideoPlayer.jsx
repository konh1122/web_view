import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = ({ 
  videoRef, 
  selectedVideo, 
  isPlaying, 
  isMuted, 
  volume, 
  currentTime, 
  duration,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onTimeUpdate,
  onLoadedMetadata,
  formatTime
}) => {
  return (
    <div className="relative bg-black">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        src={selectedVideo.videoUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => {}}
        onPause={() => {}}
      />
      
      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress Bar */}
        <div 
          className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4"
          onClick={onSeek}
        >
          <div 
            className="h-full bg-red-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onTogglePlay} className="hover:bg-white/20 p-2 rounded-full">
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <button onClick={onToggleMute} className="hover:bg-white/20 p-1 rounded-full">
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={onVolumeChange}
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
  );
};

export default VideoPlayer;