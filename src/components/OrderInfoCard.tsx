import React, { useEffect, useState } from "react";
import type { ShopifyAddress, ShopifyLineItem, OrderInfo } from "../types";
import { useNotification } from "../context/NotificationContext";
import { useConfirmDialog } from "../context/ConfirmDialogContext";
import axios from "axios";
import RefundModal from "./RefundModal";

interface OrderInfoCardProps {
  order: OrderInfo | null;
  loading: boolean;
  error: string | null;
}

const renderLineItems = (items?: ShopifyLineItem[]) => {
  if (!items || items.length === 0)
    return <span className="text-gray-400">No items</span>;
  return (
    <ul className="space-y-1 list-disc list-inside">
      {items.map((item, idx) => (
        <li key={idx}>
          <span className="font-medium">{item.name}</span>
          {item.quantity !== undefined && <> × {item.quantity}</>}
          {item.price !== undefined && (
            <span className="ml-2 text-gray-600">
              (${typeof item.price === "number" ? item.price.toFixed(2) : item.price})
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ order, loading, error }) => {
  const { notify } = useNotification();
  const { confirm } = useConfirmDialog();
  const [showRefundModal, setShowRefundModal] = useState(false);

  const handleCancel = async () => {
    const ok = await confirm({
      title: "Confirm Cancellation",
      message: "Are you sure you want to cancel this order?",
    });
    if (!ok) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shopify/order/cancel`,
        {
          order_id: order?.shopify_order?.order_id || "",
          shop: order?.shopify_order?.shop || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const msg =
        response.data?.msg ||
        response.data?.message ||
        "Order cancelled successfully!";
      notify("success", msg);
    } catch (error: any) {
      let errorMsg = "Order cancellation failed.";

      if (error.response) {
        errorMsg =
          error.response.data?.error ||
          error.response.data?.errors ||
          error.response.data?.message ||
          `Cancellation failed with status ${error.response.status}`;
      } else if (error.request) {
        errorMsg = "No response from server. Please check your connection.";
      } else {
        errorMsg = error.message;
      }

      console.error("Cancel error:", errorMsg, error.response?.data);
      notify("error", errorMsg);
    }
  };

  useEffect(() => {
    console.log("shopify order", order);
  }, [order]);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div className="text-gray-500">No order information found.</div>;

  return (
    <>
      <div className="w-[380px] bg-white border border-gray-300 p-4">
        <h3 className="text-lg font-semibold mb-4">Order Information</h3>

        {order.shopify_order ? (
          <>
            <div className="mb-2">
              <span className="font-semibold">Order:</span> {order.shopify_order.name || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Shop:</span> {order.shopify_order.shop || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Created At:</span>{" "}
              {order.shopify_order.created_at || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Price:</span> $
              {order.shopify_order.total_price || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Payment Status:</span>{" "}
              {order.shopify_order.payment_status || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Fulfillment Status:</span>{" "}
              {order.shopify_order.fulfillment_status || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Line Items:</span>
              <div className="ml-2">{renderLineItems(order.shopify_order.line_items)}</div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setShowRefundModal(true)}
                className="px-3 py-1.5 bg-green-500 text-white text-sm hover:bg-green-600 transition"
              >
                Refund
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 text-gray-500">{order.msg}</div>
        )}
      </div>

      {showRefundModal && (
        <RefundModal order={order} onClose={() => setShowRefundModal(false)} />
      )}
    </>
  );
};

export default OrderInfoCard;
