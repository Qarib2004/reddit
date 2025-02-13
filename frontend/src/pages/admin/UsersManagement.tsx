import { useState } from "react";
import { Search, Shield, UserCog, Users, XCircle } from "lucide-react";
import { useGetAllUsersQuery, useBanUserMutation, useUpdateUserRoleMutation } from "../../redux/adminSlice";

const UsersManagement = () => {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [banUser] = useBanUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(search.toLowerCase()) &&
    (filterRole === "all" || user.role === filterRole)
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500 inline-block mr-1" />;
      case 'moderator':
        return <UserCog className="w-4 h-4 text-blue-500 inline-block mr-1" />;
      default:
        return <Users className="w-4 h-4 text-gray-500 inline-block mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">User Management</h2>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.banned 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.banned ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${
                          user.banned
                            ? 'border-green-600 text-green-600 hover:bg-green-50'
                            : 'border-red-600 text-red-600 hover:bg-red-50'
                        }`}
                        onClick={() => banUser(user._id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {user.banned ? 'Unban' : 'Ban'}
                      </button>
                      <select
                        className="form-select px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        defaultValue={user.role}
                        onChange={(e) => updateUserRole({ id: user._id, role: e.target.value })}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;