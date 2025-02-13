import { useState } from "react";

const AdminSettings = () => {
  const [siteSettings, setSiteSettings] = useState({
    allowUserRegistration: true,
    enableNSFWContent: false,
    maxPostLength: 5000,
  });

  const handleToggle = (key: keyof typeof siteSettings) => {
    setSiteSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSiteSettings((prev) => ({ ...prev, maxPostLength: Number(event.target.value) }));
  };

  const handleSave = () => {
    console.log("Saving settings:", siteSettings);
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={siteSettings.allowUserRegistration}
            onChange={() => handleToggle("allowUserRegistration")}
            className="mr-2"
          />
          Allow User Registration
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={siteSettings.enableNSFWContent}
            onChange={() => handleToggle("enableNSFWContent")}
            className="mr-2"
          />
          Enable NSFW Content
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Max Post Length</label>
        <input
          type="number"
          value={siteSettings.maxPostLength}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Settings
      </button>
    </div>
  );
};

export default AdminSettings;
