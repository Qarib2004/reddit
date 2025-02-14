import { Link } from "react-router-dom";



const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 hidden lg:block">
      <ul>
        <li className="mb-2"><Link to="/admin/users" className="block py-2 px-4 hover:bg-gray-700 rounded">Users</Link></li>
        <li className="mb-2"><Link to="/admin/community" className="block py-2 px-4 hover:bg-gray-700 rounded">Communities</Link></li>
        <li className="mb-2"><Link to="/admin/content" className="block py-2 px-4 hover:bg-gray-700 rounded">Content</Link></li>
        <li className="mb-2"><Link to="/admin/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">Settings</Link></li>
        <li className="mb-2"><Link to="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
        <li>
          <Link
            to="/admin/moderator-requests
"
            className="block py-2 px-4 hover:bg-gray-700 rounded"
          >
            Requests
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;