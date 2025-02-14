import { useGetReportedPostsQuery, useGetReportedCommentsQuery } from "../../redux/moderatorSlice";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ModeratorDashboard = () => {
  const { data: reportedPosts, isLoading: loadingPosts } = useGetReportedPostsQuery();
  const { data: reportedComments, isLoading: loadingComments } = useGetReportedCommentsQuery();

  const totalReportedPosts = reportedPosts?.length || 0;
  const totalReportedComments = reportedComments?.length || 0;

  const reportData = {
    labels: ["Reported Posts", "Reported Comments"],
    datasets: [
      {
        label: "Total Reports",
        data: [totalReportedPosts, totalReportedComments],
        backgroundColor: ["#ff4500", "#00bfff"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Moderator Dashboard</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold">Total Reported Posts</h3>
          <p className="text-2xl font-bold">{totalReportedPosts}</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold">Total Reported Comments</h3>
          <p className="text-2xl font-bold">{totalReportedComments}</p>
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

      {(loadingPosts || loadingComments) && <p>Loading reports...</p>}
    </div>
  );
};

export default ModeratorDashboard;
