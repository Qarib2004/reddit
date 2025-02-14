import { toast } from "react-toastify";
import { useGetModeratorRequestsQuery, useUpdateModeratorRequestMutation } from "../../redux/adminSlice";
import { Users, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const AdminModeratorRequests = () => {
  const { data: requests, isLoading, refetch } = useGetModeratorRequestsQuery();
  const [updateModeratorRequest] = useUpdateModeratorRequestMutation();

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateModeratorRequest({ id, status }).unwrap();
      refetch();
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error("Failed to update request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Moderator Requests</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {requests?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No pending moderator requests
            </div>
          ) : (
            requests?.map((user) => (
              <div
                key={user._id}
                className="p-6 sm:py-6 sm:px-8 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-900">
                      {user.username}
                    </span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={() => handleAction(user._id, "approved")}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(user._id, "rejected")}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModeratorRequests;