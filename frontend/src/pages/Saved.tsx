import { useGetUserQuery } from "../redux/apiSlice";
import { useGetPostByIdQuery } from "../redux/postsSlice"; 
import PostItem from "../components/PostItem";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SavedPost from "../components/SavedPost";

const Saved = () => {
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const savedPostIds = user?.savedPosts ?? [];

  if (userLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
     
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/" className="text-gray-600 hover:text-blue-500">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Saved Posts</h1>
      </div>

     
      {savedPostIds.length === 0 ? (
        <p className="text-gray-500 text-center">You have no saved posts.</p>
      ) : (
        <div className="space-y-4">
          {savedPostIds.map((postId) => (
            <SavedPost key={postId} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};



export default Saved;
