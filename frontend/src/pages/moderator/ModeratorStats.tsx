import { useGetModeratorStatsQuery } from "../../redux/moderatorSlice";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ModeratorStats = () => {
  const { data: stats, isLoading } = useGetModeratorStatsQuery();

  if (isLoading) return <p>Loading statistics...</p>;

  const reportData = {
    labels: ["Handled Reports", "Dismissed Reports"],
    datasets: [
      {
        label: "Moderator Actions",
        data: [stats?.handledReports || 0, stats?.dismissedReports || 0],
        backgroundColor: ["#ff4500", "#00bfff"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Moderator Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold">Total Reports Handled</h3>
          <p className="text-2xl font-bold">{stats?.handledReports || 0}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold">Total Dismissed Reports</h3>
          <p className="text-2xl font-bold">{stats?.dismissedReports || 0}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold mb-2">Reports Overview</h3>
          <Bar data={reportData} />
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold mb-2">Reports Breakdown</h3>
          <Pie data={reportData} />
        </div>
      </div>
    </div>
  );
};

export default ModeratorStats;
