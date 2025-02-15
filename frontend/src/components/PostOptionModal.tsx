import React from 'react';
import { useReportPostMutation, useHidePostMutation, useShowFewerPostsMutation } from "../redux/postsSlice";
import { Flag, EyeOff, ThumbsDown } from 'lucide-react';
import { toast } from "react-toastify";

interface PostOptionsModalProps {
  postId: string;
  closeModal: () => void;
}

const PostOptionsModal: React.FC<PostOptionsModalProps> = ({ postId, closeModal }) => {
  const [reportPost] = useReportPostMutation();
  const [hidePost] = useHidePostMutation();
  const [showFewerPosts] = useShowFewerPostsMutation();

  const handleReport = async () => {
    try {
      await reportPost(postId).unwrap();
      toast.success("Post reported successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to report post");
    }
  };

  const handleHidePost = async () => {
    try {
      await hidePost(postId).unwrap();
      toast.success("Post hidden successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to hide post");
    }
  };

  const handleShowFewer = async () => {
    try {
      await showFewerPosts(postId).unwrap();
      toast.success("You'll see fewer posts like this");
      closeModal();
    } catch (error) {
      toast.error("Failed to update preference");
    }
  };

  return (
    <div className="absolute  z-50  right-0  shadow-lg rounded-md p-2 w-48" onClick={closeModal}>
      <div 
        className="relative bg-white  dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-[280px] sm:w-[280px] overflow-hidden mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2">
          <button 
            onClick={handleReport}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <Flag className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-200">Report Post</span>
          </button>
          
          <button 
            onClick={handleHidePost}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <EyeOff className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-200">Hide</span>
          </button>
          
          <button 
            onClick={handleShowFewer}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <ThumbsDown className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-200">Show fewer posts like this</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostOptionsModal;