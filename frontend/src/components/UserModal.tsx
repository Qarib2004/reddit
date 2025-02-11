import { useEffect, useRef, useState } from "react";
import {
  useGetUserByIdQuery,
  useSendFriendRequestMutation,
} from "../redux/apiSlice";
import { 
  MessageCircle, 
  UserPlus, 
  X, 
  Calendar,
  Trophy,
  Users,
  Star,
  Mail,
  Link2
} from "lucide-react";
import ChatModal from "./ChatModal";

const UserModal = ({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  const [sendFriendRequest, { isLoading: isSending }] =
    useSendFriendRequestMutation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest({ userId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-2">User not found</div>
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden relative"
      >
       
        <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

       
        <div className="px-8 pb-6">
         
          <div className="relative -mt-16 mb-4">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`
              }
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
           
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <div className="mt-2 flex items-center gap-2 text-gray-600">
                <Trophy size={16} className="text-orange-500" />
                <span>{user.karma} karma</span>
                <span className="mx-2">•</span>
                <Calendar size={16} />
                <span>
                  Redditor since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

             
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={18} />
                    <span className="font-medium">{user.friends?.length || 0}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Friends</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star size={18} className="text-yellow-500" />
                    <span className="font-medium">{user.karma}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Post Karma</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle size={18} className="text-blue-500" />
                    <span className="font-medium">{user.karma}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Comment Karma</p>
                </div>
              </div>
            </div>

           
            <div className="flex flex-col gap-3 min-w-[200px]">
              <button
                onClick={handleSendRequest}
                disabled={isSending}
                className="w-full bg-orange-500 text-white py-2.5 px-4 rounded-full font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                {isSending ? "Sending..." : "Add Friend"}
              </button>
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-gray-100 text-gray-800 py-2.5 px-4 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Send Message
              </button>
              <a
                href={`/user/${user.username}`}
                className="w-full bg-gray-100 text-gray-800 py-2.5 px-4 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Link2 size={18} />
                View Full Profile
              </a>
            </div>
          </div>
        </div>

        {isChatOpen && (
          <ChatModal
            recipientId={user._id}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UserModal;