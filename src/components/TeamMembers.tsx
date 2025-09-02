import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../context/CompanyContext";
import { useNotification } from "../context/NotificationContext";
import { useUser } from "../context/UserContext";
import RoleWrapper from "./RoleWrapper";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

type Role = "company_owner" | "store_owner" | "agent" | "readonly";

interface Member {
  id: string;
  email: string;
  role: Role;
  status: "active" | "pending";
}

export default function TeamMembers() {
  const { currentCompanyId } = useCompany();
  const { notify } = useNotification();
  const { user } = useUser();
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [originalMembers, setOriginalMembers] = useState<Member[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || ""}/company/${currentCompanyId}/members`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = response.data;
      if (data) {
        setMembers(data || []);
        setOriginalMembers(data || []);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      notify("error", "Error fetching members");
    }
  };

  useEffect(() => {
    if (!currentCompanyId) return;

    fetchMembers();
  }, [currentCompanyId]);

  const handleRoleChange = (index: number, newRole: Role) => {
    const updated = members.map((m, i) =>
      i === index ? { ...m, role: newRole } : m
    );
    setMembers(updated);

    // Detect if changes exist
    const changed = updated.some(
      (m, i) => m.role !== originalMembers[i]?.role
    );
    setHasChanges(changed);
  };

  const handleSaveChanges = async () => {
    try {
      const changedMembers = members.filter(
        (m, i) => m.role !== originalMembers[i]?.role
      );
      
      
      // Update only changed members
      await Promise.all(
        changedMembers.map((member) =>
          axios.post(
            `${import.meta.env.VITE_API_URL}/membership/update`,
            {
              membership_id: member.id,
              role: member.role,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        )
      );

      setOriginalMembers(members);
      setHasChanges(false);
      notify("success", "Changes saved successfully");
    } catch (error) {
      console.error("Failed to save changes:", error);
      notify("error", "Failed to save changes");
    }
  };

  const handleCancelChanges = () => {
    setMembers(originalMembers);
    setHasChanges(false);
  };

  const handleAddMember = () => {
    navigate("/invite");
  };

  const onDelete = (id: string) => {
    setSelectedMember(members.find((m) => m.id === id) || null);
    setIsOpen(true);
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/company/delete-member`, // make sure your backend route supports this
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { 
            id,
            status: members.find((m) => m.id === id)?.status || "active" 
          }, 
        }
      );

      notify("success", "Member deleted");
      fetchMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
      notify("error", "Failed to delete member");
    }
  };


  const renderStatusTag = (status: "active" | "pending") => {
    if (status === "pending") {
      return (
        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
          Pending
        </span>
      );
    } else if (status === "active") {
      return (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Active
        </span>
      );
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
          <p className="text-sm text-gray-500">
            Add team members to collaborate in your workspace. Optionally
            specify member roles to enhance security.
          </p>
        </div>
        <RoleWrapper allowedRoles={["company_owner"]} userRole={user?.role || "agent"}>
          <button
            onClick={handleAddMember}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Add Member
          </button>
        </RoleWrapper>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b border-gray-300">Member Email</th>
              <th className="px-4 py-2 border-b border-gray-300">Role</th>
              <th className="px-4 py-2 border-b border-gray-300">Status</th>
              <RoleWrapper allowedRoles={["company_owner"]} userRole={user?.role || "agent"}>
                <th className="px-4 py-2 border-b border-gray-300">Actions</th>
              </RoleWrapper>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{member.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(index, e.target.value as Role)
                    }
                    className="border border-gray-300 px-2 py-1"
                  >
                    <option value="company_owner">Owner</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="agent">Agent</option>
                    <option value="readonly">Read-only</option>
                  </select>
                </td>
                <td className="px-4 py-2">{renderStatusTag(member.status)}</td>
                <RoleWrapper allowedRoles={["company_owner"]} userRole={user?.role || "agent"}>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onDelete(member.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </RoleWrapper>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasChanges && (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

          <button
            onClick={handleCancelChanges}
            className="px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={() => {
          if (selectedMember) {
            handleDeleteMember(selectedMember.id);
          }
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </section>
  );
}
