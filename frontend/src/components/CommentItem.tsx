import { useState } from "react";
import { useLikePostMutation,useDislikePostMutation } from "../redux/postsSlice";
import { ArrowBigUp, ArrowBigDown, ChevronDown, ChevronUp } from "lucide-react";
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
  
    return (
      <div className="pl-4 border-l-2 border-gray-200 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">
              <span className="font-bold">u/{comment.author?.username || "anonymous"}</span> •{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </div>
            <p className="text-sm text-gray-800">{comment.content}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
  
        
        <div className="flex items-center text-sm mt-2 space-x-4">
          <button onClick={handleLike} className="flex items-center space-x-1 text-gray-500">
            <ArrowBigUp size={16} />
            <span>{comment.upvotes}</span>
          </button>
          <button onClick={handleDislike} className="flex items-center space-x-1 text-gray-500">
            <ArrowBigDown size={16} />
            <span>{comment.downvotes}</span>
          </button>
        </div>
  
        
        {isExpanded && comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            <CommentList comments={comment.replies} />
          </div>
        )}
      </div>
    );
  };

  export default CommentItem;