import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <ul className={`lg:flex space-x-4 ${menuOpen ? "block" : "hidden"}`}>
        <li><Link to="/admin/users" className="hover:text-gray-300">Users</Link></li>
        <li><Link to="/admin/communities" className="hover:text-gray-300">Communities</Link></li>
        <li><Link to="/admin/content" className="hover:text-gray-300">Content</Link></li>
        <li><Link to="/admin/settings" className="hover:text-gray-300">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;