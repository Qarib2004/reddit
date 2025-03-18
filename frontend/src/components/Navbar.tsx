import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetUserQuery, useLogoutMutation } from "../redux/apiSlice";
import { useGetNotificationsQuery } from "../redux/notificationsSlice";
import { useEffect, useState } from "react";
import { Bell, Plus, Search, ChevronDown, LogOut, User, MessageCircle, Menu, X } from "lucide-react";
import socket from "../utils/socket";
import FriendRequests from "./FriendRequets";
import MessageModal from "./MessageModal";

const Navbar = () => {
  const { data: user } = useGetUserQuery();
  const { data: notifications, refetch } = useGetNotificationsQuery();
  const [logout] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [friendRequests, setFriendRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };


  useEffect(() => {
    if (notifications) {
      setFriendRequests(notifications.friendRequests);
      setUnreadMessages(notifications.unreadMessages);
      refetch();
    }
  }, [notifications]);

  useEffect(() => {
    if (!user) return;

    socket.emit("user-online", user._id);

    socket.on("newFriendRequest", () => {
      setFriendRequests((prev) => prev + 1);
    });

    socket.on("newMessage", () => {
      setUnreadMessages((prev) => prev + 1);
    });

    return () => {
      socket.off("newFriendRequest");
      socket.off("newMessage");
    };
  }, [user]);

  const handleLogout = async () => {
    await logout().unwrap();
    window.location.reload();
  };

  const closeAllMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setShowFriendRequests(false);
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 right-0 z-50 md:static md:z-auto">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-3">
            <img
              src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png"
              alt="Reddit Logo"
              className="w-8 h-8"
            />
            <Link to="/" className="text-orange-600 text-xl font-bold hidden sm:block">
              Reddit
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-2xl mx-6">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search type="submit" size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search Reddit"
                  className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm border border-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Bell 
                size={24} 
                className="text-gray-500 cursor-pointer hover:text-gray-700" 
                onClick={() => setShowFriendRequests(!showFriendRequests)}
              />
              {friendRequests > 0 && (
                <span className="absolute -top-1 -right-[10%] bg-red-500 text-white text-[7px] px-[5px] py-[2px] rounded-full">
                  {friendRequests}
                </span>
              )}
              {showFriendRequests && <FriendRequests />}
            </div>

            <div className="relative">
              <MessageCircle
                size={24}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setMessageModalOpen(true)}
              />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </div>

            <Plus size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />

            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={user.avatar || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-700">Hello, {user.username}!</p>
                    </div>
                    <div className="border-t border-gray-100"></div>

                    <Link
                      to={`/profile/${user._id}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={closeAllMenus}
                    >
                      <User size={20} />
                      My Profile
                    </Link>

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

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {user && (
              <img
                src={user.avatar || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Reddit"
                className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm border border-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <Bell size={20} className="text-gray-500" />
                <span className="text-gray-700">Notifications</span>
                {friendRequests > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                    {friendRequests}
                  </span>
                )}
              </div>

              <div 
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => {
                  setMessageModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <MessageCircle size={20} className="text-gray-500" />
                <span className="text-gray-700">Messages</span>
                {unreadMessages > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                    {unreadMessages}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <Plus size={20} className="text-gray-500" />
                <span className="text-gray-700">Create Post</span>
              </div>

              {user ? (
                <>
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={20} className="text-gray-500" />
                    <span className="text-gray-700">My Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-2 w-full text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {messageModalOpen && <MessageModal onClose={() => setMessageModalOpen(false)} />}
    </nav>
  );
};

export default Navbar;