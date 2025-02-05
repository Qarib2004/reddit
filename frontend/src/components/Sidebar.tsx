import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Plus, Home, Compass, Bookmark, User, Settings, Users } from "lucide-react";
import { useGetCommunitiesQuery } from "../redux/communitiesSlice";

const Sidebar = () => {
  const location = useLocation();
  const { data: communities = [], isLoading } = useGetCommunitiesQuery();

  return (
    <div className="w-64 bg-white h-full shadow-lg p-4">
      <div className="space-y-4">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
            location.pathname === "/" && "bg-gray-200"
          }`}
        >
          <Home size={20} />
          Home
        </Link>

        <Link
          to="/create-post"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <Plus size={20} />
          Create Post
        </Link>

        <Link
          to="/explore"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <Compass size={20} />
          Explore
        </Link>
      </div>

      <div className="mt-6 space-y-4 border-t pt-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase">Communities</h3>
        {isLoading ? (
          <p className="text-sm text-gray-600">Loading...</p>
        ) : (
          <ul>
            {communities.map((community) => (
              <li key={community.id}>
                <Link
                  to={`/community/${community.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <Users size={20} />
                  {community.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {location.pathname.includes("community") && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase">About this Community</h3>
          <p className="text-sm text-gray-600">
            This is a sample subreddit with some description here.
          </p>
          <p className="text-sm text-gray-600">Subscribers: 10,000</p>
          <p className="text-sm text-gray-600">Online: 300</p>
          <Link
            to="/rules"
            className="block text-blue-500 text-sm hover:underline"
          >
            View Rules
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-4 border-t pt-4">
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <User size={20} />
          My Profile
        </Link>
        <Link
          to="/saved"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <Bookmark size={20} />
          Saved Posts
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <Settings size={20} />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;