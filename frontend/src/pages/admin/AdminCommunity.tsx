import { useGetAdminStatsQuery, useGetAllCommunitiesQuery, useDeleteCommunityMutation } from "../../redux/adminSlice";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { ChartData } from "chart.js";

const AdminCommunity = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();
  const { data: communities } = useGetAllCommunitiesQuery();
  const [deleteCommunity] = useDeleteCommunityMutation();

  const [pieChartData, setPieChartData] = useState<ChartData<"pie"> | null>(null);
  const [lineChartData, setLineChartData] = useState<ChartData<"line"> | null>(null);

  useEffect(() => {
    if (stats) {
      setPieChartData({
        labels: ["Communities", "Users", "Posts"],
        datasets: [
          {
            label: "Community Overview",
            data: [stats.totalCommunities, stats.totalUsers, stats.totalPosts],
            backgroundColor: ["#2ecc71", "#e67e22", "#3498db"],
          },
        ],
      });

      setLineChartData({
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Community Growth",
            data: [20, 35, 50, stats.totalCommunities], 
            borderColor: "#3498db",
            fill: false,
          },
        ],
      });
    }
  }, [stats]);

  if (isLoading) return <p>Loading community statistics...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Community Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pieChartData && (
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Community Overview</h3>
            <Pie data={pieChartData} />
          </div>
        )}

        {lineChartData && (
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Community Growth</h3>
            <Line data={lineChartData} />
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mt-8">Manage Communities</h3>
      <table className="w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Members</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {communities?.map((community) => (
            <tr key={community._id} className="text-center">
              <td className="border p-2">{community.name}</td>
              <td className="border p-2">{community.membersCount}</td> 
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteCommunity(community._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCommunity;
