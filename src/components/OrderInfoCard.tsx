import React, { useEffect, useState } from "react";
import axios from "axios";

type OrderInfo = {
  order_id: string;
  type: string;
  status: number;
  msg: string;
};

interface OrderInfoCardProps {
  messageId: string | undefined;
}

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ messageId }) => {
  const [orderList, setOrderList] = useState<OrderInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!messageId) {
      setOrderList(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setOrderList(null);

    const fetchOrderInfo = async () => {
      try {
        const response = await axios.post(
          (import.meta.env.VITE_API_URL || "") + "/message/analyze",
          { message_id: messageId }
        );
        setOrderList(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order info");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [messageId]);

  let content = null;

  if (loading) {
    content = <div className="text-gray-500">Loading...</div>;
  } else if (error) {
    content = <div className="text-red-500">{error}</div>;
  } else if (orderList && orderList.length > 0) {
    content = (
      <div>
        {orderList.map((order) => (
          <div key={order.order_id}>
            <div className="mb-2">
              <span className="font-semibold">Order ID:</span> #{order.order_id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Request Type:</span> {order.type}
            </div>
          </div>
        ))}
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