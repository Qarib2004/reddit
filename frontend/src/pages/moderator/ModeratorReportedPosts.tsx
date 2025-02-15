import { useGetReportedPostsQuery } from "../../redux/moderatorSlice";
import Loader from "../../assets/loader-ui/Loader";
import { Link } from "react-router-dom";
import { AlertTriangle, MessageCircle, Users } from 'lucide-react';

const ModeratorReportedPosts = () => {
  const { data, isLoading, error } = useGetReportedPostsQuery();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        <p>Error loading reported posts</p>
      </div>
    </div>
  );

  const reportedPosts = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reported Posts</h2>
        {reportedPosts.length > 0 && (
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {reportedPosts.length} posts
          </span>
        )}
      </div>

      {reportedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportedPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <Link 
                  to={`/post/${post._id}`}
                  className="block mb-3"
                >
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Posted by <span className="font-medium">{post.author?.username || "Unknown"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    in <span className="font-medium">{post.community?.name || "Unknown"}</span>
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  {post.reports?.length ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">
                          {post.reports.length} Report{post.reports.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.reports.map((report, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full"
                          >
                            {report.reason || "No reason provided"}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No reports</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No reported posts at this time.</p>
        </div>
      )}
    </div>
  );
};

export default ModeratorReportedPosts;
