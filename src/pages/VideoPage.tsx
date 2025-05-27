import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useVideoStore } from '../store/videoStore';
import { Video, Comment } from '../types';
import { Heart, DollarSign, MessageCircle, Gift } from 'lucide-react';

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateWalletBalance } = useAuthStore();
  const { videos, getCommentsByVideoId, addComment, purchaseVideo, hasPurchased,giftCreator} = useVideoStore();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [giftAmount, setGiftAmount] = useState<number | null>(null);
  const [giftLoading, setGiftLoading] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [error, setError] = useState('');
  
  const isPurchased = user && video ? hasPurchased(user.id, video.id) : false;
  const canWatch = video?.price === 0 || isPurchased;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!id) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const foundVideo = videos.find(v => v.id === id);
        if (!foundVideo) {
          navigate('/');
          return;
        }
        
        setVideo(foundVideo);
        
        const videoComments = await getCommentsByVideoId(id);
        setComments(videoComments);
      } catch (err) {
        console.error('Error fetching video data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, videos, isAuthenticated, navigate, getCommentsByVideoId]);
  
  const handlePurchase = async () => {
    if (!user || !video) return;
    
    try {
      setPurchaseLoading(true);
      setError('');
      
      if (user.walletBalance < video.price) {
        setError('Insufficient balance in your wallet');
        return;
      }
      
      const success = await purchaseVideo(user.id, video.id, video.price);
      
      if (success) {
        const newBalance = user.walletBalance - video.price;
        updateWalletBalance(newBalance);
      }
    } catch (err) {
      console.error('Error purchasing video:', err);
      setError('An error occurred while processing your purchase');
    } finally {
      setPurchaseLoading(false);
    }
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !video || !commentText.trim()) return;
    
    try {
      setCommentLoading(true);
      
      const newComment = await addComment( video.id, user.id, user.username, commentText);
      
      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };
  
  const handleGift = async () => {
    if (!user || !video || !giftAmount) return;
    
    try {
      setGiftLoading(true);
      setError('');
      if (user.walletBalance < giftAmount) {
        setError('Insufficient balance in your wallet');
        return;
      }
      const success = await giftCreator( user.id, video.creatorId, video.id, giftAmount);
      
      if (success) {
        const newBalance = user.walletBalance - giftAmount;
        updateWalletBalance(newBalance);
        setShowGiftModal(false);
      }
    } catch (err) {
      console.error('Error gifting creator:', err);
      setError('An error occurred while processing your gift');
    } finally {
      setGiftLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!video) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Video not found</h2>
          <button onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Back to Home </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            {canWatch ? (
              video.type === 'short-form' ? (
                <video src={video.url} className="w-full aspect-[9/16] max-h-[80vh] mx-auto bg-black" controls autoPlay loop playsInline/>
              ) : (
                <div className="w-full aspect-video">
                  <iframe src={video.url} className="w-full h-full" allowFullScreen title={video.title}/>
                </div>
              )
            ) : (
              <div className="w-full aspect-video bg-gray-900 flex flex-col items-center justify-center text-white">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-30"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <DollarSign className="h-16 w-16 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Premium Content</h3>
                  <p className="text-lg mb-6">Purchase this video for ₹{video.price}</p>
                  <button onClick={handlePurchase} disabled={purchaseLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {purchaseLoading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>Buy for ₹{video.price}</>
                    )}
                  </button>
                  {error && (
                    <p className="mt-4 text-red-400">{error}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
                <p className="text-gray-600">@{video.creatorName}</p>
              </div>
              
              {canWatch && (
                <div className="flex space-x-4">
                  <button className="flex items-center text-gray-600 hover:text-red-500">
                    <Heart className="h-6 w-6 mr-1" />
                    <span>Like</span>
                  </button>
                  
                  <button onClick={() => setShowGiftModal(true)} className="flex items-center text-gray-600 hover:text-purple-500">
                    <Gift className="h-6 w-6 mr-1" />
                    <span>Gift</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-gray-700">
              <p>{video.description}</p>
            </div>
            {canWatch && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" /> Comments</h3>
                
                <form onSubmit={handleAddComment} className="mt-4">
                  <div className="flex">
                    <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                    <button type="submit" disabled={!commentText.trim() || commentLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                      {commentLoading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Post'
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-6 space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">@{comment.username}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Gift to @{video.creatorName}</h3>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <p className="mb-4">Select an amount to gift:</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[10, 50, 100, 200, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setGiftAmount(amount)}
                  className={`py-2 px-4 rounded-md ${
                    giftAmount === amount
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowGiftModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Cancel </button>
              <button
                onClick={handleGift}
                disabled={!giftAmount || giftLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {giftLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>Send Gift</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;