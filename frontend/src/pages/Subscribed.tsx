import { useGetSubscribedPostsQuery } from "../redux/postsSlice";
import PostItem from "../components/PostItem";
import { Loader, Newspaper } from "lucide-react";
import { useEffect } from "react";

const Subscribed = () => {
  const { data: posts, isLoading, error ,refetch} = useGetSubscribedPostsQuery();

 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader className="animate-spin w-8 h-8 text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg shadow-sm">
          <p className="text-center">Error loading subscribed posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
          <Newspaper className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Subscribed Posts</h2>
        </div>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <PostItem post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No subscribed posts yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Posts you subscribe to will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribed;