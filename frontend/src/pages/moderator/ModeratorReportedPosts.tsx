import { useGetReportedPostsQuery, useTakeActionOnPostMutation } from "../../redux/moderatorSlice";
import { toast } from "react-toastify";

const ModeratorReportedPosts = () => {
  const { data: reportedPosts, isLoading } = useGetReportedPostsQuery();
  const [takeActionOnPost] = useTakeActionOnPostMutation();

  const handleAction = async (id: string, action: "delete" | "dismiss") => {
    try {
      await takeActionOnPost({ id, action }).unwrap();
      toast.success(`Action "${action}" applied successfully!`);
    } catch (error) {
      toast.error("Failed to take action");
    }
  };

  if (isLoading) return <p>Loading reported posts...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reported Posts</h2>
      {reportedPosts?.length ? (
        reportedPosts.map((post) => (
          <div key={post._id} className="p-4 border-b">
            <p className="font-bold">{post.title}</p>
            <p className="text-gray-600 text-sm">Reported by users</p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleAction(post._id, "delete")}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => handleAction(post._id, "dismiss")}
                className="bg-gray-300 p-2 rounded-md"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No reported posts.</p>
      )}
    </div>
  );
};

export default ModeratorReportedPosts;
