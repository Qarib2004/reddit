import { Link, useParams } from "react-router-dom";
import {
  useLikePostMutation,
  useDislikePostMutation,
} from "../redux/postsSlice";
import { useGetCommentsQuery } from "../redux/commentsSlice";
import {
  useGetCommunityByIdQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useRejectJoinRequestMutation,
  useRequestToJoinCommunityMutation,
} from "../redux/communitiesSlice";
import { useState, useEffect } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Copy,
  Twitter,
  Facebook,
  Send,
  Bookmark,
  LogOut,
} from "lucide-react";
import {
  useGetUserQuery,
  useSavePostMutation,
  useUpdateUserMutation,
} from "../redux/apiSlice";
import Loader from "../assets/loader-ui/Loader";
import PostOptionsModal from "./PostOptionModal";
import { useGetAllCommunitiesQuery, useGetAllPostsQuery } from "../redux/adminSlice";
import Swal from "sweetalert2"; 
import "sweetalert2/dist/sweetalert2.min.css"; 
import { Post } from "../interface/types";
interface Member {
  _id: string;
}

interface JoinRequest {
  _id: string;
}



const PostItem = ({ post }: { post: Post }) => {
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const [joinCommunity] = useJoinCommunityMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();
  const { data: comments } = useGetCommentsQuery(post._id);
  const { data: user, refetch: refetchUser } = useGetUserQuery();
  const [savePost] = useSavePostMutation();
  const [showOptions, setShowOptions] = useState(false);
  const [requestToJoinCommunity] = useRequestToJoinCommunityMutation();
  const { id } = useParams<{ id: string }>();
  const communityId = post?.community?._id || id || "";
  const {
    data: community,
    isLoading: communityLoading,
    refetch: refetchCommunity,
  } = useGetCommunityByIdQuery(communityId, { skip: !communityId });

  const { data: posts, refetch: refetchPost } = useGetAllPostsQuery();
  
  const isAuthenticated = !!user;
  
  const initialLikes = Array.isArray(post.upvotes) ? post.upvotes.length : 0;
  const initialDislikes = Array.isArray(post.downvotes)
    ? post.downvotes.length
    : 0;

  const [likes, setLikes] = useState<number>(initialLikes);
  const [dislikes, setDislikes] = useState<number>(initialDislikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isSubcscribed, setIsSubscribed] = useState<boolean>(false);
  const [requestPending, setRequestPending] = useState(false);

  const [updateUser] = useUpdateUserMutation();

  if (!post) {
    return <Loader />;
  }

  const isSaved = isAuthenticated ? user.savedPosts?.includes(post._id) : false;
  const userId = user?._id;

 
useEffect(() => {
  if (!isAuthenticated || !post.community) return;

  if (user && post.community) {
    if (community && community.members) {
      const isMember = community.members.some((member: string | Member) => {
        if (typeof member === 'string') {
          return member === user._id;
        }
        return member._id === user._id;
      });
      setIsJoined(!!isMember);
      setIsSubscribed(user.subscriptions?.includes(post.community._id));
    } 
    else {
      const isMember = post.community.members?.some((member: string | Member) => {
        if (typeof member === 'string') {
          return member === user._id;
        }
        return member._id === user._id;
      });
      setIsJoined(!!isMember);
      setIsSubscribed(user.subscriptions?.includes(post.community._id));
    }
  }

  if (user && post.community && post.community.joinRequests) {
    const isPending = Array.isArray(post.community.joinRequests) && 
      post.community.joinRequests.some((request: string | JoinRequest) => {
        if (typeof request === 'string') {
          return request === user._id;
        }
        return request._id === user._id;
      });
    
    setRequestPending(!!isPending);
  }
}, [post.community, user, isAuthenticated, community]);

const handleToggleSubscription = async () => {
  if (!user || !post.community || !post.community._id) {
    Swal.fire({
      icon: "warning",
      title: "Authentication Required",
      text: "Please log in to join communities",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    await refetchUser();
    
    if (isJoined) {
      await leaveCommunity(post.community._id).unwrap();
      setIsJoined(false);
      setIsSubscribed(false);
    } else {
      if (community?.type === "Private") {
        try {
          const response = await requestToJoinCommunity(post.community._id).unwrap();
          setRequestPending(true);
          
          Swal.fire({
            icon: "success",
            title: "Request Sent",
            text: "Your request to join this community has been sent.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (joinError) {
          console.error("Error in private community join request:", joinError);
        }
      } else {
        await joinCommunity(post.community._id).unwrap();
        setIsJoined(true);
        setIsSubscribed(true);
        
        Swal.fire({
          icon: "success",
          title: "Joined Community",
          text: "You have successfully joined the community!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }

    await refetchUser();
    await refetchCommunity();
    await refetchPost();
  } catch (error) {
    console.error("Error in subscription:", error);
    
    Swal.fire({
      icon: "error",
      title: "Action Failed",
      text: "There was an error processing your request. Please try again.",
      confirmButtonText: "OK",
    });
  }
};

  const handleSavePost = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please log in to save posts",
        confirmButtonText: "OK",
      });
      return;
    }
  
    try {
      await savePost(post._id).unwrap();
      refetchUser();
  
      Swal.fire({
        icon: "success",
        title: "Post Saved",
        text: "The post has been successfully saved!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error saving post:", error);
  
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "An error occurred while saving the post. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please log in to like posts",
        confirmButtonText: "OK",
      });
      return;
    }
    
    try {
      const response = await likePost(post._id).unwrap();
      setLikes(response.upvotes.length);
      setDislikes(response.downvotes.length);
      if (userId) {
        setIsLiked(true);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please log in to dislike posts",
        confirmButtonText: "OK",
      });
      return;
    }
    
    try {
      const response = await dislikePost(post._id).unwrap();
      setLikes(response.upvotes.length);
      setDislikes(response.downvotes.length);
      if (userId) {
        setIsDisliked(true);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const postUrl = `${window.location.origin}/post/${post._id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);

    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Link copied to clipboard!",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const getJoinButtonClasses = () => {
    if (!isAuthenticated) {
      return "bg-blue-500 text-white px-3 py-1 rounded-md font-medium cursor-pointer";
    }
    
    if (isJoined) {
      return "bg-gray-300 text-black hover:bg-gray-400 px-3 py-1 rounded-md font-medium cursor-pointer transition";
    }
    
    if (requestPending) {
      return "bg-gray-400 text-white cursor-not-allowed px-3 py-1 rounded-md font-medium";
    }
    
    return "bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-md font-medium cursor-pointer transition";
  };
  const isAuthor = user && post.author && user._id === post.author._id;
  return (
    <div className="bg-white hover:border hover:border-gray-300 rounded-md mb-3">
      <div className="flex">
        
        <div className="bg-gray-50 w-10 flex flex-col items-center py-2 rounded-l-md">
          <button
            onClick={handleLike}
            className={`p-1 rounded ${
              isLiked
                ? "text-orange-500"
                : "text-gray-400 hover:text-orange-500"
            }`}
          >
            <ArrowBigUp size={20} />
          </button>

          <span className="text-xs font-bold my-1">
            {(likes ?? 0) - (dislikes ?? 0)}
          </span>

          <button
            onClick={handleDislike}
            className={`p-1 rounded ${
              isDisliked ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
            }`}
          >
            <ArrowBigDown size={20} />
          </button>
        </div>

        <div className="flex-1 p-2">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              {post.community && (
                <>
                  <Link
                    to={`/community/${post.community._id}`}
                    className="font-bold text-black hover:underline"
                  >
                    r/{post.community.name || "Unknown"}
                  </Link>
                  <span className="mx-1">•</span>
                </>
              )}
              <span>Posted by u/{post.author?.username || "anonymous"}</span>
              <span className="mx-1">•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {post.community && !isAuthor && (
              <button
                onClick={handleToggleSubscription}
                className={getJoinButtonClasses()}
                disabled={requestPending}
              >
                {isJoined ? (
                  <span className="flex items-center gap-1">
                    <LogOut size={14} />
                    Leave
                  </span>
                ) : requestPending ? (
                  "Request"
                ) : (
                  "Join"
                )}
              </button>
            )}
          </div>

          <Link to={`/post/${post._id}`} className="hover:underline">
            <h3 className="text-lg font-medium mb-2">{post.title}</h3>
          </Link>

          {post.postType === "image" && post.mediaUrl ? (
            <Link to={`/post/${post._id}`}>
              <img
                src={post.mediaUrl}
                alt="Post content"
                className="max-h-[512px] w-auto rounded-md"
              />
            </Link>
          ) : (
            <p className="text-gray-800 text-sm">{post.content}</p>
          )}

          <div className="flex items-center space-x-4 mt-3">
            <Link
              to={`/post/${post._id}`}
              className="flex items-center space-x-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md"
            >
              <MessageSquare size={18} />
              <span className="text-xs">{comments?.length || 0} Comments</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-1 text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md"
              >
                <Share2 size={18} />
                <span className="text-xs">Share</span>
              </button>

              {showShareMenu && (
                <div className="absolute top-8 left-0 bg-white border shadow-lg rounded-md p-2 w-44 z-20">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center w-full text-left text-sm py-1 hover:bg-gray-100 px-2"
                  >
                    <Copy size={16} className="mr-2" /> Copy Link
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${postUrl}`}
                    className="flex items-center text-sm py-1 hover:bg-gray-100 px-2"
                  >
                    <Twitter size={16} className="mr-2" /> Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
                    className="flex items-center text-sm py-1 hover:bg-gray-100 px-2"
                  >
                    <Facebook size={16} className="mr-2" /> Facebook
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${postUrl}`}
                    className="flex items-center text-sm py-1 hover:bg-gray-100 px-2"
                  >
                    <Send size={16} className="mr-2" /> Telegram
                  </a>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="flex items-center text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {showOptions && (
                    <PostOptionsModal
                      postId={post._id}
                      closeModal={() => setShowOptions(false)}
                    />
                  )}
                </div>
                <button
                  onClick={handleSavePost}
                  className="text-gray-500 hover:text-blue-500 flex items-center space-x-1 px-2 py-1 rounded-md"
                >
                  <Bookmark
                    size={18}
                    className={isSaved ? "text-blue-500" : "text-gray-400"}
                  />
                  <span className="text-xs">{isSaved ? "Saved" : "Save"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <hr className="mt-2 border-gray-300" />
    </div>
  );
};

export default PostItem;