import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/Layout";

interface PhoneAccount {
  id: string;
  phone: string;
}

// Demo data for local development or fallback
const phoneNumbers = [
  { id: "1", phone: "+18888179263", status: "connected" },
];

export default function PhoneAccountPage() {
  const [accounts, setAccounts] = useState<PhoneAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // Uncomment for real API call:
      // const res = await axios.get(`${import.meta.env.VITE_API_URL || ""}/phone`);
      // setAccounts(res.data);
      setAccounts(phoneNumbers);
    } catch (err) {
      console.error("Failed to fetch phone accounts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    // This could be an OAuth, Twilio Connect, or your own onboarding flow
    const connectUrl = `${import.meta.env.VITE_API_URL || ""}/phone/connect`;
    window.location.href = connectUrl;
  };

  const handleRemove = async (id: string) => {
    try {
      // Uncomment for real API call:
      // await axios.delete(`${import.meta.env.VITE_API_URL || ""}/phone/${id}`);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      console.error("Failed to remove phone account", err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accounts</h2>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Phone Accounts</h3>
            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Connect Phone
            </button>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500">No phone accounts connected yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {accounts.map(account => (
                <li key={account.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">{account.phone}</p>
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