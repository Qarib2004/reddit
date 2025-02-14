import { useGetAdminStatsQuery } from "../../redux/adminSlice";
import { Line } from "react-chartjs-2";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  if (isLoading || !stats) return <p>Loading...</p>;

  const activityChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Active Users",
        data: [20, 35, 50, stats.totalUsers], 
        borderColor: "#3498db",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div>
        <h3>Activity</h3>
        <Line data={activityChartData} />
      </div>

      <div>
        <h3>Top Users</h3>
        <ul>
          {(stats?.topUsers || []).map((user: { _id: string; username: string; karma: number }) => (
            <li key={user._id}>
              {user.username} - {user.karma} karma
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
