export const filterVideos = (videos, searchQuery, activeCategory) => {
  return videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                           activeCategory === 'trending' || 
                           video.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
};

export const getRelatedVideos = (videos, currentVideo) => {
  return videos.filter(video => 
    video.id !== currentVideo.id && 
    (video.category === currentVideo.category || 
     video.channel === currentVideo.channel)
  );
};