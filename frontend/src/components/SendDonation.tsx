import { useState } from "react";
import { useSendDonationMutation, useGetUsersQuery } from "../redux/apiSlice";
import { toast } from "react-toastify";

const SendDonation = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(10);
  const { data: users, isLoading } = useGetUsersQuery();
  const [sendDonation] = useSendDonationMutation();

  const handleSend = async () => {
    if (!recipient || amount <= 0) {
      toast.error("Invalid recipient or amount");
      return;
    }

    try {
      await sendDonation({ recipientId: recipient, amount }).unwrap();
      toast.success(`Successfully sent ${amount} coins!`);
      setAmount(10);
      setRecipient("");
    } catch (error:any) {
      toast.error(error.data?.message || "Failed to send donation");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-3">Send Donation</h2>

      <select
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="">Select recipient</option>
        {isLoading ? (
          <option>Loading users...</option>
        ) : (
          users?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username} ({user.coins} coins)
            </option>
          ))
        )}
      </select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 rounded w-full mb-3"
        placeholder="Enter amount"
      />

      <button
        onClick={handleSend}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Send Coins
      </button>
    </div>
  );
};

export default SendDonation;
