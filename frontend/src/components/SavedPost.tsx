import { Loader } from "lucide-react";
import { useGetPostByIdQuery } from "../redux/postsSlice";
import PostItem from "./PostItem";

const SavedPost = ({ postId }: { postId: string }) => {
    const { data: post, isLoading } = useGetPostByIdQuery(postId);
  
    if (isLoading)  return <Loader />;
    if (!post) return <p className="text-gray-500">Post not found</p>;
  
    return <PostItem post={post} />;
  };
  
  export default SavedPost;