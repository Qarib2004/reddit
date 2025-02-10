import { useState } from "react";
import { useLikePostMutation, useDislikePostMutation } from "../redux/postsSlice";
import { ArrowBigUp, ArrowBigDown, ChevronDown, ChevronUp, MessageSquare, Award, Share2, MoreHorizontal } from "lucide-react";
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
    <div className="pl-4 border-l border-gray-200 mb-2">
      <div className="flex items-start gap-2">
        {/* Vote buttons column */}
        <div className="flex flex-col items-center gap-0.5">
          <button 
            onClick={handleLike}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-orange-500"
          >
            <ArrowBigUp size={16} />
          </button>
          <span className="text-xs font-medium text-gray-900">
            {score}
          </span>
          <button 
            onClick={handleDislike}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-500"
          >
            <ArrowBigDown size={16} />
          </button>
        </div>

        
        <div className="flex-1">
         
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-gray-900">
              u/{comment.author?.username || "anonymous"}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

        
          <div className="mt-1 text-sm text-gray-900">
            {comment.content}
          </div>

          
          <div className="flex items-center gap-2 mt-2">
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-sm">
              <MessageSquare size={14} />
              Reply
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-sm">
              <Award size={14} />
              Award
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-sm">
              <Share2 size={14} />
              Share
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-sm"
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-sm">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

     
      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          <CommentList comments={comment.replies} />
        </div>
      )}
    </div>
  );
};

export default CommentItem;