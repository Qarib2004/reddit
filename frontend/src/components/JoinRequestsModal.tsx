import React from 'react';
import { Check, X } from 'lucide-react';

interface JoinRequest {
  userId: string;
  username: string;
}

interface JoinRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: JoinRequest[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

const JoinRequestsModal: React.FC<JoinRequestsModalProps> = ({ 
  isOpen, 
  onClose, 
  requests, 
  onApprove, 
  onReject 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Join Requests</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {requests.length > 0 ? (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {requests.map((request: JoinRequest) => (
              <li 
                key={request.userId} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <span className="font-medium">{request.username}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onApprove(request.userId)}
                    className="p-1 rounded-full text-green-500 hover:bg-green-50 transition-colors"
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    onClick={() => onReject(request.userId)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No pending requests</p>
        )}
      </div>
    </div>
  );
};

export default JoinRequestsModal;