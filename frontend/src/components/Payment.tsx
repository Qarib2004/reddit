import { useState } from "react";
import { useCreatePaymentMutation } from "../redux/apiSlice";
import { toast } from "react-toastify";

const Payment = () => {
  const [amount, setAmount] = useState(5);
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handlePayment = async () => {
    try {
      const response = await createPayment({ amount }).unwrap();
      if (response.approvalUrl) {
        window.location.href = response.approvalUrl; 
      } else {
        toast.error("Failed to create PayPal payment.");
      }
    } catch (error) {
      toast.error("Payment error. Try again later.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-3">Buy Coins</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 rounded w-full mb-3"
        placeholder="Enter amount"
      />

      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay with PayPal"}
      </button>
    </div>
  );
};

export default Payment;
