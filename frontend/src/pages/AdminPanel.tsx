import { useGetAdminStatsQuery } from "../redux/apiSlice";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPanel = () => {
  const { data, isLoading, error } = useGetAdminStatsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading stats</p>;

  const chartData = {
    labels: ["Users", "Posts", "Comments", "Communities"],
    datasets: [
      {
        label: "Total Count",
        data: [
          data?.stats?.totalUsers,
          data?.stats?.totalPosts,
          data?.stats?.totalComments,
          data?.stats?.totalCommunities,
        ],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"],
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Admin Dashboard</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default AdminPanel;
