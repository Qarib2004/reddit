import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetUserQuery, useUpdateUserMutation } from "../redux/apiSlice";
import { useGetPostsQuery } from "../redux/postsSlice";
import {
  Camera,
  Share2,
  Plus,
  Award,
  User,
  Shield,
  Link as LinkIcon,
  Bookmark,
  MessageSquare,
  Edit,
  Calendar,
  Trophy,
  Settings,
  ExternalLink,X
} from "lucide-react";
import PostItem from "../components/PostItem";
import SavedPost from "../components/SavedPost";
import { clodudinaryLink } from "../utils/cloudinaryLink";

const UserDetails = () => {
  const { data: user, isLoading, refetch } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [sort, setSort] = useState("hot");
  const [search, setSearch] = useState("");
  const { data: posts } = useGetPostsQuery({ sort, search });
  const [activeTab, setActiveTab] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState<"avatar" | "banner">("avatar");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(user?.avatar);

  const openModal = (type: "avatar" | "banner") => {
    setEditType(type);
    setIsModalOpen(true);
  };

  const handleUpload = async () => {
    if (!file && !url) return alert("Please select a file or enter a URL!");

    let imageUrl = url;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cloudinary-animals-app");

      const res = await fetch(clodudinaryLink, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      imageUrl = data.secure_url;
    }

    await updateUser({ [editType]: imageUrl }).unwrap();
    setLocalAvatar(imageUrl);
    setIsModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }



  const formatDate = (date: string | number) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#DAE0E6]">
      
      <div
        className="relative h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            "https://cdn.wallpapersafari.com/16/35/wPfLC1.jpg"
          })`,
        }}
      >
        <button
          onClick={() => openModal("banner")}
          className="absolute right-4 top-4 bg-white/90 p-2 rounded-full hover:bg-white transition"
        >
          <Camera className="text-gray-700 w-5 h-5" />
        </button>
      </div>

      
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative -mt-16 mb-4 flex flex-col md:flex-row gap-6">
         
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white relative shadow-md">
              <img
                src={
                  user?.avatar ||
                  "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"
                }
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
              <button
                onClick={() => openModal("avatar")}
                className="absolute -right-2 -bottom-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition"
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

         
          <div className="flex-grow pt-4 md:pt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.username}
                </h1>
                <p className="text-gray-600 text-sm">u/{user.username}</p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <button className="px-4 py-1.5 bg-white rounded-full border border-gray-300 hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium shadow-sm">
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </button>
                <Link
                  to="/create-post"
                  className="px-4 py-1.5 bg-[#FF4500] text-white rounded-full hover:bg-[#FF5722] transition flex items-center gap-2 text-sm font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Post
                </Link>
              </div>
            </div>
          </div>
        </div>

       
        {isModalOpen && (
          <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center  flex  bg-[rgba(0,0,0,0.5)] z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4">Upload {editType}</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full mb-4 border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Or enter image URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full mb-4 border border-gray-300 rounded-md p-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {uploading ? "Uploading..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      
      <nav className="border-b border-gray-300 mb-4 bg-white rounded-t-md shadow-sm">
        <ul className="flex overflow-x-auto">
          {["Overview", "Posts", "Saved", "Comments"].map((item) => (
            <li key={item}>
              <button
                className={`px-6 py-3 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium
                    ${
                      activeTab === item
                        ? "border-b-2 border-[#FF4500] text-[#FF4500]"
                        : "text-gray-700"
                    }`}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      
      <div className="grid md:grid-cols-3 gap-4">
        
        <div className="md:col-span-2 space-y-4">
          {activeTab === "Overview" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center space-y-4">
                <img
                  src="https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"
                  alt="Default Avatar"
                  className="w-24 h-24 mx-auto opacity-50"
                />
                <p className="text-gray-600">
                  u/{user.username} hasn't posted anything yet
                </p>
              </div>
            </div>
          )}

          {activeTab === "Posts" && (
            <div className="space-y-4">
              {posts?.length ? (
                posts.map((post) => <PostItem key={post._id} post={post} />)
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <p className="text-gray-600">No posts yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "Saved" && (
            <div className="space-y-4">
              {user.savedPosts?.length ? (
                user.savedPosts.map((postId) => (
                  <SavedPost key={postId} postId={postId} />
                ))
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <Bookmark className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">No saved posts</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "Comments" && (
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">No comments yet</p>
            </div>
          )}
        </div>

      
        <div className="space-y-4">

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-bold text-sm text-gray-900 mb-4">STATS</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-gray-900">{user.karma || 0}</p>
                <p className="text-xs text-gray-600">Karma points</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">{posts?.length || 0}</p>
                <p className="text-xs text-gray-600">Total posts</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {formatDate(user.createdAt || Date.now())}
                </p>
                <p className="text-xs text-gray-600">Cake day</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {user.savedPosts?.length || 0}
                </p>
                <p className="text-xs text-gray-600">Saved items</p>
              </div>
            </div>
          </div>

         
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-gray-900">ACHIEVEMENTS</h2>
              <button className="text-xs text-[#FF4500] font-medium hover:text-[#FF5722]">
                View All
              </button>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600">2 achievements unlocked</p>
          </div>

          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-bold text-sm text-gray-900 mb-4">SETTINGS</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Profile</p>
                    <p className="text-xs text-gray-600">
                      Customize your profile
                    </p>
                  </div>
                </div>
                <Edit className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Preferences
                    </p>
                    <p className="text-xs text-gray-600">
                      Manage your settings
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-bold text-sm text-gray-900 mb-4">LINKS</h2>
            <button className="flex items-center gap-2 text-[#FF4500] text-sm font-medium hover:text-[#FF5722] transition-colors duration-200">
              <LinkIcon className="w-4 h-4" />
              Add Social Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
