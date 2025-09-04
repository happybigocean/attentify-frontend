import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/Layout";
import { useUser } from "../../context/UserContext";
import { useNotification } from "../../context/NotificationContext";
import { usePageTitle } from "../../context/PageTitleContext";
import { useCompany } from "../../context/CompanyContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import RoleWrapper from "../../components/RoleWrapper";
import {
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface GmailAccount {
  id: string;
  email: string;
  status: "connected" | "disconnected";
  owner_name: string; // Store owner name
  store?: string; // Store name or URL
}

export default function GmailAccountPage() {
  const { currentCompanyId } = useCompany();
  const [accounts, setAccounts] = useState<GmailAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { notify } = useNotification();
  const { setTitle } = usePageTitle();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<GmailAccount | null>(
    null
  );

  const [editingStore, setEditingStore] = useState<string | null>(null);
  const [storeInput, setStoreInput] = useState("");

  const startEditing = (account: GmailAccount) => {
    setEditingStore(account.id);
    setStoreInput(account.store || "");
  };

  const saveStore = async (id: string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL || ""}/gmail/${id}/store`,
        { 
          field: "store",
          value: storeInput 
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id ? { ...acc, store: storeInput } : acc
        )
      );
      notify("success", "Store updated successfully");
    } catch (err) {
      console.error("Failed to update store", err);
      notify("error", "Failed to update store");
    }
    setEditingStore(null);
    setStoreInput("");
  };

  useEffect(() => {
    setTitle("Accounts / Gmail");
  }, [setTitle]);

  useEffect(() => {
    fetchAccounts();
  }, [currentCompanyId]);

  const fetchAccounts = async () => {
    if (!currentCompanyId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || ""}/gmail/company_accounts/${currentCompanyId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
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
    const oauthUrl = `${import.meta.env.VITE_API_URL || ""}/gmail/oauth/login?user_id=${user.id}&company_id=${currentCompanyId}`;
    window.location.href = oauthUrl;
  };

  const onDelete = (id: string) => {
    setSelectedAccount(accounts.find((a) => a.id === id) || null);
    setIsOpen(true);
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ""}/gmail/${id}`);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      notify("success", "Gmail account removed successfully");
    } catch (err) {
      console.error("Failed to remove Gmail account", err);
      notify("error", "Failed to remove Gmail account");
    }
  };

  return (
    <Layout>
      <div className="p-3">
        <div className="border border-gray-300 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              Gmail Accounts
            </h3>
            <RoleWrapper
              allowedRoles={["company_owner", "store_owner"]}
              userRole={user?.role || "agent"}
            >
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
              >
                + Connect Gmail
              </button>
            </RoleWrapper>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500">No Gmail accounts connected yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-left text-gray-700">
                    <th className="w-2/12 px-3 py-2 text-left">Email</th>
                    <th className="w-2/12 px-3 py-2 text-left">Status</th>
                    <th className="w-2/12 px-3 py-2 text-left">Added By</th>
                    <th className="w-4/12 px-3 py-2 text-left">Store</th>
                    <th className="w-2/12 px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50 border-b border-gray-300">
                      <td className="px-3 py-2 font-medium">
                        {account.email}
                      </td>
                      <td
                        className={`px-3 py-2 ${
                          account.status === "connected"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {account.status === "connected"
                          ? "Connected"
                          : "Disconnected"}
                      </td>
                      <td className="px-3 py-2">
                        {account.owner_name}
                      </td>
                      <td className="px-3 py-2">
                        {editingStore === account.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={storeInput}
                              onChange={(e) => setStoreInput(e.target.value)}
                              className="border border-gray-300 px-2 py-1 text-sm w-64"
                              placeholder="Enter store name or URL"
                            />
                            <button
                              onClick={() => saveStore(account.id)}
                              className="text-green-600 text-lg font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStore(null)}
                              className="text-gray-500 text-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {account.store ? (
                              <span>{account.store}</span>
                            ) : (
                              <span className="text-gray-400">Not set</span>
                            )}
                            <RoleWrapper
                              allowedRoles={["company_owner", "store_owner"]}
                              userRole={user?.role || "agent"}
                            >
                              <button
                                onClick={() => startEditing(account)}
                                className="text-blue-600 text-xs hover:underline"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                            </RoleWrapper>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <RoleWrapper
                          allowedRoles={["company_owner", "store_owner"]}
                          userRole={user?.role || "agent"}
                        >
                          <button
                            onClick={() => onDelete(account.id)}
                            className="group-hover:flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <TrashIcon className="w-6 h-6" />
                          </button>
                        </RoleWrapper>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
        onConfirm={() => {
          if (selectedAccount) {
            handleDeleteAccount(selectedAccount.id);
          }
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </Layout>
  );
}
