import { useGetModeratorStatsQuery } from "../../redux/moderatorSlice";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ModeratorStats = () => {
  const { data: stats, isLoading } = useGetModeratorStatsQuery();
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (isLoading) return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-center">
        Loading statistics...
      </div>
    </div>
  );

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
    <div className="p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Moderator Statistics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="p-3 sm:p-4 bg-white shadow-md rounded-md">
          <h3 className="text-base sm:text-lg font-semibold">Total Reports Handled</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats?.handledReports || 0}</p>
        </div>
        <div className="p-3 sm:p-4 bg-white shadow-md rounded-md">
          <h3 className="text-base sm:text-lg font-semibold">Total Dismissed Reports</h3>
          <p className="text-xl sm:text-2xl font-bold">{stats?.dismissedReports || 0}</p>
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
    </div>
  );
};

export default ModeratorStats;