import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/Layout";

interface Customer {
  id?: string;
  email?: string;
  name?: string;
}

interface LineItem {
  product_id?: string;
  name?: string;
  quantity?: number;
  price?: string;
}

interface Order {
  order_id: string;
  shop: string;
  created_at?: string;
  customer?: Customer;
  total_price?: string;
  payment_status?: string;
  fulfillment_status?: string;
  line_items?: LineItem[];
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || ""}/orders`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOrders = () => {
    // Implement order synchronization logic here
    // e.g., POST to /orders/sync, then refetch orders
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Your Orders</h3>
            <button
              onClick={handleSyncOrders}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Sync Orders
            </button>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading Orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No Orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left font-semibold text-gray-600">Order ID</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-600">Shop Domain</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-600">Date</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-600">Customer</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-600">Total</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-600">Payment Status</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-600">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="py-2 px-3">{order.order_id}</td>
                      <td className="py-2 px-3">{order.shop}</td>
                      <td className="py-2 px-3">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-2 px-3">
                        {order.customer?.name || "-"}
                        <br />
                        <span className="text-xs text-gray-500">
                          {order.customer?.email}
                        </span>
                      </td>
                      <td className="py-2 px-3">{order.total_price || "-"}</td>
                      <td className="py-2 px-3">
                        {order.payment_status ? (
                          <span
                            className={
                              order.payment_status === "paid"
                                ? "text-green-600 font-semibold"
                                : order.payment_status === "pending"
                                ? "text-yellow-600 font-semibold"
                                : "text-gray-600"
                            }
                          >
                            {order.payment_status}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {order.fulfillment_status ? (
                          <span
                            className={
                              order.fulfillment_status === "fulfilled"
                                ? "text-green-600 font-semibold"
                                : order.fulfillment_status === "partial"
                                ? "text-yellow-600 font-semibold"
                                : "text-gray-600"
                            }
                          >
                            {order.fulfillment_status}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}