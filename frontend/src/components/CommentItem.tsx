import { useState, useEffect, useRef } from "react";
import {
  useLikeCommentMutation,
  useDislikeCommentMutation,
  useReplyToCommentMutation,
  useReportCommentMutation,
  
} from "../redux/commentsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Award,
  Share2,
  MoreHorizontal,
  Flag
} from "lucide-react";
import ReplyItem from "./ReplyItem";
import UserModal from "./UserModal";
import { Comment } from "../interface/types";
import toast from "react-hot-toast";

const CommentItem = ({ comment }: { comment: Comment }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userInfoRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [likeComment] = useLikeCommentMutation();
  const [dislikeComment] = useDislikeCommentMutation();
  const [replyToComment] = useReplyToCommentMutation();
  const { data: user, refetch } = useGetUserQuery();
  const [reportComment] = useReportCommentMutation();

  const [likes, setLikes] = useState(comment.upvotes?.length || 0);
  const [dislikes, setDislikes] = useState(comment.downvotes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isRepliesCollapsed, setIsRepliesCollapsed] = useState(false);
   const [reportReason, setReportReason] = useState("");
   const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLiked(comment.upvotes?.includes(user._id) || false);
      setIsDisliked(comment.downvotes?.includes(user._id) || false);
    }
  }, [comment.upvotes, comment.downvotes, user]);

  const handleLike = async () => {
    try {
      const response = await likeComment(comment._id).unwrap();
      setLikes(response.upvotes.length);
      setDislikes(response.downvotes.length);
      setIsLiked(true);
      setIsDisliked(false);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await dislikeComment(comment._id).unwrap();
      setLikes(response.upvotes.length);
      setDislikes(response.downvotes.length);
      setIsLiked(false);
      setIsDisliked(true);
    } catch (error) {
      console.error("Error disliking comment:", error);
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
        postId: comment.post,
        parentId: comment._id,
        content: replyContent,
      }).unwrap();

      setIsReplying(false);
      setReplyContent("");
      refetch();
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };


  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }
    modalTimeoutRef.current = setTimeout(() => {
      setHoveredUserId(comment.author._id);
      setIsUserModalOpen(true);
    }, 300); 
  };

  const handleMouseLeave = () => {
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }
    setTimeout(() => {
      if (!modalRef.current?.matches(":hover")) {
        setIsUserModalOpen(false);
        setHoveredUserId(null);
      }
    }, 200);
  };

  const handleReportComment = async () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for the report.");
      return;
    }
  
    try {
      const response = await reportComment({ commentId: comment._id, reason: reportReason }).unwrap();
      console.log("Report successful:", response);
      toast.success("Comment reported successfully!");
      setShowReportModal(false);
      setReportReason("");
    } catch (error) {
      console.error(" Error reporting comment:", error);
      toast.error("Failed to report comment.");
    }
  };
  


  return (
    <div className="group relative">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            className={`p-1 hover:bg-gray-100 rounded ${
              isLiked ? "text-orange-500" : "text-gray-400 hover:text-orange-500"
            }`}
          >
            <ArrowBigUp size={16} />
          </button>
          <span className="text-xs font-medium text-gray-900">{likes - dislikes}</span>
          <button
            onClick={handleDislike}
            className={`p-1 hover:bg-gray-100 rounded ${
              isDisliked ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
            }`}
          >
            <ArrowBigDown size={16} />
          </button>
        </div>

        <div className="flex-1">
          <div
            className="flex items-center gap-2 text-xs cursor-pointer relative"
            ref={userInfoRef}
            onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
            <img
            
              src={comment.author.avatar || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"}
              alt="avatar"
              className="w-6 h-6 rounded-full"
            
            />
            <span className="font-medium text-gray-900">u/{comment.author?.username || "anonymous"}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>

            
            {isUserModalOpen && hoveredUserId === comment.author._id && (
              <div
                ref={modalRef}
                className="absolute top-8 left-0 z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
                onMouseEnter={() => setIsUserModalOpen(true)}
                onMouseLeave={handleMouseLeave}
              >
                <UserModal userId={comment.author._id} onClose={() => setIsUserModalOpen(false)} />
              </div>
            )}
          </div>

          <div className="mt-1 text-sm text-gray-900">{comment.content}</div>

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <button onClick={handleReplyToggle} className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md">
              <MessageSquare size={14} />
              <span>Reply</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md">
              <Award size={14} />
              <span>Award</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md">
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <MoreHorizontal size={14} />
              
            </button>

           
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-2 px-3 py-2  text-left hover:bg-gray-100 text-red-500"
                >
                  <Flag size={14} />
                  Report
                </button>
              
          </div>

          {showReportModal && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Report Comment</h3>
            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="Enter reason..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-1.5 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReportComment}
                className="px-4 py-1.5 bg-red-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-3 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-y"
                placeholder="Reply to this comment..."
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleReplyToggle} className="px-4 py-1.5 text-sm font-medium text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={!replyContent.trim()} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  Reply
                </button>
              </div>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <>
              <button onClick={() => setIsRepliesCollapsed(!isRepliesCollapsed)} className="mt-2 text-xs text-gray-500 hover:underline">
                {isRepliesCollapsed ? "Show replies" : "Hide replies"}
              </button>
              {!isRepliesCollapsed &&
                comment.replies.map((reply: Comment) => (
                  <ReplyItem key={reply._id} reply={reply} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
