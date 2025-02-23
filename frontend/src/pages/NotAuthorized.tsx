import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

interface NotAuthorizedProps {
  role: 'moderator' | 'admin';
}

const NotAuthorized: React.FC<NotAuthorizedProps> = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#DAE0E6] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-[#FF4500] p-8 flex items-center justify-center">
            <ShieldAlert className="w-32 h-32 text-white animate-float" />
          </div>
          
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              {role === 'admin' 
                ? "This area is restricted to administrators only. You don't have the required permissions to access this page."
                : "This area is for moderators only. You don't have the required permissions to access this page."}
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 bg-[#FF4500] text-white px-6 py-3 rounded-full hover:bg-[#FF5722] transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                Return Home
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;