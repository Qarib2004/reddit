import { useState } from "react";
import { useGetUserQuery } from "../redux/apiSlice";
import ChatModal from "./ChatModal";
import { X, MessageCircle } from "lucide-react";

const MessageModal = ({ onClose }: { onClose: () => void }) => {
  const { data: user } = useGetUserQuery();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-4 rounded-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed  flex  bg-black/50 z-50
     right-4 top-16 w-full max-w-sm transform rounded-lg shadow-xl bg-white transition-all sm:right-8 md:max-w-md
    ">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full overflow-hidden relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>

        <div className="p-4 border-b flex items-center gap-3">
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto">
          {user.friends && user.friends.length > 0 ? (
            user.friends.map((friend: { _id: string; username: string; avatar?: string }) => (
              <div
                key={friend._id}
                className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={friend.avatar || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"}
                    alt="Friend Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-sm font-medium">{friend.username}</span>
                </div>
                <button
                  onClick={() => setSelectedChat(friend._id)}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-4">No friends yet.</div>
          )}
        </div>
      </div>

      {selectedChat && <ChatModal recipientId={selectedChat} onClose={() => setSelectedChat(null)} />}
    </div>
  );
};

export default MessageModal;
