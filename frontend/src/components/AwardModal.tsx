import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, CheckCircle, Coins } from "lucide-react";
import { useSendAwardMutation } from "../redux/awardsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import { toast } from "react-toastify";
import { useGetCommentByIdQuery } from "../redux/commentsSlice";

interface Award {
  _id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
}

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  awards: Award[];
  commentId: string;
  receiverId: string;
}

const AwardModal: React.FC<AwardModalProps> = ({ isOpen, onClose, awards, commentId, receiverId }) => {
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [sendAward, { isLoading }] = useSendAwardMutation();
  const { data: user } = useGetUserQuery();
  const { data: comment } = useGetCommentByIdQuery(commentId); 
// const receiverId = comment?.userId;

const handleSendAward = async () => {

  if (!selectedAward) {
    console.error("Error: No award selected");
    toast.error("Please select an award!");
    return;
  }


  if (!receiverId) {
    console.error("Error: Receiver ID is missing");
    toast.error("Receiver not found!");
    return;
  }

 
  try {
    console.log("Sending request to sendAward API with data:", {
      awardId: selectedAward._id,
      commentId,
      receiverId,
    });

    await sendAward({ awardId: selectedAward._id, commentId, receiverId }).unwrap();

    console.log(`Success: Award "${selectedAward.name}" sent to receiver ${receiverId}`);
    toast.success(`You sent ${selectedAward.name} successfully!`);
    onClose();
  } catch (error: any) {
    console.error("Failed to send award:", error);
    toast.error(error.data?.message || "Failed to send award");
  }
};


  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Give an Award</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center bg-gray-100 p-3 rounded-md mb-4">
          <Coins className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="font-medium text-gray-700">Your balance: {user?.wallet || 0} coins</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {awards.map((award) => (
            <button
              key={award._id}
              className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                selectedAward?._id === award._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedAward(award)}
            >
              <span>{award.icon}</span>
              <span className="text-sm font-medium">{award.name}</span>
              <span className="text-xs text-gray-500">{award.price} coins</span>
              {selectedAward?._id === award._id && <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />}
            </button>
          ))}
        </div>

       <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSendAward}
            disabled={!selectedAward || isLoading}
            className={`w-full py-2 rounded-md transition ${
              selectedAward
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Sending..." : "Give Award"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AwardModal;
