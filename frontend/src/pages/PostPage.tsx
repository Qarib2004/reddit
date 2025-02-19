import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../redux/postsSlice";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
} from "../redux/commentsSlice";
import CommentList from "../components/CommentList";
import PostItem from "../components/PostItem";
import Loader from "../assets/loader-ui/Loader";
import { useGetUserQuery } from "../redux/apiSlice";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const PostPage = () => {
  const { id } = useParams();
  const { data: post, isLoading: isPostLoading } = useGetPostByIdQuery(
    id || ""
  );
  const {
    data: comments,
    isLoading: isCommentsLoading,
    refetch,
  } = useGetCommentsQuery(id || "");
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [commentContent, setCommentContent] = useState("");
  const { data: user } = useGetUserQuery();

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) return;

    try {
      await addComment({ postId: id || "", content: commentContent }).unwrap();

      setCommentContent("");
      refetch();
    } catch (error) {
      console.error("Error when adding a comment:", error);
    }
  };

  if (isPostLoading) {
    return <Loader />;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Post not found
          </h1>
          <p className="text-gray-600 mt-2">
            The post you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      {user?._id === post.author?._id && (
        <Link
          to={`/post/${post._id}/edit`}
          className="px-4 py-2  text-black rounded-md flex items-center gap-2 hover:bg-gray-200 transition w-1/8"
        >
          <Settings size={18} />
          Settings
        </Link>
      )}

      <div className="max-w-4xl mx-auto px-4 ">
        <PostItem post={post} />

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <form onSubmit={handleAddComment}>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full min-h-[8rem] p-4 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isAddingComment}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingComment ? "Adding..." : "Comment"}
                </button>
              </div>
            </form>
          </div>

          <div className="p-4">
            {isCommentsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <CommentList comments={comments} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to share what you think!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
