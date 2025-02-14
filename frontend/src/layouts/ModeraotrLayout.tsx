import { Outlet, NavLink } from "react-router-dom";
import { 
  ShieldCheck, 
  BarChart, 
  FileWarning, 
  MessageSquareWarning, 
  AlertTriangle, 
  MessageSquare, 
  History, 
  LogOut 
} from "lucide-react";

const ModeratorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold text-center mb-6">Moderator Panel</h2>

        <nav className="space-y-4">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ModeratorLayout;
