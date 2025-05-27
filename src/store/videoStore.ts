import { create } from 'zustand';
import { Video, Comment, Purchase, Gift } from '../types';

interface VideoState {
  videos: Video[]; comments: Comment[]; purchases: Purchase[]; gifts: Gift[];
  
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => Promise<Video>;
  getVideos: () => Promise<Video[]>;
  
  addComment: (videoId: string, userId: string, username: string, text: string) => Promise<Comment>;
  getCommentsByVideoId: (videoId: string) => Promise<Comment[]>;

  purchaseVideo: (userId: string, videoId: string, amount: number) => Promise<boolean>;
  hasPurchased: (userId: string, videoId: string) => boolean;
  
  giftCreator: (fromUserId: string, toUserId: string, videoId: string, amount: number) => Promise<boolean>;
}

const sampleVideos: Video[] = [
  {
    id: '1', title: 'Amazing Sunset Timelapse',
    description: 'Watch this beautiful sunset over the ocean',
    type: 'short-form',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-1080p-1166-large.mp4',
    price: 0, creatorId: '2', creatorName: 'NatureFilms',
    createdAt: new Date(Date.now() - 86400000),
    thumbnailUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2', title: 'Mountain Climbing Documentary',
    description: 'Follow our journey to the top of Mount Everest',
    type: 'long-form',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    price: 29, creatorId: '3', creatorName: 'AdventureTime',
    createdAt: new Date(Date.now() - 172800000),
    thumbnailUrl: 'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3', title: 'Quick Cooking Tips',
    description: 'Learn how to chop vegetables like a pro',
    type: 'short-form',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-with-a-pan-on-a-stove-2436-large.mp4',
    price: 0, creatorId: '4', creatorName: 'ChefMaster',
    createdAt: new Date(Date.now() - 259200000), 
    thumbnailUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '4', title: 'Full Yoga Session',
    description: 'Complete 1-hour yoga session for beginners',
    type: 'long-form',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    price: 49, creatorId: '5', creatorName: 'YogaLife',
    createdAt: new Date(Date.now() - 345600000), 
    thumbnailUrl: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [...sampleVideos], comments: [], purchases: [], gifts: [],
  
  addVideo: async (videoData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newVideo: Video = {
      ...videoData,
      id: (get().videos.length + 1).toString(),
      createdAt: new Date()
    };
    
    set(state => ({ videos: [newVideo, ...state.videos] }));
    return newVideo;
  },
  
  getVideos: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return get().videos;
  },
  
  addComment: async (videoId, userId, username, text) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      videoId, userId, username, text,
      createdAt: new Date()
    };
    
    set(state => ({ comments: [newComment, ...state.comments] }));
    return newComment;
  },
  
  getCommentsByVideoId: async (videoId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return get().comments
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  purchaseVideo: async (userId, videoId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const purchase: Purchase = {
      id: Math.random().toString(36).substring(2, 9),
      userId, videoId, amount,
      createdAt: new Date()
    };
    
    set(state => ({ purchases: [...state.purchases, purchase] }));
    return true;
  },
  
  hasPurchased: (userId, videoId) => {
    return get().purchases.some(p => p.userId === userId && p.videoId === videoId);
  },
  
  giftCreator: async (fromUserId, toUserId, videoId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gift: Gift = {
      id: Math.random().toString(36).substring(2, 9),
      fromUserId, toUserId, videoId, amount,
      createdAt: new Date()
    };
    
    set(state => ({ gifts: [...state.gifts, gift] }));
    return true;
  }
}));