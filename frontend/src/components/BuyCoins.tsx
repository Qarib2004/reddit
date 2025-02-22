import { useState } from "react";
import { useCreatePaymentMutation } from "../redux/apiSlice";
import { toast } from "react-toastify";

const BuyCoins = () => {
  const [amount, setAmount] = useState(10);
  const [createPayment] = useCreatePaymentMutation();

  const handleBuy = async () => {
    try {
      const { approvalUrl } = await createPayment({ amount }).unwrap();
      window.location.href = approvalUrl;
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Buy Coins</h2>
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border p-2 rounded w-full"/>
      <button onClick={handleBuy} className="bg-blue-500 text-white px-4 py-2 rounded mt-3">
        Buy with PayPal
      </button>
    </div>
  );
};

export default BuyCoins;
