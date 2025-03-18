import { useState } from "react";
import ChatModal from "./ChatModal";
import { X, MessageCircle, Loader2 } from "lucide-react";
import { useGetFriendsQuery } from "../redux/friendsSlice";
import Loader from "../assets/loader-ui/Loader";

const MessageModal = ({ onClose }: { onClose: () => void }) => {
  const { data: friends, isLoading, error } = useGetFriendsQuery();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-xl transform animate-in fade-in duration-200 w-11/12 max-w-sm">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <p className="text-gray-700 font-medium">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <Loader />;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 md:inset-auto md:right-4 md:top-16 w-full md:w-[380px] lg:w-[480px] 
                    transform transition-all duration-300 ease-in-out animate-in slide-in-from-right">
        <div className="h-full md:h-auto bg-white rounded-none md:rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header - more responsive padding */}
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <button 
              onClick={onClose} 
              className="absolute right-3 sm:right-4 top-3 sm:top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Messages
            </h2>
          </div>

          {/* Content - adjust max height for different devices */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[60vh] lg:max-h-[600px]">
            {friends && friends.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="group hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <div className="p-3 sm:p-4 md:p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                          <img
                            src={friend.avatar || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"}
                            alt={`${friend.username}'s avatar`}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{friend.username}</h3>
                          <p className="text-xs sm:text-sm text-gray-500">Last active recently</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedChat(friend._id)}
                        className="p-2 sm:p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 
                                 transition-all duration-200 group-hover:scale-105"
                        aria-label={`Message ${friend.username}`}
                      >
                        <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  Add some friends to start messaging and connecting with people.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedChat && (
        <div className="z-50">
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