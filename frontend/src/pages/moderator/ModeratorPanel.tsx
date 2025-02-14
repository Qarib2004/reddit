import { useGetReportedPostsQuery, useTakeActionOnPostMutation, useGetReportedCommentsQuery, useTakeActionOnCommentMutation } from "../../redux/moderatorSlice";
import { toast } from "react-toastify";

const ModeratorPanel = () => {
  const { data: reportedPosts, isLoading: loadingPosts } = useGetReportedPostsQuery();
  const { data: reportedComments, isLoading: loadingComments } = useGetReportedCommentsQuery();
  const [takeActionOnPost] = useTakeActionOnPostMutation();
  const [takeActionOnComment] = useTakeActionOnCommentMutation();

  const handleAction = async (id: string, type: "post" | "comment", action: "delete" | "dismiss") => {
    try {
      if (type === "post") {
        await takeActionOnPost({ id, action }).unwrap();
      } else {
        await takeActionOnComment({ id, action }).unwrap();
      }
      toast.success(`Action "${action}" applied successfully!`);
    } catch (error) {
      toast.error("Failed to take action");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Moderator Panel</h2>

      <h3 className="text-xl font-semibold mt-6">Reported Posts</h3>
      {loadingPosts ? <p>Loading...</p> : reportedPosts?.map(post => (
        <div key={post._id} className="p-4 border-b">
          <p><strong>{post.title}</strong> by {post.author.username}</p>
          <button onClick={() => handleAction(post._id, "post", "delete")} className="bg-red-500 text-white p-2 rounded-md">Delete</button>
          <button onClick={() => handleAction(post._id, "post", "dismiss")} className="ml-2 bg-gray-300 p-2 rounded-md">Dismiss</button>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-6">Reported Comments</h3>
      {loadingComments ? <p>Loading...</p> : reportedComments?.map(comment => (
        <div key={comment._id} className="p-4 border-b">
          <p>{comment.content} by {comment.author.username}</p>
          <button onClick={() => handleAction(comment._id, "comment", "delete")} className="bg-red-500 text-white p-2 rounded-md">Delete</button>
          <button onClick={() => handleAction(comment._id, "comment", "dismiss")} className="ml-2 bg-gray-300 p-2 rounded-md">Dismiss</button>
        </div>
      ))}
    </div>
  );
};

export default ModeratorPanel;
