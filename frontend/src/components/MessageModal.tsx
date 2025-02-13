import { useState } from "react";
import ChatModal from "./ChatModal";
import { X, MessageCircle, Loader2 } from "lucide-react";
import { useGetFriendsQuery } from "../redux/friendsSlice";

const MessageModal = ({ onClose }: { onClose: () => void }) => {
  const { data: friends, isLoading, error } = useGetFriendsQuery();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
        <div className="bg-white p-6 rounded-xl shadow-2xl transform animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <p className="text-gray-700 font-medium">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Friends</h3>
            <p className="text-gray-600">Unable to load your conversations. Please try again later.</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-y-0 right-0 sm:inset-auto sm:right-4 sm:top-16 w-full sm:w-[420px] lg:w-[480px] 
                    transform transition-all duration-300 ease-in-out animate-in slide-in-from-right">
        <div className="h-full sm:h-auto bg-white rounded-none sm:rounded-xl shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Messages
            </h2>
          </div>

          <div className="max-h-[calc(100vh-6rem)] sm:max-h-[600px] overflow-y-auto">
            {friends && friends.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="group hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <div className="p-4 sm:p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={friend.avatar || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"}
                            alt={`${friend.username}'s avatar`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{friend.username}</h3>
                          <p className="text-sm text-gray-500">Last active recently</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedChat(friend._id)}
                        className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 
                                 transition-all duration-200 group-hover:scale-105"
                      >
                        <MessageCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                <p className="text-gray-500 text-center max-w-sm">
                  Add some friends to start messaging and connecting with people.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedChat && (
        <div>
          <ChatModal 
            recipientId={selectedChat} 
            onClose={() => setSelectedChat(null)}
          />
        </div>
      )}

    </>
  );
};

export default MessageModal;