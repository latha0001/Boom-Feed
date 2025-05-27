import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Upload, User, Wallet } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">BOOM</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center bg-purple-700 px-3 py-1 rounded-full">
                  <Wallet size={16} className="mr-1" />
                  <span>₹{user?.walletBalance}</span>
                </div>
                
                <Link  to="/upload"  className="flex items-center hover:bg-purple-700 px-3 py-1 rounded-full transition">
                  <Upload size={16} className="mr-1" />
                  <span>Upload</span>
                </Link>
                
                <div className="flex items-center hover:bg-purple-700 px-3 py-1 rounded-full transition cursor-pointer">
                  <User size={16} className="mr-1" />
                  <span>{user?.username}</span>
                </div>
                
                <button onClick={handleLogout} className="flex items-center hover:bg-purple-700 px-3 py-1 rounded-full transition">
                  <LogOut size={16} className="mr-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link  to="/login"  className="hover:bg-purple-700 px-3 py-1 rounded-full transition"> Login </Link>
                <Link to="/register" className="bg-white text-purple-600 hover:bg-gray-100 px-3 py-1 rounded-full transition">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;