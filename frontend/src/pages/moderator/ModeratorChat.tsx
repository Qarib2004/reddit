import { useState } from "react";
import { useGetModeratorChatQuery, useSendMessageMutation } from "../../redux/moderatorSlice";

const ModeratorChat = () => {
  const { data: messages, isLoading } = useGetModeratorChatQuery();
  const [sendMessage] = useSendMessageMutation();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim() === "") return;
    await sendMessage({ text: message }).unwrap();
    setMessage("");
  };

  if (isLoading) return <p>Loading chat...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Moderator Chat</h2>
      <div className="border p-4 h-64 overflow-y-auto">
        {messages?.map((msg) => (
          <p key={msg._id}><b>{msg.senderUsername}</b>: {msg.message}</p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ModeratorChat;
