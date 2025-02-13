import { Link } from "react-router-dom";
import { useGetAdminStatsQuery } from "../../redux/adminSlice";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const AdminPanel = () => {
  const { data: stats, isLoading, error } = useGetAdminStatsQuery();

  if (isLoading) return <p>Loading statistics...</p>;
  if (error) return <p className="text-red-500">Failed to load statistics.</p>;

  const userStats = {
    labels: ["Users", "Moderators", "Admins"],
    datasets: [
      {
        label: "User Roles",
        data: stats ? [stats.users, stats.moderators, stats.admins] : [0, 0, 0],
        backgroundColor: ["#3498db", "#e67e22", "#2ecc71"],
      },
    ],
  };

  const contentStats = {
    labels: ["Posts", "Comments", "Communities"],
    datasets: [
      {
        label: "Content Statistics",
        data: stats ? [stats.posts, stats.comments, stats.communities] : [0, 0, 0],
        backgroundColor: ["#f1c40f", "#e74c3c", "#9b59b6"],
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
          Manage Users
        </Link>
        <Link to="/admin/community" className="p-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
          Manage Communities
        </Link>
        <Link to="/admin/content" className="p-4 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition">
          Moderate Content
        </Link>
        <Link to="/admin/settings" className="p-4 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition">
          Admin Settings
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">User Role Distribution</h3>
          {stats ? <Pie data={userStats} /> : <p>No data available</p>}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Content Statistics</h3>
          {stats ? <Bar data={contentStats} /> : <p>No data available</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
