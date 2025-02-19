import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetCommunityByIdQuery,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useGetJoinRequestsQuery,
  useApproveJoinRequestMutation,
  useRejectJoinRequestMutation,
  useRequestToJoinCommunityMutation,
} from "../redux/communitiesSlice";
import { useGetPostsQuery } from "../redux/postsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import {
  Users,
  Loader2,
  LogOut,
  Bell,
  Check,
  X,
  Calendar,
  Info,
  Settings,
} from "lucide-react";
import PostItem from "../components/PostItem";
import Loader from "../assets/loader-ui/Loader";

const Community = () => {
  const { id } = useParams<{ id: string }>();
  const communityId = id ?? "";
  const requestsButtonRef = useRef<HTMLButtonElement>(null);
  const [requestsPosition, setRequestsPosition] = useState({
    top: 0,
    right: 0,
  });
  const navigate = useNavigate();

  const {
    data: community,
    isLoading: communityLoading,
    refetch: refetchCommunity,
  } = useGetCommunityByIdQuery(communityId, { skip: !communityId });

  const { data: posts = [], isLoading: postsLoading } = useGetPostsQuery(
    { community: communityId },
    { skip: !communityId }
  );

  const { data: user, refetch: refetchUser } = useGetUserQuery();
  const { data: joinRequests = [], refetch: refetchJoinRequests } =
    useGetJoinRequestsQuery(communityId, { skip: !communityId });
  const [requestToJoinCommunity] = useRequestToJoinCommunityMutation();
  const [joinCommunity] = useJoinCommunityMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();
  const [approveJoinRequest] = useApproveJoinRequestMutation();
  const [rejectJoinRequest] = useRejectJoinRequestMutation();
  const [isJoined, setIsJoined] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const [requestPending, setRequestPending] = useState(false);

  useEffect(() => {
    if (!community || !user) return;

    if (
      Array.isArray(community.members) &&
      typeof community.members[0] === "string"
    ) {
      setIsJoined(community.members.includes(user._id));
    } else if (
      Array.isArray(community.members) &&
      typeof community.members[0] === "object"
    ) {
      setIsJoined(community.members.some((member) => member._id === user._id));
    }
  }, [user, community]);

  useEffect(() => {
    if (requestsButtonRef.current && showRequests) {
      const rect = requestsButtonRef.current.getBoundingClientRect();
      setRequestsPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showRequests]);
  const handleToggleSubscription = async () => {
    if (!user || !communityId) return;

    try {
      await refetchUser();

      if (isJoined) {
        await leaveCommunity(communityId).unwrap();
        setIsJoined(false);
      } else {
        if (community?.type === "Private") {
          await requestToJoinCommunity(communityId).unwrap();
          setRequestPending(true);
        } else {
          await joinCommunity(communityId).unwrap();
          setIsJoined(true);
        }
      }

      await refetchUser();
      await refetchCommunity();
    } catch (error: any) {
      console.error("Error joining/leaving community:", error);
    }
  };

  const handleApproveRequest = async (_id: string) => {
    if (!_id) {
      console.error("Error: userId is undefined");
      return;
    }

    try {
      const response = await approveJoinRequest({ communityId, _id }).unwrap();

      if (_id === user?._id) {
        setIsJoined(true);
        setRequestPending(false);
      }

      refetchCommunity();
      refetchJoinRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (_id: string) => {
    if (!_id) {
      console.error("Error: userId is undefined");
      return;
    }

    try {
      await rejectJoinRequest({ communityId, _id }).unwrap();
      if (_id === user?._id) {
        setRequestPending(false);
      }
      refetchJoinRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (communityLoading) return <Loader />;
  if (!community) return <p className="text-center p-4">Community not found</p>;

  const createdAt = new Date(community.createdAt || Date.now());
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#DAE0E6]">
      <div className="h-80 bg-[#1e3a8a] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end pb-6">
              <div className="flex items-center space-x-6">
                <div className="bg-white rounded-full p-6 shadow-lg transform hover:scale-105 transition-transform">
                  <Users className="w-12 h-12 text-[#1e3a8a]" />
                </div>
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">
                    r/{community.name}
                  </h1>
                  <p className="text-lg opacity-90 max-w-2xl">
                    {community.description || "No description available."}
                  </p>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                {joinRequests.length > 0 && (
                  <button
                    ref={requestsButtonRef}
                    onClick={() => setShowRequests((prev) => !prev)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all hover:bg-red-600 shadow-lg"
                  >
                    <Bell size={18} />
                    <span className="font-medium">{joinRequests.length}</span>
                  </button>
                )}

                {!communityLoading &&
                  community &&
                  user &&
                  (typeof community.creator === "string"
                    ? community.creator === user._id
                    : community.creator?._id === user._id) && (
                    <button
                      onClick={() =>
                        navigate(`/community/${communityId}/communitySettings`)
                      }
                      className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center gap-2 hover:bg-gray-700 transition"
                    >
                      <Settings size={18} />
                      Settings
                    </button>
                  )}

                {community?.creator &&
                  user?._id !==
                    (typeof community.creator === "object"
                      ? community.creator._id
                      : community.creator) && (
                    <button
                      onClick={handleToggleSubscription}
                      className={`px-6 py-2 font-medium rounded-full transition shadow-lg ${
                        isJoined
                          ? "bg-white/90 text-[#1e3a8a] hover:bg-white"
                          : requestPending
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-[#1e3a8a] text-white hover:bg-[#142962] border-2 border-white"
                      }`}
                      disabled={requestPending}
                    >
                      {isJoined ? (
                        <span className="flex items-center gap-2">
                          <LogOut size={18} />
                          Leave
                        </span>
                      ) : requestPending ? (
                        "Request Pending"
                      ) : (
                        "Join Community"
                      )}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-grow order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
              <div className="flex items-center justify-between mb-6">
                <Link to="/create-post" className="flex-grow">
                  <div className="bg-gray-100 rounded-full px-6 py-3 hover:bg-gray-200 transition cursor-pointer">
                    <span className="text-gray-500">Create Post</span>
                  </div>
                </Link>
              </div>

              {postsLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.length > 0 ? (
                    posts.map((post) => <PostItem key={post._id} post={post} />)
                  ) : (
                    <div className="text-center py-12">
                      <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No posts yet.</p>
                      <p className="text-gray-400">
                        Be the first to share something!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">About Community</h2>
              <p className="text-gray-600 mb-6">
                {community.description ||
                  "This community doesn't have a description yet."}
              </p>

              <div className="flex items-center gap-4 py-4 border-t border-gray-100">
                <div className="flex-1">
                  <span className="text-2xl font-bold text-[#1e3a8a]">
                    {community.membersCount || 0}
                  </span>
                  <p className="text-sm text-gray-500">Members</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={16} />
                    <span className="text-sm">Created {formattedDate}</span>
                  </div>
                </div>
              </div>

              {showRequests && (
                <div
                  className="fixed bg-white rounded-lg shadow-xl p-4 z-50 w-80"
                  style={{
                    top: `${requestsPosition.top}px`,
                    right: `${requestsPosition.right}px`,
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Join Requests</h3>
                    <button
                      onClick={() => setShowRequests(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {joinRequests.length > 0 ? (
                    <ul className="space-y-3">
                      {joinRequests.map((request) => (
                        <li
                          key={request._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                          <span className="font-medium">
                            {request.username}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveRequest(request._id)}
                              className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No pending requests
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
