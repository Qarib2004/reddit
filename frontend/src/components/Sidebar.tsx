import { useLocation, Link } from "react-router-dom";
import { Plus, Home, Compass, Bookmark, User, Settings, Users, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useGetCommunitiesQuery } from "../redux/communitiesSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();
  const { data: communities = [], isLoading } = useGetCommunitiesQuery();
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCommunities, setShowCommunities] = useState(true); 
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCommunities = () => {
    setShowCommunities(!showCommunities);
  };

  const userCommunities = user
    ? communities.filter((community) => user.subscriptions.includes(community._id))
    : [];

  const sidebarContent = (
    <div className="w-64 h-full bg-white  p-4">
      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="font-bold">Menu</h2>
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            location.pathname === "/" && "bg-gray-200"
          }`}
          onClick={() => isMobile && setIsOpen(false)}
        >
          <Home size={20} />
          Home
        </Link>

        <Link
          to="/create-post"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <Plus size={20} />
          Create Post
        </Link>

        <Link
          to="/explore"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
          onClick={() => isMobile && setIsOpen(false)}
        >
          <Compass size={20} />
          Explore
        </Link>
      </div>

      <div className="mt-6 space-y-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-500 uppercase">Communities</h3>
          <button onClick={toggleCommunities} className="text-gray-600 hover:text-gray-800">
            {showCommunities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showCommunities && (
          <>
            <Link
              to="/create-community"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Plus size={20} />
              Create Community
            </Link>

            {isLoading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : userCommunities.length > 0 ? (
              <ul>
                {userCommunities.map((community) => (
                  <li key={community._id}>
                    <Link
                      to={`/community/${community._id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <Users size={20} />
                      {community.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">You are not in any community.</p>
            )}
          </>
        )}
      </div>

      <div className="mt-6 space-y-4 border-t pt-4">
        {userLoading ? (
          <p className="text-center text-gray-500">Loading user...</p>
        ) : user ? (
          <>
            <Link
              to={`/profile/${user._id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                location.pathname === `/profile/${user._id}` && "bg-gray-200"
              }`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <User size={20} />
              My Profile
            </Link>

            <Link
              to="/saved"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                location.pathname === "/saved" && "bg-gray-200"
              }`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Bookmark size={20} />
              Saved Posts
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Settings size={20} />
              Settings
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-500">Not logged in</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-2 left-[15%] p-2 bg-white rounded-lg shadow-lg md:hidden z-50"
      >
        <Menu size={24} />
      </button>

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-200 ease-in-out fixed md:static top-0 left-0 h-full z-40 md:translate-x-0`}
      >
        {sidebarContent}
      </div>

      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
