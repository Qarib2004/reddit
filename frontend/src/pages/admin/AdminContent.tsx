import { useGetAdminStatsQuery, useGetAllPostsQuery, useDeletePostMutation } from "../../redux/adminSlice";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { ChartData } from "chart.js";

const AdminContent = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();
  const { data: posts } = useGetAllPostsQuery();
  const [deletePost] = useDeletePostMutation();

  const [barChartData, setBarChartData] = useState<ChartData<"bar"> | null>(null);
  const [doughnutChartData, setDoughnutChartData] = useState<ChartData<"doughnut"> | null>(null);

  useEffect(() => {
    if (stats) {
      setBarChartData({
        labels: ["Posts", "Comments", "Communities"],
        datasets: [
          {
            label: "Content Statistics",
            data: [stats.totalPosts, stats.totalComments, stats.totalCommunities],
            backgroundColor: ["#3498db", "#e74c3c", "#9b59b6"],
          },
        ],
      });

      setDoughnutChartData({
        labels: ["Posts", "Comments", "Communities"],
        datasets: [
          {
            data: [stats.totalPosts, stats.totalComments, stats.totalCommunities],
            backgroundColor: ["#2ecc71", "#f39c12", "#8e44ad"],
          },
        ],
      });
    }
  }, [stats]);

  if (isLoading) return <p>Loading content statistics...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Content Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {barChartData && (
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Content Overview</h3>
            <Bar data={barChartData} />
          </div>
        )}

        {doughnutChartData && (
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Post Distribution</h3>
            <Doughnut data={doughnutChartData} />
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mt-8">Manage Posts</h3>
      <table className="w-full mt-4 border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((post) => (
            <tr key={post._id} className="text-center">
              <td className="border p-2">{post.title}</td>
              <td className="border p-2">{post.author?.username || "Unknown"}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deletePost(post._id)}
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

export default AdminContent;
