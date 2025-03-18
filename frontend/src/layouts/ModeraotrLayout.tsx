import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  ShieldCheck, 
  BarChart, 
  FileWarning, 
  MessageSquareWarning, 
  AlertTriangle, 
  MessageSquare, 
  History, 
  LogOut,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const ModeratorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-16'} bg-white shadow-md transition-all duration-300 overflow-hidden fixed md:relative h-full z-10`}
      >
        <div className="p-4">
          <h2 className={`text-2xl font-bold text-center mb-6 ${!sidebarOpen && 'md:hidden'}`}>
            Moderator Panel
          </h2>
          
          <div className={`${sidebarOpen ? 'hidden' : 'hidden md:flex flex-col items-center space-y-8 mt-8'}`}>
            <NavLink to="/moderator/dashboard" className={({ isActive }) => `p-2 rounded-full ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <BarChart className="w-5 h-5" />
            </NavLink>
            <NavLink to="/moderator/reported-posts" className={({ isActive }) => `p-2 rounded-full ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <FileWarning className="w-5 h-5" />
            </NavLink>
            <NavLink to="/moderator/reported-comments" className={({ isActive }) => `p-2 rounded-full ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <MessageSquareWarning className="w-5 h-5" />
            </NavLink>
            <NavLink to="/moderator/warnings" className={({ isActive }) => `p-2 rounded-full ${isActive ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <AlertTriangle className="w-5 h-5" />
            </NavLink>
            <NavLink to="/moderator/stats" className={({ isActive }) => `p-2 rounded-full ${isActive ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <ShieldCheck className="w-5 h-5" />
            </NavLink>
            <NavLink to="/moderator/history" className={({ isActive }) => `p-2 rounded-full ${isActive ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <History className="w-5 h-5" />
            </NavLink>
            <NavLink to="/moderator/chat" className={({ isActive }) => `p-2 rounded-full ${isActive ? "bg-indigo-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <MessageSquare className="w-5 h-5" />
            </NavLink>
            <NavLink to="/" className="p-2 rounded-full text-red-600 hover:bg-red-100">
              <LogOut className="w-5 h-5" />
            </NavLink>
          </div>

          <nav className={`space-y-4 ${!sidebarOpen && 'hidden'}`}>
            <NavLink
              to="/moderator/dashboard"
              className={({ isActive }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <BarChart className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/moderator/reported-posts"
              className={({ isActive }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <FileWarning className="w-5 h-5" />
              <span>Reported Posts</span>
            </NavLink>

            <NavLink
              to="/moderator/reported-comments"
              className={({ isActive }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <MessageSquareWarning className="w-5 h-5" />
              <span>Reported Comments</span>
            </NavLink>

            <NavLink
              to="/moderator/warnings"
              className={({ isActive }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Warnings</span>
            </NavLink>

            <NavLink
              to="/moderator/stats"
              className={({ isActive }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Stats</span>
            </NavLink>

            <NavLink
              to="/moderator/history"
              className={({ isActive }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <History className="w-5 h-5" />
              <span>History</span>
            </NavLink>

            <NavLink
              to="/moderator/chat"
              className={({ isActive }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? "bg-indigo-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat</span>
            </NavLink>

            <NavLink
              to="/"
              className="flex items-center space-x-2 p-2 rounded-md text-red-600 hover:bg-red-100"
            >
              <LogOut className="w-5 h-5" />
              <span>Exit Moderator Mode</span>
            </NavLink>
          </nav>
        </div>
      </aside>

      <button 
        onClick={toggleSidebar}
        className="absolute left-0 md:left-auto md:right-auto md:translate-x-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-r-md p-2 z-20"
        style={{ 
          left: sidebarOpen ? (isMobile ? '16rem' : '16rem') : '0', 
          transition: 'left 0.3s ease'
        }}
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen && isMobile ? 'opacity-50' : 'opacity-100'}`} style={{ marginLeft: isMobile ? '0' : sidebarOpen ? '0' : '0' }}>
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default ModeratorLayout;