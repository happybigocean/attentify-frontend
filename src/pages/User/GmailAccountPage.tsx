import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/Layout";
import { useUser } from "../../context/UserContext";
import { useNotification } from "../../context/NotificationContext"; 

interface GmailAccount {
  id: string;
  email: string;
  status: "connected" | "disconnected";
};

export default function GmailAccountPage() {
  const [accounts, setAccounts] = useState<GmailAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { notify } = useNotification();

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ""}/gmail`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch Gmail accounts", err);
      notify("error", "Failed to fetch Gmail accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const oauthUrl = `${import.meta.env.VITE_API_URL || ""}/gmail/oauth/login?user_id=${user.id}`;
    window.location.href = oauthUrl;
  };

  const handleRemove = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ""}/gmail/${id}`);
      setAccounts(prev => prev.filter(account => account.id !== id));
      notify("success", "Gmail account removed successfully");
    } catch (err) {
      console.error("Failed to remove Gmail account", err);
      notify("error", "Failed to remove Gmail account");
    }
  };

  return (
    <Layout>
      <div className="p-3">
        <div className="border border-gray-300 rounded-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Gmail Accounts</h3>
            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Connect Gmail
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500">No Gmail accounts connected yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {accounts.map(account => (
                <li key={account.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">{account.email}</p>
                    <p className={`text-sm ${account.status === "connected" ? "text-green-600" : "text-red-500"}`}>
                      {account.status === "connected" ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(account.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
