import React, { useEffect, useState } from "react";
import type { OrderInfo, ShopifyLineItem } from "../types";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";

interface RefundModalProps {
  order: OrderInfo | null;
  onClose: () => void;
}

const RefundModal: React.FC<RefundModalProps> = ({ order, onClose }) => {
  const { notify } = useNotification();
  const items = order?.shopify_order?.line_items || [];
  const [selectedItems, setSelectedItems] = useState<ShopifyLineItem[]>([]);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundShipping, setRefundShipping] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [includeShipping, setIncludeShipping] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Auto-select all checkbox if all items are selected
    setSelectAll(selectedItems.length === items.length && items.length > 0);
  }, [selectedItems, items]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items);
    }
    setSelectAll(!selectAll);
  };

  const handleItemToggle = (item: ShopifyLineItem) => {
    const exists = selectedItems.find((i) => i.name === item.name);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.name !== item.name));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRefund = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/shopify/order/refund`,
        {
          order_id: order?.shopify_order?.order_id,
          shop: order?.shopify_order?.shop,
          selected_items: selectedItems,
          refund_amount: refundAmount,
          refund_shipping: includeShipping ? refundShipping : null,
          note: refundNote,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      notify("success", "Refund processed successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      notify("error", "Refund failed. Please try again.");
    }
  };

  const isRefundDisabled = selectedItems.length === 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-100">
      <div className="bg-white p-6 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Process Refund</h2>

        <div className="mb-4 border border-gray-300 p-4">
          <label className="flex items-center mb-2 cursor-pointer space-x-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-green-600"
            />
            <span className="font-medium">Select All Items</span>
          </label>

          <div className="max-h-48 overflow-y-auto space-y-2 mt-2">
            {items.map((item, idx) => (
              <label
                key={idx}
                className="flex justify-between items-center border-b border-gray-200 pb-2 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((i) => i.name === item.name)}
                    onChange={() => handleItemToggle(item)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span>{item.name}</span>
                </div>
                <span className="text-gray-600">
                  ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Refund Amount ($)</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100"
              placeholder="Enter refund amount"
              disabled={isRefundDisabled}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeShipping}
              onChange={(e) => setIncludeShipping(e.target.checked)}
              className="w-4 h-4 accent-green-600"
              disabled={isRefundDisabled}
            />
            <label className="font-medium">Include shipping refund</label>
          </div>

          {includeShipping && (
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Refund Amount ($)</label>
              <input
                type="number"
                value={refundShipping}
                onChange={(e) => setRefundShipping(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100"
                placeholder="Enter shipping refund"
                disabled={isRefundDisabled}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Refund Note</label>
            <textarea
              value={refundNote}
              onChange={(e) => setRefundNote(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              rows={3}
              placeholder="Enter reason or note for refund"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleRefund}
            disabled={isRefundDisabled}
            className={`px-4 py-2 text-white transition ${
              isRefundDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Submit Refund
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
