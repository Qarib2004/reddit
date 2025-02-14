import { useGetUsersWithWarningsQuery, useIssueWarningMutation } from "../../redux/moderatorSlice";
import { toast } from "react-toastify";

const ModeratorWarnings = () => {
  const { data: users, isLoading } = useGetUsersWithWarningsQuery();
  const [issueWarning] = useIssueWarningMutation();

  const handleWarn = async (id: string) => {
    try {
      await issueWarning(id).unwrap();
      toast.success("Warning issued successfully!");
    } catch (error) {
      toast.error("Failed to issue warning");
    }
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Warnings</h2>
      {users?.length ? (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user._id} className="p-4 border rounded-lg shadow-md">
              <p className="font-semibold">{user.username}</p>
              {user.warnings.length > 0 ? (
                <ul className="mt-2 space-y-2 text-sm">
                  {user.warnings.map((warning, index) => (
                    <li key={index} className="p-2 bg-gray-100 rounded-md">
                      <p><strong>Reason:</strong> {warning.reason}</p>
                      <p><strong>Issued By:</strong> {warning.issuedBy}</p>
                      <p><strong>Date:</strong> {new Date(warning.timestamp).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No warnings yet.</p>
              )}
              <button
                onClick={() => handleWarn(user._id)}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Issue Warning
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users with warnings.</p>
      )}
    </div>
  );
};

export default ModeratorWarnings;
