import React from 'react';
import { ThumbsUp, Share2, MoreHorizontal } from 'lucide-react';

const VideoInfo = ({ selectedVideo }) => {
  return (
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
  );
};

export default VideoInfo;