import React, { useEffect, useState } from "react";
import type { User } from "../../types/user";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../hooks/user";
import Layout from "../../layouts/Layout";

const defaultNewUser: Omit<User, "id"> = {
  email: "",
  first_name: "",
  last_name: "",
  role: "readonly",
  status: "invited",
  team_id: "",
};

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "store_owner", label: "Store Owner" },
  { value: "agent", label: "Agent" },
  { value: "readonly", label: "Readonly" },
];
const STATUSES = [
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "suspended", label: "Suspended" },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState(defaultNewUser);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleCreate = async () => {
    if (!newUser.email || !newUser.first_name || !newUser.last_name) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      const created = await createUser(newUser);
      setUsers([...users, created]);
      setNewUser(defaultNewUser);
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create user.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditForm(user);
  };

  const handleUpdate = async () => {
    if (!editingUserId) return;
    try {
      const updated = await updateUser(editingUserId, editForm);
      setUsers(users.map((u) => (u.id === editingUserId ? updated : u)));
      setEditingUserId(null);
      setEditForm({});
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowCreate(true)}
          >
            + Create New User
          </button>
        </div>

        {/* Modal for creating user */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowCreate(false)}
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Create New User</h2>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
                <input
                  placeholder="First Name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                  required
                />
                <input
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                  required
                />
                <select
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <select
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User["status"] })}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <input
                  placeholder="Team ID"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  value={newUser.team_id || ""}
                  onChange={(e) => setNewUser({ ...newUser, team_id: e.target.value })}
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleCreate}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Last Login</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">
                    {editingUserId === u.id ? (
                      <input
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUserId === u.id ? (
                      <div className="flex gap-2">
                        <input
                          className="w-1/2 px-2 py-1 border rounded focus:outline-none focus:ring"
                          value={editForm.first_name || ""}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          placeholder="First Name"
                        />
                        <input
                          className="w-1/2 px-2 py-1 border rounded focus:outline-none focus:ring"
                          value={editForm.last_name || ""}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      `${u.first_name} ${u.last_name}`
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUserId === u.id ? (
                      <select
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring"
                        value={editForm.role || "readonly"}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as User["role"] })}
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    ) : (
                      ROLES.find(r => r.value === u.role)?.label || u.role
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUserId === u.id ? (
                      <select
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring"
                        value={editForm.status || "invited"}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as User["status"] })}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    ) : (
                      STATUSES.find(s => s.value === u.status)?.label || u.status
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUserId === u.id ? (
                      <input
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring"
                        value={editForm.team_id || ""}
                        onChange={(e) => setEditForm({ ...editForm, team_id: e.target.value })}
                      />
                    ) : (
                      u.team_id
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {u.last_login?.slice(0, 19).replace("T", " ") || "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editingUserId === u.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                          onClick={handleUpdate}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                          onClick={() => setEditingUserId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                          onClick={() => handleEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleDelete(u.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;