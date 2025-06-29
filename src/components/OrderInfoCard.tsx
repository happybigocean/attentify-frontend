import React from "react";
import type { ShopifyAddress, ShopifyLineItem, OrderInfo } from "../types";

interface OrderInfoCardProps {
  order: OrderInfo | null;
  loading: boolean;
  error: string | null;
}

const renderAddress = (address?: ShopifyAddress) => {
  if (!address) return <span className="text-gray-400">N/A</span>;
  return (
    <div>
      <div>{address.address1}</div>
      {address.address2 && <div>{address.address2}</div>}
      <div>
        {address.city}, {address.province}, {address.country} {address.zip}
      </div>
    </div>
  );
};

const renderLineItems = (items?: ShopifyLineItem[]) => {
  if (!items || items.length === 0) return <span className="text-gray-400">No items</span>;
  return (
    <ul className="space-y-1 list-disc list-inside">
      {items.map((item, idx) => (
        <li key={idx}>
          <span className="font-medium">{item.name}</span>
          {item.quantity !== undefined && <> &times; {item.quantity}</>}
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
  let content = null;

  if (loading) {
    content = <div className="text-gray-500">Loading...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else if (order) {
    content = (
      <div>
        {order.shopify_order ? (
          <div className="mt-4 border-t pt-4">
            <div className="mb-2">
              <span className="font-semibold">Order:</span> {order.shopify_order.name || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Shop:</span> {order.shopify_order.shop || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Created At:</span> {order.shopify_order.created_at || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Price:</span> ${order.shopify_order.total_price || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Payment Status:</span> {order.shopify_order.payment_status || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Fulfillment Status:</span> {order.shopify_order.fulfillment_status || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Line Items:</span>
              <div className="ml-2">{renderLineItems(order.shopify_order.line_items)}</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-gray-500">{order.msg}</div>
        )}
      </div>
    );
  } else {
    content = <div className="text-gray-500">No order information found.</div>;
  }

  return (
    <div className="w-[350px] bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-lg font-semibold mb-4">Order Information</h3>
      {content}
    </div>
  );
};

export default OrderInfoCard;