import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/Layout";
import { useUser } from "../../context/UserContext";
import { useNotification } from "../../context/NotificationContext";
import { usePageTitle } from "../../context/PageTitleContext";
import RoleWrapper from "../../components/RoleWrapper";

interface ShopifyShop {
  _id: string;
  user_id: string;
  shop: string;
  status: "connected" | "disconnected";
}

export default function ShopifyPage() {
  const [shops, setShops] = useState<ShopifyShop[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { notify } = useNotification();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Shopify");
  }, [setTitle]);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ""}/shopify`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShops(res.data);
    } catch (err) {
      console.error("Failed to fetch Shopify shops", err);
      notify("error", "Failed to fetch Shopify shops")
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    const user_id = user?.id || "";
    const company_id = user?.company_id || ""; // assuming user object has company_id
    const baseUrl = import.meta.env.VITE_API_URL || "";
    
    const oauthUrl = `${baseUrl}/shopify/auth?user_id=${encodeURIComponent(user_id)}&company_id=${encodeURIComponent(company_id)}`;
    
    window.location.href = oauthUrl;
  };

  const handleRemove = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ""}/shopify/${id}`);
      setShops(prev => prev.filter(shop => shop._id !== id));
    } catch (err) {
      console.error("Failed to remove Shopify shop", err);
      notify("error", "Failed to remove Shopify shop");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="border border-gray-300  p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Shopify Stores</h3>
            <RoleWrapper allowedRoles={["company_owner", "store_owner"]} userRole={user?.role || "agent"}>
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
              >
                + Add Store
              </button>
            </RoleWrapper>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading Shopify stores...</p>
          ) : shops.length === 0 ? (
            <p className="text-gray-500">No Shopify stores connected yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {shops.map(shop => (
                <li key={shop._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">{shop.shop}</p>
                    <p className={`text-sm ${shop.status === "connected" ? "text-green-600" : "text-red-500"}`}>
                      {shop.status === "connected" ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                  <RoleWrapper allowedRoles={["company_owner", "store_owner"]} userRole={user?.role || "agent"}>
                    <button
                      onClick={() => handleRemove(shop._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </RoleWrapper>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}