import { Link } from "react-router-dom";
import { useLikePostMutation, useDislikePostMutation } from "../redux/postsSlice";
import { useGetCommentsQuery, useAddCommentMutation } from "../redux/commentsSlice";
import { useState } from "react";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

const PostItem = ({ post }: { post: any }) => {
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const { data: comments } = useGetCommentsQuery(post._id);
  const [addComment] = useAddCommentMutation();
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await likePost(post._id).unwrap();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async () => {
    try {
      await dislikePost(post._id).unwrap();
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  return (
    <div className="bg-white hover:border hover:border-gray-300 rounded-md mb-3">
      <div className="flex">
       
        <div className="bg-gray-50 w-10 flex flex-col items-center py-2 rounded-l-md">
          <button onClick={handleLike} className="text-gray-400 hover:text-orange-500 hover:bg-gray-100 p-1 rounded">
            <ArrowBigUp size={20} />
          </button>
          <span className="text-xs font-bold my-1">{post.upvotes - post.downvotes || 0}</span>
          <button onClick={handleDislike} className="text-gray-400 hover:text-blue-500 hover:bg-gray-100 p-1 rounded">
            <ArrowBigDown size={20} />
          </button>
        </div>

        
        <div className="flex-1 p-2">
         
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Link to={`/community/${post.community?._id}`} className="font-bold text-black hover:underline">
              r/{post.community?.name || "Unknown"}
            </Link>
            <span className="mx-1">•</span>
            <span>Posted by u/{post.author?.username || "anonymous"}</span>
            <span className="mx-1">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          
          <Link to={`/post/${post._id}`} className="hover:underline">
            <h3 className="text-lg font-medium mb-2">{post.title}</h3>
          </Link>

          
          {post.postType === "image" && post.mediaUrl ? (
            <Link to={`/post/${post._id}`}>
              <img src={post.mediaUrl} alt="Post content" className="max-h-[512px] w-auto rounded-md" />
            </Link>
          ) : (
            <p className="text-gray-800 text-sm">{post.content}</p>
          )}

         
          <div className="flex items-center space-x-4 mt-3">
            <Link
              to={`/post/${post._id}`}
              className="flex items-center space-x-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md"
            >
              <MessageSquare size={18} />
              <span className="text-xs">{comments?.length || 0} Comments</span>
            </Link>
            <button className="flex items-center space-x-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md">
              <Share2 size={18} />
              <span className="text-xs">Share</span>
            </button>
            <button className="flex items-center text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
