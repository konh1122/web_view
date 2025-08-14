import React from 'react';

const VideoGrid = ({ videos, onVideoSelect, isRelated = false }) => {
  const displayVideos = isRelated ? videos.slice(0, 6) : videos.slice(0, 20);

  return (
    <div className="p-4">
      {isRelated && (
        <h2 className="text-lg font-semibold text-gray-900 mb-4">วิดีโอที่เกี่ยวข้อง</h2>
      )}
      <div className="grid grid-cols-2 gap-3">
        {displayVideos.map(video => (
          <div 
            key={video.id}
            className="cursor-pointer"
            onClick={() => onVideoSelect(video)}
          >
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full aspect-video object-cover rounded-lg"
              />
              <div className={`absolute ${isRelated ? 'bottom-1 right-1' : 'bottom-2 right-2'} bg-black/80 text-white text-xs px-${isRelated ? '1.5' : '2'} py-${isRelated ? '0.5' : '1'} rounded`}>
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

      {!isRelated && videos.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">ไม่พบวิดีโอที่ค้นหา</h2>
          <p className="text-gray-500">ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่ที่ต่างกัน</p>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;