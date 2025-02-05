import { useState } from "react";
import { useCreatePostMutation } from "../redux/postsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCommunitiesQuery } from "../redux/communitiesSlice";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("text"); 
  const [file, setFile] = useState<File | null>(null);
  const [community, setCommunity] = useState("");
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { data: communities = [] } = useGetCommunitiesQuery();
  const navigate = useNavigate();

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
  
    const postData: { title: string; content?: string; community: string; postType: string } = {
      title,
      community,
      postType,
    };
  
    if (postType === "text") {
      postData.content = content.trim() || " "; 
    }
  
    try {
      await createPost(postData).unwrap();
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("❌ Ошибка при создании поста:", error);
      toast.error(error.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
      <h2 className="text-xl font-bold mb-4">Create a Post</h2>

      <select
        value={community}
        onChange={(e) => setCommunity(e.target.value)}
        className="border rounded-md px-4 py-2 w-full mb-4"
      >
        <option value="">Select a community</option>
        {communities.map((c: { id: string; name: string }) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="flex space-x-4 border-b mb-4 overflow-x-auto">
        {["text", "image", "link"].map((type) => (
          <button
            key={type}
            onClick={() => setPostType(type)}
            className={`px-4 py-2 ${
              postType === type ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
            }`}
          >
            {type === "text" ? "Text" : type === "image" ? "Image/Video" : "Link"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border rounded-md px-4 py-2 w-full"
        />

        {postType === "text" && (
          <textarea
            placeholder="Text (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border rounded-md px-4 py-2 w-full min-h-[100px]"
          />
        )}

        {postType === "image" && (
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded-md px-4 py-2 w-full"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
