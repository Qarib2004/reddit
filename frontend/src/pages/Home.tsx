import { useEffect, useState } from "react";
import { useGetPostsQuery } from "../redux/postsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import { Link } from "react-router-dom";
import SelectTopicModal from "../components/SelectTopicModal";
import PostItem from "../components/PostItem";
import { Rocket, Flame, Clock, TrendingUp, Award } from "lucide-react";

const Home = () => {
  const [sort, setSort] = useState("hot");
  const { data: posts, isLoading, error } = useGetPostsQuery(sort);
  const { data: user } = useGetUserQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && (!user.topics || user.topics.length === 0)) {
      setIsModalOpen(true);
    }
  }, [user]);

  const sortOptions = [
    { value: "best", label: "Best", icon: Award },
    { value: "hot", label: "Hot", icon: Flame },
    { value: "new", label: "New", icon: Clock },
    { value: "top", label: "Top", icon: Rocket },
    { value: "rising", label: "Rising", icon: TrendingUp },
  ];

  if (isLoading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  if (error) return <div className="text-center text-red-500 p-8">Failed to load posts</div>;

  return (
    <>
      {user && (
        <SelectTopicModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="max-w-[1000px] mx-auto px-4 flex gap-6">
        <div className="flex-1">
          {/* Sort Options */}
          <div className="bg-white rounded-md mb-4 flex items-center">
            {sortOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSort(value)}
                className={`flex items-center space-x-1 px-4 py-3 text-sm font-medium ${
                  sort === value
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Posts */}
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center text-gray-500 p-8">No posts found</div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80">
          <div className="bg-white rounded-md overflow-hidden">
            <div className="bg-blue-500 p-4">
              <h3 className="text-white font-medium">Top Communities</h3>
            </div>
            <div className="p-4">
              {["programming", "reactjs", "webdev", "javascript", "typescript"].map((community, index) => (
                <Link
                  key={community}
                  to={`/r/${community}`}
                  className="flex items-center py-2 hover:bg-gray-50 -mx-4 px-4"
                >
                  <span className="text-sm font-medium text-gray-500 w-5">{index + 1}</span>
                  <span className="text-sm font-medium text-blue-500 hover:underline">r/{community}</span>
                </Link>
              ))}
              <button className="w-full mt-2 bg-blue-500 text-white rounded-full py-1.5 text-sm font-medium hover:bg-blue-600">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
