import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useVideoStore } from '../store/videoStore';
import { Upload } from 'lucide-react';

const UploadPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addVideo } = useVideoStore();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoType, setVideoType] = useState<'short-form' | 'long-form'>('short-form');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (!file.type.includes('video/')) {
        setError('Please upload a valid video file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setVideoFile(file);
      setError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      setError('Please enter a title');
      return;
    }
    
    if (videoType === 'short-form' && !videoFile) {
      setError('Please upload a video file');
      return;
    }
    
    if (videoType === 'long-form' && !videoUrl) {
      setError('Please enter a video URL');
      return;
    }
    
    try {
      setLoading(true);
      
      let finalVideoUrl = '';
      if (videoType === 'short-form' && videoFile) {
        finalVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-spinning-around-the-earth-29351-large.mp4';
      } else {
        finalVideoUrl = videoUrl;
      }
      
      const finalThumbnailUrl = thumbnailUrl || 'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      
      await addVideo({
        title, description, type: videoType, url: finalVideoUrl,
        price: videoType === 'long-form' ? price : 0,
        creatorId: user?.id || '', creatorName: user?.username || '', thumbnailUrl: finalThumbnailUrl
      });
      
      navigate('/');
    } catch (err) {
      console.error('Error uploading video:', err);
      setError('An error occurred while uploading the video');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Video</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter video title"/>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="description"
                    rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter video description"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Video Type</label>
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio h-4 w-4 text-purple-600" checked={videoType === 'short-form'} onChange={() => setVideoType('short-form')}/>
                      <span className="ml-2">Short-Form</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio h-4 w-4 text-purple-600" checked={videoType === 'long-form'} onChange={() => setVideoType('long-form')}/>
                      <span className="ml-2">Long-Form</span>
                    </label>
                  </div>
                </div>
                
                {videoType === 'short-form' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Video (Max 10MB) </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange}/>
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">MP4, WebM, Ogg up to 10MB</p>
                        {videoFile && (
                          <p className="text-sm text-green-600">Selected: {videoFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="video-url" className="block text-sm font-medium text-gray-700">Video URL</label>
                      <input type="text" id="video-url" value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Enter YouTube or Vimeo URL"/>
                      <p className="mt-1 text-xs text-gray-500">For demo purposes, you can enter any URL. In a real app, this would be validated.</p>
                    </div>
                    
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                      <input
                        type="number" id="price" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="0 for free, or enter price"/>
                    </div>
                  </>
                )}
                
                <div>
                  <label htmlFor="thumbnail-url" className="block text-sm font-medium text-gray-700">Thumbnail URL (Optional)</label>
                  <input
                    type="text" id="thumbnail-url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter thumbnail image URL"/>
                  <p className="mt-1 text-xs text-gray-500">If left blank, a default thumbnail will be used</p>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit" disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Video'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;