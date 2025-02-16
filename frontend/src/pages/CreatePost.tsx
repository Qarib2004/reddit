import { useState } from "react";
import { useCreatePostMutation } from "../redux/postsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCommunitiesQuery } from "../redux/communitiesSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { stripHtml } from "../utils/cutTagHtml";
import { clodudinaryLink } from "../utils/cloudinaryLink";
import { ImageIcon, Link2Icon, TypeIcon, Hash, X } from "lucide-react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("text");
  const [file, setFile] = useState<File | null>(null);
  const [community, setCommunity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { data: communities = [] } = useGetCommunitiesQuery();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      e.preventDefault();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileUpload = async () => {
    if (!file) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cloudinary-animals-app");

    try {
      const res = await fetch(clodudinaryLink, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch (error) {
      toast.error("Image loading error");
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !community.trim()) {
      toast.error("Title and community are required");
      return;
    }

    let mediaUrl = null;
    if (postType === "image" && file) {
      mediaUrl = await handleFileUpload();
      if (!mediaUrl) return;
    }

    const postData = {
      title,
      community,
      postType,
      content: postType === "text" ? stripHtml(content.trim()) : "",
      mediaUrl,
      tags,
    };

    try {
      await createPost(postData).unwrap();
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Create a post</h2>
          </div>

          <div className="p-4">
            <div className="mb-6">
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full md:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a community</option>
                {communities.map((c: { _id: string; name: string }) => (
                  <option key={c._id} value={c._id}>
                    r/{c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setPostType("text")}
                className={`flex items-center px-6 py-3 ${
                  postType === "text"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <TypeIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Post</span>
              </button>
              <button
                onClick={() => setPostType("image")}
                className={`flex items-center px-6 py-3 ${
                  postType === "image"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Images & Video</span>
              </button>
              <button
                onClick={() => setPostType("link")}
                className={`flex items-center px-6 py-3 ${
                  postType === "link"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Link2Icon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Link</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {postType === "text" && (
                <div className="relative">
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    placeholder="Text (optional)"
                    className="h-48 mb-12 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {postType === "image" && (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <label className="cursor-pointer block">
                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Drag and drop images or
                      <span className="text-blue-500 ml-1">upload</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  {uploading && (
                    <p className="text-sm text-blue-500 mt-2">Uploading...</p>
                  )}
                </div>
              )}

              {postType === "link" && (
                <input
                  type="url"
                  placeholder="URL"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={(e) => setContent(e.target.value)}
                />
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Add tags..."
                    className="flex-1 border-b border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || uploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || uploading ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;