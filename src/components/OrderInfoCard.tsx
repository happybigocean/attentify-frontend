import React from "react";

type OrderInfo = {
  order_id: string;
  type: string;
  status: number;
  msg: string;
};

interface OrderInfoCardProps {
  order: OrderInfo | null;
  loading: boolean;
  error: string | null;
}

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ order, loading, error }) => {
  let content = null;

  if (loading) {
    content = <div className="text-gray-500">Loading...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else if (order) {
    content = (
      <div>
        <div className="mb-2">
          <span className="font-semibold">Order ID:</span> #{order.order_id}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Request Type:</span> {order.type}
        </div>
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