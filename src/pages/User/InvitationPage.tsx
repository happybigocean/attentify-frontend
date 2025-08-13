import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { usePageTitle } from "../../context/PageTitleContext";

type Role = "agent" | "store_owner" | "readonly";

const InvitationPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<Role>("agent");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { setTitle } = usePageTitle();
    
    useEffect(() => {
        setTitle("");
    }, [setTitle]);

    const sendInvite = async () => {
        if (!email) {
        setError("Email is required");
        return;
        }
        setError("");
        setLoading(true);

        try {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/invitations/send`,
            { email, role },
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
            }
        );
        alert("Invitation sent!");
        navigate("/members");
        } catch (err) {
        console.error(err);
        setError("Failed to send invite. Please try again.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-md ml-30 mt-20">
                {error && <div className="text-red-600 mb-4">{error}</div>}
                <h2 className="text-xl font-semibold mb-4">Invite a Member</h2>
                <label className="block mb-2 font-medium" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="w-full p-2 border border-gray-400 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                />

                <label className="block mb-2 font-medium" htmlFor="role">
                    Role
                </label>
                <select
                    id="role"
                    className="w-full p-2 border border-gray-400 mb-4"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                >
                    <option value="agent">Agent</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="readonly">Read Only</option>
                </select>

                <button
                    onClick={sendInvite}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Invite"}
                </button>
            </div>
        </Layout>
    );
};

export default InvitationPage;
