import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
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
  const [isMinimized, setIsMinimized] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl z-50">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={modalRef}
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 ${
        isMinimized ? 'w-64' : 'w-96'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" />
      
      <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
        <div className="relative">
          <img
            src={recipient?.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${recipient?.username}`}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
          <div 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg text-gray-900 truncate">
            {recipient?.username || "Unknown User"}
          </h2>
          <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            <span className="block w-4 h-0.5 bg-gray-500" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div 
            ref={chatBoxRef} 
            className="p-4 overflow-y-auto space-y-3"
            style={{ height: '400px' }}
          >
            {messages.map((msg, index) => (
              <div 
                key={msg._id || index} 
                className={`flex ${msg.senderId === currentUser?._id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${
                    msg.senderId === currentUser?._id 
                      ? "bg-orange-500 text-white" 
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  {msg.createdAt && (
                    <div className={`text-xs mt-1 ${
                      msg.senderId === currentUser?._id ? "text-orange-100" : "text-gray-500"
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                disabled={!isConnected}
                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              <button 
                onClick={sendMessage}
                disabled={!isConnected || !newMessage.trim()}
                className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatModal;