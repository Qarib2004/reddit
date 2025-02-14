import { useState } from "react";
import { useRequestPasswordChangeMutation, useChangePasswordMutation } from "../redux/apiSlice";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [requestPasswordChange] = useRequestPasswordChangeMutation();
  const [changePassword] = useChangePasswordMutation();

  const handleRequestCode = async () => {
    try {
      await requestPasswordChange({ phoneNumber }).unwrap();
      toast.success("Reset code sent!");
      setStep(2);
    } catch (error:any) {
      toast.error(error.data?.message || "Failed to send reset code");
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword({ phoneNumber, resetCode, newPassword }).unwrap();
      toast.success("Password updated successfully!");
      setStep(1);
    } catch (error:any) {
      toast.error(error.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6">{step === 1 ? "Request Password Change" : "Enter Reset Code"}</h2>

      {step === 1 ? (
        <>
          <label className="block text-lg font-semibold">Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="border p-2 w-full rounded-md" />

          <button onClick={handleRequestCode} className="bg-blue-500 text-white p-2 rounded-md mt-4">Send Code</button>
        </>
      ) : (
        <>
          <label className="block text-lg font-semibold">Reset Code</label>
          <input type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} className="border p-2 w-full rounded-md" />

          <label className="block text-lg font-semibold mt-4">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-2 w-full rounded-md" />

          <button onClick={handleChangePassword} className="bg-green-500 text-white p-2 rounded-md mt-4">Change Password</button>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
