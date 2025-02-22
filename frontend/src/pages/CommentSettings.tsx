import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateCommentMutation } from "../redux/commentsSlice";
import { toast } from "react-toastify";
import { X, Save } from "lucide-react";

const CommentSettings = ({ comment }: { comment: any }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState(comment.content || "");
  const [updateComment, { isLoading }] = useUpdateCommentMutation();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      await updateComment({ id: comment._id, content }).unwrap();
      toast.success("Comment updated successfully!");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update comment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#DAE0E6] py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-medium text-gray-900">Edit Comment</h2>
          <p className="text-sm text-gray-500 mt-1">
            Make your changes below. Be mindful of the community guidelines.
          </p>
        </div>
        
        <form onSubmit={handleUpdate} className="p-4">
          <div className="space-y-4">
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[160px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-[16px] placeholder-gray-400 resize-y"
                placeholder="What are your thoughts?"
                rows={6}
              />
              <div className="text-xs text-gray-500 mt-1">
                Markdown formatting is supported
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-[#FF4500] hover:bg-[#FF5722] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSettings;