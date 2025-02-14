import { useEffect, useState } from "react";
import {
  useGetFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from "../redux/friendsSlice";
import { Check, X, UserPlus2, Loader } from "lucide-react";

const FriendRequests = () => {
  const { data: friendRequests, refetch, isLoading, error } = useGetFriendRequestsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [rejectRequest] = useRejectFriendRequestMutation();
  const [requests, setRequests] = useState(friendRequests || []);

  useEffect(() => {
    if (friendRequests) {
      setRequests(friendRequests);
    }
  }, [friendRequests]);

  const handleAccept = async (requestId: string) => {
    try {
      console.log(`Sending a request for friendship: ${requestId}`);
      const response = await acceptRequest(requestId).unwrap();
      console.log("Server response (acceptance):", response);

      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      refetch();
    } catch (error) {
      console.error("Mistake when accepting a request for friends:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      console.log(`Sending a query to deviate friendship: ${requestId}`);
      const response = await rejectRequest(requestId).unwrap();
      console.log("Server response (deviation):", response);

      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      refetch();
    } catch (error) {
      console.error("An error when deviating a request for friends:", error);
    }
  };

  if (isLoading)  return <Loader />;
  if (error)  return <Loader />;

  return (
    <div className="fixed right-4 top-16 w-full max-w-sm transform rounded-lg bg-white shadow-xl transition-all sm:right-8 md:max-w-md">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 p-4">
        <UserPlus2 className="h-5 w-5 text-orange-500" />
        <h3 className="text-base font-medium text-gray-900">Friend Requests</h3>
        {requests.length > 0 && (
          <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
            {requests.length}
          </span>
        )}
      </div>
      
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-2">
        {requests.length > 0 ? (
          <div className="space-y-2">
            {requests.map((request) => (
              <div
                key={request._id}
                className="group relative flex items-center gap-3 rounded-md border border-gray-100 bg-white p-3 hover:border-gray-200"
              >
                <img
                  src={request.avatar || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"}
                  alt={`${request.username}'s avatar`}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{request.username}</h4>
                  <p className="text-xs text-gray-500">Wants to be your friend</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="rounded bg-orange-500 p-1.5 text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    title="Accept request"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="rounded bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    title="Reject request"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <UserPlus2 className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-center text-sm text-gray-500">
              No pending friend requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
