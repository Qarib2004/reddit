import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PrivateRoute from "../components/PrivateRoute";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
    <PrivateRoute>
      <Navbar/>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;
