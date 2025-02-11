import { useState, useEffect } from "react";
import {
  useLikeReplyMutation,
  useDislikeReplyMutation,
  useReplyToCommentMutation,
} from "../redux/commentsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Award,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { Comment } from "../interface/types";

const ReplyItem = ({ reply }: { reply: Comment }) => {
  const [likeReply] = useLikeReplyMutation();
  const [dislikeReply] = useDislikeReplyMutation();
  const [replyToComment] = useReplyToCommentMutation();
  const { data: user, refetch } = useGetUserQuery(); 

  const [likes, setLikes] = useState(reply.upvotes?.length || 0);
  const [dislikes, setDislikes] = useState(reply.downvotes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (user) {
      setIsLiked(reply.upvotes?.includes(user._id) || false);
      setIsDisliked(reply.downvotes?.includes(user._id) || false);
    }
  }, [reply.upvotes, reply.downvotes, user]);

  const handleLike = async () => {
    try {
      const response = await likeReply(reply._id).unwrap();
      setLikes(response.upvotes.length);
      setDislikes(response.downvotes.length);
      setIsLiked(true);
      setIsDisliked(false);
      refetch();
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await dislikeReply(reply._id).unwrap();
      setLikes(response.upvotes.length);
      setDislikes(response.downvotes.length);
      setIsLiked(false);
      setIsDisliked(true);
      refetch();
    } catch (error) {
      console.error("Error disliking reply:", error);
    }
  };

  const handleReplyToggle = () => {
    setIsReplying(!isReplying);
    setReplyContent("");
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await replyToComment({
        postId: reply.post,
        parentId: reply._id,
        content: replyContent,
      }).unwrap();

      setIsReplying(false);
      setReplyContent("");
      refetch(); 
    } catch (error) {
      console.error("Error replying to reply:", error);
    }
  };

  return (
    <div className="group pl-6 border-l border-gray-200">
      <div className="flex gap-2">
        
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            className={`p-1 hover:bg-gray-50 rounded ${
              isLiked ? "text-orange-500" : "text-gray-400 hover:text-orange-500"
            }`}
            aria-label="Upvote"
          >
            <ArrowBigUp size={16} />
          </button>
          <span className="text-xs font-medium text-gray-900 my-1">
            {likes - dislikes}
          </span>
          <button
            onClick={handleDislike}
            className={`p-1 hover:bg-gray-50 rounded ${
              isDisliked ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
            }`}
            aria-label="Downvote"
          >
            <ArrowBigDown size={16} />
          </button>
        </div>

        
        <div className="flex-1 min-w-0">
         
          <div className="flex items-center gap-1 text-xs">
            <span className="font-medium text-gray-900 hover:underline cursor-pointer">
              u/{reply.author?.username || "anonymous"}
            </span>
            <span className="text-gray-400 mx-1">•</span>
            <span className="text-gray-500">
              {new Date(reply.createdAt).toLocaleString()}
            </span>
          </div>

         
          <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap break-words">
            {reply.content}
          </div>

          
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleReplyToggle}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
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

        
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-3 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-y"
                placeholder="Reply to this comment..."
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleReplyToggle}
                  className="px-4 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

     
      {reply.replies && reply.replies.length > 0 && (
        <div className="mt-2">
          {reply.replies.map((nestedReply: Comment) => (
            <ReplyItem key={nestedReply._id} reply={nestedReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyItem;
