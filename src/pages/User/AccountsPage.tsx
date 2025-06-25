import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/Layout";

interface GmailAccount {
  id: string;
  email: string;
  status: "connected" | "disconnected";
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<GmailAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ""}/gmail`);
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch Gmail accounts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    const oauthUrl = `${import.meta.env.VITE_API_URL || ""}/gmail/oauth/login`;
    window.location.href = oauthUrl;
  };

  const handleRemove = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ""}/gmail/${id}`);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      console.error("Failed to remove Gmail account", err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accounts</h2>

        <div className="bg-white shadow rounded-lg p-4">
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
