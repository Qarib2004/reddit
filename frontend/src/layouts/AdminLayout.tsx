import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

import { useEffect } from "react";


const AdminLayout = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth?.user);
  
  
    useEffect(() => {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "admin") {
        navigate("/");
      } else {
        console.log("User is admin, rendering Admin Panel");
      }
    }, [user, navigate]);
  
    if (!user) return <p className="text-center text-xl p-10">Loading...</p>;
  
    return (
      <>
        <AdminNavbar />
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-gray-100">
            <Outlet />
          </main>
        </div>
      </>
    );
  };
  
  export default AdminLayout;