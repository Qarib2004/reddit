import { useGetReportedCommentsQuery, useTakeActionOnCommentMutation } from "../../redux/moderatorSlice";
import { toast } from "react-toastify";

const ModeratorReportedComments = () => {
  const { data: reportedComments, isLoading } = useGetReportedCommentsQuery();
  const [takeActionOnComment] = useTakeActionOnCommentMutation();

  const handleAction = async (id: string, action: "delete" | "dismiss") => {
    try {
      await takeActionOnComment({ id, action }).unwrap();
      toast.success(`Action "${action}" applied successfully!`);
    } catch (error) {
      toast.error("Failed to take action");
    }
  };

  if (isLoading) return <p>Loading reported comments...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reported Comments</h2>
      {reportedComments?.length ? (
        reportedComments.map((comment) => (
          <div key={comment._id} className="p-4 border-b">
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-gray-600 text-sm">Reported by users</p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleAction(comment._id, "delete")}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => handleAction(comment._id, "dismiss")}
                className="bg-gray-300 p-2 rounded-md"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No reported comments.</p>
      )}
    </div>
  );
};

export default ModeratorReportedComments;
