import { useEffect, useState } from "react";
import { useGetUserQuery, useUpdateUserMutation, useUpdatePersonalizationMutation, useGetUserSubscriptionsQuery, useDeleteAccountMutation, useRequestModeratorMutation } from "../redux/apiSlice";
import { toast } from "react-toastify";
import { Moon, Sun, Save, KeyRound, User, Mail, Phone, Globe, Clock, FileText, Trash2, Eye, Settings as SettingsIcon } from "lucide-react";
import { useLeaveCommunityMutation } from "../redux/communitiesSlice";
import ChangePassword from "./ChangePassword";

const Settings = () => {
  const { data: user, isLoading } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const { data: subscriptions } = useGetUserSubscriptionsQuery();
  const [updatePersonalization] = useUpdatePersonalizationMutation();
  const [unsubscribe] = useLeaveCommunityMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [darkMode, setDarkMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [requestModerator] = useRequestModeratorMutation();

const handleRequestModerator = async () => {
  try {
    await requestModerator().unwrap();
    toast.success("Request sent to admin!");
  } catch (error) {
    toast.error("Failed to send request");
  }
};



  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.bio || "",
    country: user?.country || "",
    timezone: user?.timezone || "",
    theme: user?.theme || "light",
    fontSize: user?.fontSize || 16,
    showTrending: user?.showTrending || true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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

  const handlePersonalizationUpdate = async () => {
    try {
      await updatePersonalization({
        theme: formData.theme,
        fontSize: formData.fontSize,
        showTrending: formData.showTrending,
      }).unwrap();
      toast.success("Personalization settings updated!");
    } catch (error) {
      toast.error("Failed to update personalization settings");
    }
  };
  useEffect(() => {
    if (formData.theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}, [formData.theme]);

  const handleUnsubscribe = async (id: string) => {
    try {
      await unsubscribe(id).unwrap();
      toast.success("Unsubscribed successfully!");
    } catch (error) {
      toast.error("Failed to unsubscribe");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount().unwrap();
        toast.success("Account deleted successfully");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff4500]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-[#1a1a1b] text-gray-200" : "bg-[#dae0e6]"}`}>
      <div className="max-w-4xl mx-auto p-4">
        <div className={`rounded-lg ${darkMode ? "bg-[#272729]" : "bg-white"} shadow-lg`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <SettingsIcon className="w-6 h-6" />
                User Settings
              </h2>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Profile Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <User className="w-4 h-4" />
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-[#1a1a1b] border-gray-700 focus:border-[#ff4500]"
                        : "bg-white border-gray-300 focus:border-[#ff4500]"
                    } focus:ring-1 focus:ring-[#ff4500] outline-none`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-[#1a1a1b] border-gray-700 focus:border-[#ff4500]"
                        : "bg-white border-gray-300 focus:border-[#ff4500]"
                    } focus:ring-1 focus:ring-[#ff4500] outline-none`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-[#1a1a1b] border-gray-700 focus:border-[#ff4500]"
                        : "bg-white border-gray-300 focus:border-[#ff4500]"
                    } focus:ring-1 focus:ring-[#ff4500] outline-none`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    <span>Country</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-[#1a1a1b] border-gray-700 focus:border-[#ff4500]"
                        : "bg-white border-gray-300 focus:border-[#ff4500]"
                    } focus:ring-1 focus:ring-[#ff4500] outline-none`}
                  >
                    <option value="">Select Country</option>
                    <option value="Azerbayjan">Azerbayjan</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Timezone</span>
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-[#1a1a1b] border-gray-700 focus:border-[#ff4500]"
                        : "bg-white border-gray-300 focus:border-[#ff4500]"
                    } focus:ring-1 focus:ring-[#ff4500] outline-none`}
                  >
                    <option value="">Select Timezone</option>
                    <option value="GMT">GMT</option>
                    <option value="CET">CET</option>
                    <option value="EST">EST</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    <span>Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-[#1a1a1b] border-gray-700 focus:border-[#ff4500]"
                        : "bg-white border-gray-300 focus:border-[#ff4500]"
                    } focus:ring-1 focus:ring-[#ff4500] outline-none`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Personalization</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>Theme</span>
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-[#1a1a1b] border-gray-700 focus:border-[#ff4500]"
                        : "bg-white border-gray-300 focus:border-[#ff4500]"
                    } focus:ring-1 focus:ring-[#ff4500] outline-none`}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Font Size: {formData.fontSize}px</span>
                    </span>
                  </label>
                  <input
                    type="range"
                    name="fontSize"
                    min="12"
                    max="24"
                    value={formData.fontSize}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3 text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      name="showTrending"
                      checked={formData.showTrending}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#ff4500] border-gray-300 rounded focus:ring-[#ff4500] dark:border-gray-600"
                    />
                    <span>Show Trending Posts</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handlePersonalizationUpdate}
                    className="px-4 py-2 bg-[#ff4500] hover:bg-[#ff5414] text-white rounded-full transition-colors"
                  >
                    Save Personalization
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold">Subscriptions</h3>
              <div className="space-y-4">
                {subscriptions?.map((community) => (
                  <div
                    key={community._id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? "bg-[#1a1a1b]" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{community.name}</span>
                    <button
                      type="button"
                      onClick={() => handleUnsubscribe(community._id)}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      Unsubscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-red-500">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h3>
              <div className={`p-4 rounded-lg ${darkMode ? "bg-[#1a1a1b]" : "bg-gray-50"} border border-red-200 dark:border-red-900`}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-[#ff4500] hover:bg-[#ff5414] text-white rounded-full transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>


              <button
                type="button"
                onClick={() => setShowChangePassword(!showChangePassword)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>{showChangePassword ? "Cancel" : "Change Password"}</span>
              </button>
            </div>
          </form>

          <div className="">
            <div className={`p-4 rounded-lg ${darkMode ? "bg-[#1a1a1b]" : "bg-gray-50"}`}>
              <button onClick={handleRequestModerator} className="bg-blue-500 text-white p-2 rounded-md">
                Request Moderator Role
              </button>
            </div>
          </div>

          {showChangePassword && (
            <div className="px-6 pb-6">
              <div className={`p-4 rounded-lg ${darkMode ? "bg-[#1a1a1b]" : "bg-gray-50"}`}>
                <ChangePassword />
              </div>
            </div>
            
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Settings;