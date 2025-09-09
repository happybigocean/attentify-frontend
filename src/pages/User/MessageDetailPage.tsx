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
import { usePageTitle } from "../../context/PageTitleContext";

type Comment = {
  id: string;
  user: string;
  content: string;
  date: string;
};

const MessageDetailPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [reply, setReply] = useState("");

  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "Alice",
      content: "This order looks suspicious, please verify.",
      date: "2025-09-09 09:00",
    },
    {
      id: "2",
      user: "Bob",
      content: "I have checked the details, seems fine.",
      date: "2025-09-09 10:15",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const hasFetchedMessage = useRef(false);
  const hasFetchedOrder = useRef(false);
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Message Detail");
  }, [setTitle]);

  // Fetch message thread
  useEffect(() => {
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
        setMessage(response.data);

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
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Handle new comment add
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: "You",
      content: newComment,
      date: new Date().toLocaleString(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  return (
    <Layout>
      {loading && <div className="p-4">Loading...</div>}
      {!loading && (
        <div className="flex min-h-screen w-full p-4">
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
                      className={`flex ${
                        entry.sender === "client"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div className="w-full max-w-5xl">
                        <div
                          className={`cursor-pointer select-none mb-2`}
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
                              OnHandleReply={() => {}}
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

                <div className="mt-8 border border-gray-300 p-4">
                  <h3 className="text-xl font-semibold mb-3">Comments</h3>
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div
                        key={c.id}
                        className="bg-gray-100 p-3 "
                      >
                        <div className="text-sm text-gray-600 mb-1">
                          {c.user} • {c.date}
                        </div>
                        <div>{c.content}</div>
                      </div>
                    ))}
                  </div>

                  {/* New Comment Input */}
                  <div className="mt-4 flex">
                    <input
                      type="text"
                      className="flex-1 border p-2"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-blue-600 text-white px-4"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-red-600">Message not found</div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col justify-start ml-6 space-y-6">
            <div className="sticky top-31 flex flex-col space-y-6">
              <div className="w-[350px] border border-gray-300 bg-white p-4">
                <h2 className="text-2xl font-bold mb-5">Customer Info</h2>
                {orderInfo &&
                  orderInfo?.shopify_order &&
                  orderInfo?.shopify_order?.customer && (
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
                        {
                          orderInfo?.shopify_order?.customer.default_address
                            ?.address1
                        }
                      </div>
                    </>
                )}
              </div>
              <OrderInfoCard
                order={orderInfo}
                loading={loadingOrder}
                error={error}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MessageDetailPage;
