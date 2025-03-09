import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { toast } from "react-toastify";


interface VerificationProps {
  onSuccess?: () => void; 
}

const Verification: React.FC<VerificationProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState<string>("");
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [sentCode, setSentCode] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [maskedEmail, setMaskedEmail] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleSendVerificationCode = async (): Promise<void> => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setVerifying(true);
      const response = await fetch("http://localhost:5000/api/payments/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ amount }),
      });
      

      const data = await response.json();
      if (response.ok) {
        setSentCode(data.code);
        setShowVerification(true);
        toast.success("Verification code sent to your email");
      } else {
        toast.error(data.message || "Failed to send verification code");
      }
    } catch (error) {
      toast.error("Error sending verification code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleVerify = async (): Promise<void> => {
    const enteredCode = verificationCode.join("");
  
    if (enteredCode.length !== 6) {
      toast.error("Please enter the complete verification code");
      return;
    }
  
    // Debugging: Log the request body to see what's being sent
    console.log("Request body:", { code: enteredCode, amount });
  
    try {
      const response = await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: enteredCode, amount }),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Balance successfully topped up!");
        setShowVerification(false);
        setAmount("");
      } else {
        toast.error("Invalid verification code");
      }
    } catch (error) {
      toast.error("Error verifying code. Please try again.");
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {!showVerification ? (
        <>
          <h2 className="text-xl font-bold mb-4">Top Up Balance</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleSendVerificationCode}
            disabled={verifying}
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
          >
            {verifying ? "Processing..." : "Send Code"}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Enter Verification Code</h2>
          <p className="text-gray-600">Code sent to {maskedEmail}</p>
          <div className="flex justify-center space-x-2 my-4">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const newVerificationCode = [...verificationCode];
                  newVerificationCode[index] = e.target.value;
                  setVerificationCode(newVerificationCode);
                }}
                className="w-12 h-14 border text-center text-xl"
              />
            ))}
          </div>
          <button
            onClick={handleVerify}
            className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition"
          >
            Verify & Top Up
          </button>
        </>
      )}
    </div>
  );
};

export default Verification;
