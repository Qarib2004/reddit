import { useState } from "react";
import { useGetUserQuery, useUpdateUserMutation } from "../redux/apiSlice";
import { toast } from "react-toastify";
import ChangePassword from "./ChangePassword";

const Settings = () => {
  const { data: user, isLoading } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [darkMode, setDarkMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); 

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "", 
    bio: user?.bio || "",
    country: user?.country || "",
    timezone: user?.timezone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) return <p>Loading user settings...</p>;

  return (
    <div className={`p-6 bg-white shadow-lg rounded-lg ${darkMode ? "dark bg-gray-900 text-white" : ""}`}>
      <h2 className="text-3xl font-bold mb-6">User Settings</h2>

      <label className="block text-lg font-semibold">Username</label>
      <input type="text" name="username" value={formData.username} onChange={handleChange} className="border p-2 w-full rounded-md" />

      <label className="block text-lg font-semibold mt-4">Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded-md" />

      <label className="block text-lg font-semibold mt-4">Phone Number</label>
      <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border p-2 w-full rounded-md" />

      <label className="block text-lg font-semibold mt-4">Bio</label>
      <input type="text" name="bio" value={formData.bio} onChange={handleChange} className="border p-2 w-full rounded-md" />

      <label className="block text-lg font-semibold mt-4">Country</label>
      <select name="country" value={formData.country} onChange={handleChange} className="border p-2 w-full rounded-md">
        <option value="">Select Country</option>
        <option value="Azerbayjan">Azerbayjan</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
        <option value="Germany">Germany</option>
      </select>

      <label className="block text-lg font-semibold mt-4">Timezone</label>
      <select name="timezone" value={formData.timezone} onChange={handleChange} className="border p-2 w-full rounded-md">
        <option value="">Select Timezone</option>
        <option value="GMT">GMT</option>
        <option value="CET">CET</option>
        <option value="EST">EST</option>
      </select>

      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-md mt-4">Save Changes</button>

      <button onClick={() => setDarkMode(!darkMode)} className="bg-gray-700 text-white p-2 rounded-md mt-4 ml-2">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <button onClick={() => setShowChangePassword(!showChangePassword)} className="bg-red-500 text-white p-2 rounded-md mt-4">
        {showChangePassword ? "Cancel" : "Change Password"}
      </button>

      {showChangePassword && <ChangePassword />}
    </div>
  );
};

export default Settings;
