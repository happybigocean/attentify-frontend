import React, { useState } from "react";

type Role = "owner" | "agent" | "readonly";

interface Member {
  email: string;
  role: Role;
}

export default function TeamMembers() {
  const [members, setMembers] = useState<Member[]>([
    { email: "owner@example.com", role: "owner" },
    { email: "agent@example.com", role: "agent" },
    { email: "readonly@example.com", role: "readonly" },
  ]);

  const handleRoleChange = (index: number, newRole: Role) => {
    const updated = [...members];
    updated[index].role = newRole;
    setMembers(updated);

    // TODO: Call your API to update member role
    // await axios.put(`/api/members/${updated[index].email}`, { role: newRole });
  };

  const handleAddMember = () => {
    const email = window.prompt("Enter new member's email:");
    if (!email) return;

    const newMember: Member = { email, role: "agent" };
    setMembers((prev) => [...prev, newMember]);

    // TODO: Call your API to add member
    // await axios.post("/api/members", newMember);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
          <p className="text-sm text-gray-500">
            Add team members to collaborate in your workspace. Optionally specify
            member roles to enhance security.
          </p>
        </div>
        <button
          onClick={handleAddMember}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b border-gray-300">Member Email</th>
              <th className="px-4 py-2 border-b border-gray-300">Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{member.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(index, e.target.value as Role)}
                    className="border border-gray-300 px-2 py-1"
                  >
                    <option value="owner">Owner</option>
                    <option value="agent">Agent</option>
                    <option value="readonly">Read-only</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
