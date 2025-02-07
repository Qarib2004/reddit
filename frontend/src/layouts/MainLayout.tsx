import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"; 

const MainLayout = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/auth", "/login", "/register","/forgot-password"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
  <>
    {!hideNavbar && <Navbar />}
    <div className="flex">
      
      {!hideNavbar && <Sidebar />}
      <div className="flex-1">
       
        <main className="min-h-screen bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  </>
  );
};

export default MainLayout;
