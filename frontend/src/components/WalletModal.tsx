import { useState } from "react";
import { useCreatePaymentMutation } from "../redux/WalletSlice";

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState(10);
    const [createPayment] = useCreatePaymentMutation();
  
    const handlePayment = async () => {
      const { data } = await createPayment(amount);
      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-lg font-bold">Fill the balance</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border rounded-md mt-2"
          />
          <button onClick={handlePayment} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
           Pay through PayPal
          </button>
          <button onClick={onClose} className="mt-2 text-gray-500">Закрыть</button>
        </div>
      </div>
    );
  };
  

export default WalletModal;
