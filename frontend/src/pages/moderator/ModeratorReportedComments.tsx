import { useGetReportedCommentsQuery } from "../../redux/moderatorSlice";
import Loader from "../../assets/loader-ui/Loader";
import { Link } from "react-router-dom";
import { AlertTriangle, MessageCircle, Users } from 'lucide-react';

const ModeratorReportedComments = () => {
  const { data, isLoading, error } = useGetReportedCommentsQuery();
   
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        <p>Error loading reported comments</p>
      </div>
    </div>
  );

  const reportedComments = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reported Comments</h2>
        {reportedComments.length > 0 && (
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {reportedComments.length} comments
          </span>
        )}
      </div>

      {reportedComments.length > 0 ? (
        <div className="space-y-6">
          {reportedComments.map((comment) => (
            <div key={comment._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Comment by <span className="font-medium">{comment.author?.username || "Unknown"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    on post <Link to={`/post/${comment.post}`} className="font-medium text-blue-600 hover:underline">
                      View Post
                    </Link>
                  </span>
                </div>

                <p className="text-gray-800 border-l-4 border-gray-300 pl-3 italic">
                  "{comment.content}"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                {comment.reports?.length ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">
                        {comment.reports.length} Report{comment.reports.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {comment.reports.map((report, index) => (
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
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No reported comments at this time.</p>
        </div>
      )}
    </div>
  );
};

export default ModeratorReportedComments;
