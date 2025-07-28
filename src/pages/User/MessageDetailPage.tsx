import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Message } from "../../types";
import Layout from "../../layouts/Layout";
import EmailViewer from "../../components/EmailViewer";
import SMSViewer from "../../components/SMSViewer";
import OrderInfoCard from "../../components/OrderInfoCard";
import type { OrderInfo } from "../../types";
import EmailReplySection from "../../components/EmailReplySection";
import SMSReplySection from "../../components/SMSReplySection";

const MessageDetailPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [reply, setReply] = useState("");

  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent double-fetching caused by React 18 StrictMode or fast refreshes
  const hasFetchedMessage = useRef(false);
  const hasFetchedOrder = useRef(false);

  // Fetch message thread
  useEffect(() => {
    // Reset the fetch flag if the ID changes
    hasFetchedMessage.current = false;
    setLoading(true);
    setMessage(null);

    const fetchMessage = async () => {
      if (hasFetchedMessage.current) return;
      hasFetchedMessage.current = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/message/${threadId}`
        );
        console.log(response.data);
        setMessage(response.data);

        // Expand only the last message by default
        if (response.data?.messages?.length) {
          setExpandedIndexes([response.data.messages.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching message:", error);
      } finally {
        setLoading(false);
      }
    };

    if (threadId) {
      fetchMessage();
    }
  }, [threadId]);

  // Analyze email to get order info
  useEffect(() => {
    hasFetchedOrder.current = false;
    setOrderInfo(null);
    setLoadingOrder(true);
    setError(null);

    const fetchOrderInfo = async () => {
      if (hasFetchedOrder.current) return;
      hasFetchedOrder.current = true;
      if (!message || !message.messages?.length) {
        setOrderInfo(null);
        setLoadingOrder(false);
        return;
      }

      try {
        const response = await axios.post(
          (import.meta.env.VITE_API_URL || "") + "/message/analyze",
          { message_id: message._id }
        );
        setOrderInfo(response.data);
        setReply(response.data?.msg || "");
      } catch (err: any) {
        setError(err.message || "Failed to fetch order info");
        setOrderInfo(null);
      } finally {
        setLoadingOrder(false);
      }
    };

    if (message) {
      fetchOrderInfo();
    }
  }, [message]);

  // Toggle collapse/expand
  const handleToggle = (idx: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  return (
    <Layout>
      {loading && <div className="p-6">Loading...</div>}
      {!loading &&
        <div className="flex min-h-screen w-full px-8 py-8">
          {/* Main Email Thread */}
          <div className="flex-1 max-w-4xl">
            <Link
              to="/message"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Messages
            </Link>
            {message ? (
              <div className="space-y-2 mt-4">
                {message.messages.map((entry, index) => {
                  const isExpanded = expandedIndexes.includes(index);
                  return (
                    <div
                      key={index}
                      className={`flex ${entry.sender === "client" ? "justify-start" : "justify-end"}`}
                    >
                      <div className="w-full max-w-5xl">
                        <div
                          className={`cursor-pointer select-none rounded-lg mb-2`}
                          onClick={() => handleToggle(index)}
                        >
                          {entry.message_type === "html" && (
                            <EmailViewer
                              subject={entry.title || "No Subject"}
                              from={entry.metadata?.from || "Unknown"}
                              to={entry.metadata?.to || "Unknown"}
                              date={entry.timestamp}
                              htmlBody={entry.content}
                              threadId={threadId}
                              isExpanded={isExpanded}
                              replyFromParent={reply}
                              OnHandleReply={() => {
                                // Handle reply logic here
                              }}
                            />
                          )}

                          {entry.message_type === "text" && (
                            <SMSViewer
                              from={entry.metadata?.from || "Unknown"}
                              to={entry.metadata?.to || "Unknown"}
                              date={entry.timestamp}
                              body={entry.content}
                              isExpanded={isExpanded}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {message.channel === "email" && (
                  <EmailReplySection
                  threadId={threadId}
                  replyFromParent={reply}
                  />
                )}

                {message.channel === "sms" && (
                  <SMSReplySection
                    threadId={threadId}
                    replyFromParent={reply}
                  />
                )}
              </div>
            ) : (
              <div className="p-6 text-red-600">Message not found</div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col justify-start ml-6 space-y-6">
            <div className="sticky top-19 flex flex-col space-y-6">
              {/* Customer Info Card */}
              <div className="w-[350px] bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-5">Customer Info</h2>
                {orderInfo && orderInfo?.shopify_order && orderInfo?.shopify_order?.customer && (
                  <>
                    <div className="mb-4">
                      <span className="font-semibold">Name: </span>
                      {orderInfo?.shopify_order?.customer.name}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold">Email: </span>
                      {orderInfo?.shopify_order?.customer.email}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold">Phone: </span>
                      {orderInfo?.shopify_order?.customer.phone}
                    </div>
                    <div>
                      <span className="font-semibold">Address: </span>
                      {orderInfo?.shopify_order?.customer.default_address?.address1}
                    </div>
                  </>
                )}
              </div>
              {/* Order Info Card */}
              <OrderInfoCard order={orderInfo} loading={loadingOrder} error={error} />
            </div>
          </div>
        </div>
      }
    </Layout>
  );
};

export default MessageDetailPage;