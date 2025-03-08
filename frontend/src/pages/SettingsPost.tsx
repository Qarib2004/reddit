import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../redux/apiSlice";
import { useGetPostByIdQuery, useUpdatePostMutation, useDeletePostMutation } from "../redux/postsSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { stripHtml } from "../utils/cutTagHtml";
import Swal from "sweetalert2"; 
import "sweetalert2/dist/sweetalert2.min.css"; 
import { Helmet } from "react-helmet-async";


const SettingsPost = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading: postLoading, refetch } = useGetPostByIdQuery(id!);
  const { data: user } = useGetUserQuery();
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postType, setPostType] = useState<string>("text");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setPostType(post.postType || "text");
      setMediaUrl(post.mediaUrl || "");
      setShowImagePreview(post.postType === "image" && !!post.mediaUrl);
    }
  }, [post]);

  const isOwner = post?.author?._id === user?._id;

  if (!id) {
    return <p className="text-red-500 text-center">Invalid post ID</p>;
  }

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    
    const cleanedContent = stripHtml(content.trim());
    
    const updateData: any = {
      id,
      title,
      postType
    };
    
    if (postType === "text") {
      updateData.content = cleanedContent;
    } else if (postType === "image") {
      updateData.mediaUrl = mediaUrl;
    }

    try {
      await updatePost(updateData).unwrap();
      toast.success("Post updated successfully!");
      refetch();
      navigate(`/post/${id}`);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update post");
    }
  };

  const handleDeletePost = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePost(id!).unwrap();
          toast.success("Post deleted successfully!");
          navigate("/");
        } catch (error: any) {
          toast.error(error.data?.message || "Failed to delete post");
        }
      }
    });
  };

  const handleMediaUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaUrl(e.target.value);
    setShowImagePreview(!!e.target.value);
  };

  if (postLoading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <>
    <Helmet>
        <title>Settings Post</title>
      </Helmet>
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>

      {!isOwner ? (
        <p className="text-red-500">You are not the owner of this post.</p>
      ) : (
        <form onSubmit={handleUpdatePost} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />

          <div className="flex space-x-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="text"
                checked={postType === "text"}
                onChange={() => setPostType("text")}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Text Post</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="image"
                checked={postType === "image"}
                onChange={() => setPostType("image")}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Image Post</span>
            </label>
          </div>

          {postType === "text" && (
            <ReactQuill
              value={content}
              onChange={setContent}
              className="h-48 mb-12 border border-gray-300 rounded-md"
            />
          )}

          {postType === "image" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Image URL"
                value={mediaUrl}
                onChange={handleMediaUrlChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              
              {showImagePreview && mediaUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Image Preview:</p>
                  <img 
                    src={mediaUrl} 
                    alt="Preview" 
                    className="max-h-64 rounded-md border border-gray-300"
                    onError={() => {
                      toast.error("Invalid image URL");
                      setShowImagePreview(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Post"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeletePost}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Post"}
            </button>
          </div>
        </form>
      )}
    </div>
    </>
  );
};

export default SettingsPost;