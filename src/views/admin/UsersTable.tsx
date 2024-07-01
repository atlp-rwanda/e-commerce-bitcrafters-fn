import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import RoleChangeModal from "../../components/RoleChange";
import axiosClient from "../../hooks/AxiosInstance";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  email: string;
  userRole: string;
  status: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = axiosClient();
  const notify = (message: string) => toast(message);

  const fetchUsers = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await client.get(`/users?page=${pageNumber}`);
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err: any) {
      notify(
        err.response ? err.response.data.message : "Fetching users failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const openModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.userRole);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const saveRole = async (newRole: string) => {
    if (selectedUser) {
      setIsLoading(true);
      try {
        await client.post(`/users/ChangeRole/${selectedUser.id}`, { newRole });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, userRole: newRole } : user,
          ),
        );
        notify("Role updated successfully");
      } catch (err: any) {
        notify(
          err.response ? err.response.data.message : "Failed to update role",
        );
      } finally {
        setIsLoading(false);
        setSelectedUser(null);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 bg-white">Latest Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border-b border-gray-200 bg-gray-100 text-left">
                S/N
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-xs text-left">
                Names
              </th>
              <th className="border-b border-gray-200 bg-gray-100 text-left hidden md:table-cell">
                Email
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left hidden md:table-cell">
                Role
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border-b border-gray-200 text-left">
                    {(page - 1) * 10 + index + 1}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-left">
                    {user.username}
                  </td>
                  <td className="border-b border-gray-200 text-left hidden md:table-cell">
                    {user.email}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-left hidden md:table-cell">
                    {user.userRole}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-left">
                    <span
                      className={
                        user.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-left">
                    <button
                      aria-label="edit"
                      className="bg-view_more text-white px-2 py-1 rounded flex items-center justify-center"
                      onClick={() => openModal(user)}
                    >
                      <FaEdit className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          className={`bg-back_next text-white px-4 py-2 rounded ${page === 1 && "opacity-50 cursor-not-allowed"}`}
          disabled={page === 1}
        >
          Back
        </button>
        <h4>Page {page}</h4>
        <button
          onClick={handleNextPage}
          className={`bg-back_next text-white px-4 py-2 rounded ${page === totalPages && "opacity-50 cursor-not-allowed"}`}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      {selectedUser && (
        <RoleChangeModal
          isOpen={!!selectedUser}
          onClose={closeModal}
          onSave={saveRole}
          currentRole={newRole}
          setNewRole={setNewRole}
        />
      )}
    </div>
  );
};

export default UsersTable;
