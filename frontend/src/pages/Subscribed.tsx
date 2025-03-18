import { useGetSubscribedPostsQuery } from "../redux/postsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import { useGetCommunitiesQuery } from "../redux/communitiesSlice";
import PostItem from "../components/PostItem";
import { Loader, Newspaper } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Subscribed = () => {
  const { data: posts, isLoading: postsLoading, error: postsError } = useGetSubscribedPostsQuery();
  const { data: user, isLoading: userLoading, error: userError } = useGetUserQuery();
  const { data: communities, isLoading: communitiesLoading, error: communitiesError } = useGetCommunitiesQuery();

  if (postsLoading || userLoading || communitiesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader className="animate-spin w-8 h-8 text-orange-500" />
      </div>
    );
  }

  if (postsError || userError || communitiesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg shadow-sm">
          <p className="text-center">Error loading data</p>
        </div>
      </div>
    );
  }

  const subscribedCommunityIds = user?.subscriptions?.map(id => String(id)) || [];
  
  const memberCommunityIds = communities
    ?.filter(community => 
      community.members?.some(member => 
        typeof member === 'string' 
          ? member === String(user?._id)
          : String(member._id) === String(user?._id)
      )
    )
    .map(community => String(community._id)) || [];
  
  const accessibleCommunityIds = [...new Set([...subscribedCommunityIds, ...memberCommunityIds])];
  
  const filteredPosts = posts?.filter(post => {
    if (!post.community || !post.community._id) return false;
    
    const communityId = String((post.community._id as any)["$oid"] || post.community._id);
    
    const communityObject = communities?.find(c => String(c._id) === communityId);
    if (!communityObject) return false;
    
    if (communityObject.type === "Private") {
      return accessibleCommunityIds.includes(communityId);
        } else {
      return accessibleCommunityIds.includes(communityId);
    }
  }) || [];

  return (
    <>
      <Helmet>
        <title>Subscribed</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 mt-[50px] sm:mt-0">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <Newspaper className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Subscribed Posts</h2>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <PostItem post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No posts available</p>
              <p className="text-gray-400 text-sm mt-2">
                There are no posts in the communities you're a member of yet
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Subscribed;