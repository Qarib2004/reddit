import { useGetAllUsersQuery, useBanUserMutation, useUpdateUserRoleMutation } from "../../redux/adminSlice";

const UsersManagement = () => {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [banUser] = useBanUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User management</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.banned ? "Blocked" : "Active"}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => banUser(user._id)}
                >
                  Ban
                </button>
                <select
                  className="border px-2 py-1"
                  defaultValue={user.role}
                  onChange={(e) => updateUserRole({ id: user._id, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
