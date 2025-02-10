import { useState } from "react";
import { useLikePostMutation, useDislikePostMutation } from "../redux/postsSlice";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Award, Share2, MoreHorizontal } from "lucide-react";
import CommentList from "./CommentList";

const CommentItem = ({ comment }: { comment: any }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [likeComment] = useLikePostMutation();
  const [dislikeComment] = useDislikePostMutation();

  const handleLike = async () => {
    try {
      await likeComment(comment._id).unwrap();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async () => {
    try {
      await dislikeComment(comment._id).unwrap();
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const score = (comment.upvotes || 0) - (comment.downvotes || 0);

  return (
    <div className="group">
      <div className="flex gap-2">
        
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-orange-500"
            aria-label="Upvote"
          >
            <ArrowBigUp size={16} />
          </button>
          <span className="text-xs font-medium text-gray-900 my-1">{score}</span>
          <button
            onClick={handleDislike}
            className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-blue-500"
            aria-label="Downvote"
          >
            <ArrowBigDown size={16} />
          </button>
        </div>

        
        <div className="flex-1 min-w-0">
          
          <div className="flex items-center gap-1 text-xs">
            <span className="font-medium text-gray-900 hover:underline cursor-pointer">
              u/{comment.author?.username || "anonymous"}
            </span>
            <span className="text-gray-400 mx-1">•</span>
            <span className="text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

         
          <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap break-words">
            {comment.content}
          </div>

         
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
              <MessageSquare size={14} />
              <span>Reply</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
              <Award size={14} />
              <span>Give Award</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

    
      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 pl-4 border-l border-gray-200">
          <CommentList comments={comment.replies} />
        </div>
      )}
    </div>
  );
};

export default CommentItem;