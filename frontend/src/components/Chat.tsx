import { useState, useEffect } from "react";
import socket from "../utils/socket";
import { useGetUserQuery } from "../redux/apiSlice";

const Chat = () => {
  const { data: user } = useGetUserQuery();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [receiverId, setReceiverId] = useState("");

  useEffect(() => {
    socket.on("receive-message", ({ senderId, message }) => {
      setMessages((prev) => [...prev, { senderId, message }]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && receiverId) {
      socket.emit("send-message", {
        senderId: user?._id,
        receiverId,
        message,
      });
      setMessages((prev:any) => [...prev, { senderId: user?._id, message }]);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Chat</h2>

    
      <input
        type="text"
        placeholder="Enter receiver ID..."
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        className="border p-2 rounded w-full mt-2"
      />

      
      <div className="mt-4 border p-2 rounded h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 rounded ${msg.senderId === user?._id ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black"}`}>
            {msg.message}
          </div>
        ))}
      </div>

     
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1 rounded-l"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
