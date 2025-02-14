import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetCommunityByIdQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
} from "../redux/communitiesSlice";
import { useGetPostsQuery } from "../redux/postsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import { Users, Flag, Loader2, LogOut } from "lucide-react";
import PostItem from "../components/PostItem";
import Loader from "../assets/loader-ui/Loader";

const Community = () => {
  const { id } = useParams<{ id: string }>();
  const communityId = id ?? "";

  const {
    data: community,
    isLoading: communityLoading,
    refetch: refetchCommunity,
  } = useGetCommunityByIdQuery(communityId, { skip: !communityId });

  const { data: posts = [], isLoading: postsLoading } = useGetPostsQuery(
    { community: communityId },
    { skip: !communityId }
  );

  const { data: user,refetch: refetchUser  } = useGetUserQuery();

  const [joinCommunity] = useJoinCommunityMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (user && community) {
      setIsJoined(user.subscriptions?.includes(community._id) || false);
    }
  }, [user, community]);

  const handleToggleSubscription = async () => {
    try {
      if (isJoined) {
        await leaveCommunity(communityId).unwrap();
      } else {
        await joinCommunity(communityId).unwrap();
      }
      setIsJoined(!isJoined);
      await refetchUser(); 
      refetchCommunity(); 
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };
  
  if (communityLoading)
    return <Loader />;
  if (!community)
    return <p className="text-center p-4"> Community not found</p>;

  return (
    <div className="min-h-screen bg-gray-100">
    
      <div className="h-32 bg-[#1e3a8a] relative">
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-end pb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <Users className="w-8 h-8 text-[#1e3a8a]" />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">r/{community.name}</h1>
                  <p className="text-sm opacity-90">
                    {community.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-6">
         
          <div className="flex-grow">
            <div className="bg-white rounded-md shadow mb-4 p-4">
              <div className="flex items-center justify-between mb-4">
                <Link to="/create-post">
                  <button className="px-4 py-2 bg-[#1e3a8a] text-white rounded-full font-medium transition hover:bg-[#142962]">
                    Create Post
                  </button>
                </Link>
                <span className="text-gray-500 text-sm">{posts.length} posts</span>
              </div>

              {postsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.length > 0 ? (
                    posts.map((post) => <PostItem key={post._id} post={post} />)
                  ) : (
                    <p className="text-gray-500 text-center">No posts yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

         
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-md shadow p-4">
             
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">About Community</h2>
                <p className="text-sm text-gray-600">
                  {community.description || "This community doesn't have a description yet."}
                </p>
              </div>

              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">{community.membersCount || "N/A"}</span>
                  <span className="text-sm text-gray-500">Members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">151</span>
                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>

              
              <div className="border-t mt-4 pt-4">
                <button
                  onClick={handleToggleSubscription}
                  className={`w-full py-2 font-medium rounded-full transition ${
                    isJoined ? "bg-gray-300 text-black hover:bg-gray-400" : "bg-[#1e3a8a] text-white hover:bg-[#142962]"
                  }`}
                >
                  {isJoined ? (
                    <span className="flex items-center justify-center gap-1">
                      <LogOut size={16} />
                      Leave
                    </span>
                  ) : (
                    "Join"
                  )}
                </button>
              </div>

            
              <div className="border-t mt-4 pt-4">
                <h3 className="font-medium mb-2">Community Rules</h3>
                <ol className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Follow Reddit's site-wide rules</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Be respectful to others</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>No spam or self-promotion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Use appropriate language</span>
                  </li>
                </ol>
              </div>

              
              <div className="border-t mt-4 pt-4 flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                <Flag size={16} />
                <span>Report Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
