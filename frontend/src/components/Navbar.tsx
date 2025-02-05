import { Link } from "react-router-dom";
import { useGetUserQuery, useLogoutMutation } from "../redux/apiSlice";
import { useState } from "react";
import { Bell, Plus, Search,  ChevronDown, LogOut } from "lucide-react";

const Navbar = () => {
  const { data: user } = useGetUserQuery();
  const [logout] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout().unwrap();
    window.location.reload(); 
  };

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-md">
      
      <div className="flex items-center gap-3">
        <img
          src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png"
          alt="Reddit Logo"
          className="w-8 h-8"
        />
        <Link to="/" className="text-orange-600 text-xl font-bold">
          Reddit
        </Link>
      </div>

     
      <div className="relative flex-1 mx-6  justify-center">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search Reddit"
          className="w-1/2 bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm border border-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      
      <div className="flex items-center gap-4">
        <Bell size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />
        <Plus size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />
        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <img
                src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
                style={{objectFit:"cover"}}
              />
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-700">Hello, {user.username}!</p>
                </div>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
