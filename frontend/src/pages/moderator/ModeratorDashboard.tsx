import { useGetReportedPostsQuery, useGetReportedCommentsQuery } from "../../redux/moderatorSlice";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ModeratorDashboard = () => {
  const { data: reportedPosts, isLoading: loadingPosts } = useGetReportedPostsQuery();
  const { data: reportedComments, isLoading: loadingComments } = useGetReportedCommentsQuery();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        
        position: isMobile ? 'bottom' as const : 'right' as const,
        labels: {
          boxWidth: isMobile ? 12 : 20,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      }
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Moderator Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="p-3 sm:p-4 bg-white shadow-md rounded-md">
          <h3 className="text-base sm:text-lg font-semibold">Total Reported Posts</h3>
          <p className="text-xl sm:text-2xl font-bold">{totalReportedPosts}</p>
        </div>
        <div className="p-3 sm:p-4 bg-white shadow-md rounded-md">
          <h3 className="text-base sm:text-lg font-semibold">Total Reported Comments</h3>
          <p className="text-xl sm:text-2xl font-bold">{totalReportedComments}</p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-3 sm:p-4 bg-white shadow-md rounded-md">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Reports Overview</h3>
          <div className="h-64 sm:h-72">
            <Bar data={reportData} options={chartOptions} />
          </div>
        </div>
        <div className="p-3 sm:p-4 bg-white shadow-md rounded-md">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Reports Breakdown</h3>
          <div className="h-64 sm:h-72">
            <Pie data={reportData} options={chartOptions} />
          </div>
        </div>
      </div>

      {(loadingPosts || loadingComments) && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-center">
          Loading reports...
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;