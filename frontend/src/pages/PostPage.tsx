import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPostByIdQuery} from "../redux/postsSlice";
import { useGetCommentsQuery, useAddCommentMutation } from "../redux/commentsSlice";
import CommentList from "../components/CommentList";



const PostPage = () => {
    const { id } = useParams();
    console.log("Post ID from URL:", id);
  const { data: post, isLoading: isPostLoading } = useGetPostByIdQuery(id || "");
  const { data: comments, isLoading: isCommentsLoading } = useGetCommentsQuery(id || "");
  const [addComment] = useAddCommentMutation();
  

  const [commentContent, setCommentContent] = useState("");

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await addComment({ postId: id || "", content: commentContent }).unwrap();
      setCommentContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (isPostLoading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      
      <div className="bg-white rounded-md shadow-md p-4 mb-4">
        <h1 className="text-lg font-bold">{post.title}</h1>
        {post.postType === "image" && post.mediaUrl && (
          <img src={post.mediaUrl} alt={post.title} className="w-full h-auto rounded-md mt-4" />
        )}
        {post.postType === "text" && <p className="mt-4">{post.content}</p>}
        <div className="text-sm text-gray-500 mt-2">
          Posted by u/{post.author.username} in r/{post.community.name} • {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

     
      <div className="bg-white rounded-md shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Comments</h2>
        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full border border-gray-300 rounded-md p-3 text-sm"
            rows={4}
          ></textarea>
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Comment
          </button>
        </form>
        {isCommentsLoading ? (
          <p>Loading comments...</p>
        ) : (
          <CommentList comments={comments || []} />
        )}
      </div>
    </div>
  );
};

export default PostPage;
