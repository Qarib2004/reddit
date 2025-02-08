import { useState } from "react";
import { useCreatePostMutation } from "../redux/postsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCommunitiesQuery } from "../redux/communitiesSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { stripHtml } from "../utils/cutTagHtml";
import { clodudinaryLink } from "../utils/cloudinaryLink";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("text");
  const [file, setFile] = useState<File | null>(null);
  const [community, setCommunity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { data: communities = [] } = useGetCommunitiesQuery();
  const navigate = useNavigate();

 
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

      if (data.secure_url) {
        setPreviewUrl(data.secure_url); 
        return data.secure_url;
      } else {
        throw new Error("Ошибка загрузки файла в Cloudinary");
      }
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      toast.error("Ошибка загрузки файла");
      setUploading(false);
      return null;
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!community.trim()) {
      toast.error("Please select a community");
      return;
    }

    let mediaUrl = null;
    if (postType === "image" && file) {
      mediaUrl = await handleFileUpload();
      if (!mediaUrl) return;
    }

    const postData: {
      title: string;
      content?: string;
      community: string;
      postType: string;
      mediaUrl?: string;
    } = {
      title,
      community,
      postType,
    };

    if (postType === "text") {
      postData.content = stripHtml(content.trim()) || " ";
    }

    if (mediaUrl) {
      postData.mediaUrl = mediaUrl;
    }

    console.log("Post Data:", postData);
    try {
      await createPost(postData).unwrap();
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>

      
      <div className="mb-4">
        <select
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          className="w-full border rounded-md px-4 py-2"
        >
          <option value="">Select a community</option>
          {communities.map((c: { _id: string; name: string }) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      
      <div className="flex border-b mb-4">
        {["text", "image", "link"].map((type) => (
          <button
            key={type}
            onClick={() => setPostType(type)}
            className={`px-4 py-2 ${
              postType === type ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
            }`}
          >
            {type === "text" ? "Text" : type === "image" ? "Images & Video" : "Link"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
       
        <input
          type="text"
          placeholder="Title*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-md px-4 py-2 w-full"
        />

        
        {postType === "text" && (
          <div>
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Write something amazing..."
              className="h-40"
            />
          </div>
        )}

       
        {postType === "image" && (
          <div className="border-dashed border-2 border-gray-300 p-4 rounded-md">
            <label className="block text-center text-gray-500">
              Drag and Drop or upload media
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {uploading && <p className="text-blue-500 text-center">Uploading...</p>}
          </div>
        )}

       
        {postType === "link" && (
          <input
            type="url"
            placeholder="Link URL*"
            className="border rounded-md px-4 py-2 w-full"
            onChange={(e) => setContent(e.target.value)}
          />
        )}

       
        <div className="flex justify-end space-x-2">
          <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
            Save Draft
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || uploading}
          >
            {isLoading || uploading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
