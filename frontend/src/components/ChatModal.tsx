import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { useGetUserByIdQuery, useGetUserQuery } from "../redux/apiSlice";
import socket from "../utils/socket";

interface Message {
  _id?: string;
  senderId: string;
  recipientId: string;
  message: string;
  createdAt?: string;
}

const ChatModal = ({ recipientId, onClose }: { recipientId: string; onClose: () => void }) => {
  const { data: recipient, isLoading: recipientLoading } = useGetUserByIdQuery(recipientId);
  const { data: currentUser } = useGetUserQuery();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!recipientId || !currentUser?._id) return;

    
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setIsConnected(true);
     
      socket.emit("joinChat", { userId: currentUser._id, recipientId });
      socket.emit("requestChatHistory", { userId: currentUser._id, recipientId });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
     
    };

    const handleChatHistory = (chatHistory: Message[]) => {
      
      setMessages(chatHistory);
    };

    const handleReceiveMessage = (message: Message) => {
     
      setMessages(prev => {
        
        const messageExists = prev.some(msg => 
          msg._id === message._id || 
          (msg.senderId === message.senderId && 
           msg.message === message.message && 
           msg.createdAt === message.createdAt)
        );
        if (messageExists) return prev;
        return [...prev, message];
      });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('chatHistory', handleChatHistory);
    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('chatHistory', handleChatHistory);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.disconnect();
    };
  }, [recipientId, currentUser]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !currentUser?._id || !recipientId || !isConnected) return;

    const messageData = {
      senderId: currentUser._id,
      recipientId,
      message: newMessage.trim(),
    };

   
    socket.emit("sendMessage", messageData);
    
    
    setMessages(prev => [...prev, { ...messageData, createdAt: new Date().toISOString() }]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (recipientLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-4 rounded-lg">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="p-4 border-b flex items-center gap-3">
          <img
            src={recipient?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${recipient?.username}`}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-lg">{recipient?.username || "Unknown User"}</h2>
            <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div ref={chatBoxRef} className="p-4 h-64 overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div 
              key={msg._id || index} 
              className={`flex ${msg.senderId === currentUser?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] break-words ${
                  msg.senderId === currentUser?._id 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200"
                }`}
              >
                {msg.message}
                {msg.createdAt && (
                  <div className={`text-xs mt-1 ${
                    msg.senderId === currentUser?._id ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4 flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button 
            onClick={sendMessage}
            disabled={!isConnected || !newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;