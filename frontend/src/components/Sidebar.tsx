import { useLocation, Link } from "react-router-dom";
import { Plus, Home, Compass, Bookmark, User, Settings, Users, ChevronDown, ChevronUp, WalletCards, ChevronRight, ChevronLeft } from "lucide-react";
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
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

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
    <div className="w-full md:w-64 h-full bg-white p-4 overflow-y-auto">
      <div className="space-y-2">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            location.pathname === "/" ? "bg-gray-200 font-medium" : ""
          }`}
        >
          <Home size={20} />
          <span className="truncate">Home</span>
        </Link>

        <Link
          to="/create-post"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            location.pathname === "/create-post" ? "bg-gray-200 font-medium" : ""
          }`}
        >
          <Plus size={20} />
          <span className="truncate">Create Post</span>
        </Link>

        <Link
          to="/subscribed"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            location.pathname === "/subscribed" ? "bg-gray-200 font-medium" : ""
          }`}
        >
          <WalletCards size={20} />
          <span className="truncate">Subscribed</span>
        </Link>

        <Link
          to="/explore"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            location.pathname === "/explore" ? "bg-gray-200 font-medium" : ""
          }`}
        >
          <Compass size={20} />
          <span className="truncate">Explore</span>
        </Link>
      </div>

      <div className="mt-6 space-y-2 border-t pt-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase">Communities</h3>
          <button 
            onClick={toggleCommunities} 
            className="text-gray-600 hover:text-gray-800 p-1"
            aria-label={showCommunities ? "Hide communities" : "Show communities"}
          >
            {showCommunities ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {showCommunities && (
          <div className="space-y-1">
            <Link
              to="/create-community"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                location.pathname === "/create-community" ? "bg-gray-200 font-medium" : ""
              }`}
            >
              <Plus size={18} />
              <span className="truncate">Create Community</span>
            </Link>

            {isLoading ? (
              <p className="text-sm text-gray-600 px-4 py-2">Loading...</p>
            ) : userCommunities.length > 0 ? (
              <ul className="max-h-40 overflow-y-auto">
                {userCommunities.map((community) => (
                  <li key={community._id}>
                    <Link
                      to={`/community/${community._id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                        location.pathname === `/community/${community._id}` ? "bg-gray-200 font-medium" : ""
                      }`}
                    >
                      <Users size={18} />
                      <span className="truncate">{community.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 px-4 py-2">You are not in any community.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-2 border-t pt-4">
        {userLoading ? (
          <p className="text-center text-gray-500 py-2">Loading user...</p>
        ) : user ? (
          <>
            <Link
              to={`/profile/${user._id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                location.pathname === `/profile/${user._id}` ? "bg-gray-200 font-medium" : ""
              }`}
            >
              <User size={20} />
              <span className="truncate">My Profile</span>
            </Link>

            <Link
              to="/saved"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                location.pathname === "/saved" ? "bg-gray-200 font-medium" : ""
              }`}
            >
              <Bookmark size={20} />
              <span className="truncate">Saved Posts</span>
            </Link>

            <Link
              to="/settings"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                location.pathname === "/settings" ? "bg-gray-200 font-medium" : ""
              }`}
            >
              <Settings size={20} />
              <span className="truncate">Settings</span>
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-500 px-4 py-2">Not logged in</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 
          w-64 
          lg:translate-x-0 lg:static lg:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transform transition-all duration-300 ease-in-out
          shadow-lg lg:shadow-none
        `}
      >
        {sidebarContent}
      </aside>

      <div 
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 lg:hidden"
        style={{
          transition: "all 300ms ease-in-out",
          transform: isOpen ? "translateX(256px)" : "translateX(0)"
        }}
      >
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-r-lg shadow-md flex items-center justify-center h-12 w-6 border border-l-0 border-gray-200"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div 
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-30 lg:hidden
          ${isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
};

export default Sidebar;