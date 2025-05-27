import React from 'react';
import { Play, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { useAuthStore } from '../store/authStore';
import { useVideoStore } from '../store/videoStore';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { user } = useAuthStore();
  const { hasPurchased } = useVideoStore();
  
  const isPurchased = user ? hasPurchased(user.id, video.id) : false;
  const canWatch = video.price === 0 || isPurchased;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      {video.type === 'short-form' ? (
        <Link to={`/video/${video.id}`} className="block relative aspect-[9/16] w-full">
          <video src={video.url} className="w-full h-full object-cover" poster={video.thumbnailUrl} muted loop playsInline
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div>
              <h3 className="text-white font-bold truncate">{video.title}</h3>
              <p className="text-gray-300 text-sm">@{video.creatorName}</p>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex flex-col">
          <Link to={`/video/${video.id}`} className="block relative aspect-video w-full">
            <img  src={video.thumbnailUrl}  alt={video.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              {canWatch ? (
                <div className="bg-white/90 rounded-full p-3">
                  <Play className="h-8 w-8 text-purple-600 fill-purple-600" />
                </div>
              ) : (
                <div className="bg-purple-600/90 text-white rounded-full px-4 py-2 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="font-bold">Buy for ₹{video.price}</span>
                </div>
              )}
            </div>
          </Link>
          <div className="p-4">
            <h3 className="font-bold text-lg truncate">{video.title}</h3>
            <p className="text-gray-600 text-sm">@{video.creatorName}</p>
            {video.price > 0 && (
              <div className="mt-2 text-purple-600 font-semibold">
                {canWatch ? 'Purchased' : `₹${video.price}`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;