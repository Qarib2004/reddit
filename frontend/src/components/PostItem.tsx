import { Link } from "react-router-dom";

const PostItem = ({ post }: { post: any }) => {
  return (
    <div className="bg-white shadow-md p-4 mb-4 rounded-md">
      <Link to={`/community/${post.community?._id}`} className="text-blue-500 text-sm font-bold">
        r/{post.community?.name || "Unknown"}
      </Link>

      <h3 className="text-lg font-semibold mt-1">{post.title}</h3>

      
      {post.postType === "image" && post.mediaUrl ? (
        <img src={post.mediaUrl} alt="Post" className="w-full h-auto rounded-md mt-2" />
      ) : (
        <p className="text-gray-600 text-sm">{post.content.slice(0, 150)}...</p>
      )}

      <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
        <span>👍 {post.upvotes || 0} Upvotes</span>
        <span>💬 {post.comments?.length || 0} Comments</span>
      </div>
    </div>
  );
};

export default PostItem;
