import { useState } from "react";
import { useRequestPasswordChangeMutation, useChangePasswordMutation } from "../redux/apiSlice";
import { toast } from "react-toastify";
import { KeyRound, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-[#DAE0E6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          {step === 2 && (
            <button 
              onClick={() => setStep(1)} 
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-[#FF4500]" />
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 1 ? "Reset Password" : "Verify Code"}
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
                <p className="text-xs text-gray-500">
                  We'll send a verification code to this number
                </p>
              </div>

              <button
                onClick={handleRequestCode}
                className="w-full bg-[#FF4500] text-white py-2 px-4 rounded-full font-medium hover:bg-[#FF5722] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2"
              >
                Send Verification Code
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Verification Code</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-all"
                  placeholder="Enter verification code"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-all"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full bg-[#FF4500] text-white py-2 px-4 rounded-full font-medium hover:bg-[#FF5722] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2"
              >
                Change Password
              </button>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Having trouble? <a href="#" className="text-[#FF4500] hover:text-[#FF5722]">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;