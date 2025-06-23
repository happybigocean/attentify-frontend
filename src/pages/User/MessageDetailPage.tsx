import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Message } from "../../types";
import Layout from "../../layouts/Layout";
import EmailViewer from "../../components/EmailViewer";
import { Editor } from "primereact/editor";
import OrderInfoCard from "../../components/OrderInfoCard";

// Dummy customer info
const dummyCustomer = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Springfield, USA",
};

type OrderInfo = {
  order_id: string;
  type: string;
  status: number;
  msg: string;
};

const MessageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

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
          `${import.meta.env.VITE_API_URL || ""}/message/${id}`
        );
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

    if (id) {
      fetchMessage();
    }
  }, [id]);

  // Analyze email to get order info
  useEffect(() => {
    // Reset the fetch flag if the message changes
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

  // Handle reply submit
  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/message/${id}/reply`,
        { content: reply }
      );
      setReply("");
      // Optionally, refetch messages
      setLoading(true);
      hasFetchedMessage.current = false; // allow refetch
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || ""}/message/${id}`
      );
      setMessage(response.data);
      if (response.data?.messages?.length) {
        setExpandedIndexes([response.data.messages.length - 1]);
      }
    } catch (err) {
      // Handle error
    } finally {
      setSending(false);
      setLoading(false);
    }
  };

  const isEditorEmpty = (html: string) => {
    return !html || html.replace(/<(.|\n)*?>/g, '').trim() === '';
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
                          className={`cursor-pointer select-none rounded-lg mb-2 shadow ${isExpanded ? "bg-white" : "bg-gray-50"}`}
                          onClick={() => handleToggle(index)}
                        >
                          {!isExpanded && (
                            <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
                              <header>
                                <h2 className="text-xl font-bold mb-2">{entry.title || "No Subject"}</h2>
                                <div className="flex gap-3 text-sm text-gray-600">
                                  <div>
                                    <span className="font-semibold">From:</span>{" "}
                                    {entry.metadata?.from || "Unknown"}
                                  </div>
                                  <div>
                                    <span className="font-semibold">To:</span>{" "}
                                    {entry.metadata?.to || "Unknown"}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Date:</span>  {new Date(entry.timestamp).toLocaleString()}
                                  </div>
                                </div>
                              </header>
                            </div>
                          )}
                          {isExpanded && (
                            <div className="">
                              {entry.message_type === "html" ? (
                                <EmailViewer
                                  subject={entry.title || "No Subject"}
                                  from={entry.metadata?.from || "Unknown"}
                                  to={entry.metadata?.to || "Unknown"}
                                  date={entry.timestamp}
                                  htmlBody={entry.content}
                                />
                              ) : (
                                <div
                                  className={`p-4 rounded-lg ${
                                    entry.sender === "client"
                                      ? "bg-blue-100 text-left"
                                      : entry.sender === "agent"
                                      ? "bg-green-100 text-right"
                                      : "bg-gray-200 text-gray-800"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap text-base">
                                    {entry.content}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Reply Section */}
                <div className="">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <h3 className="text-lg font-semibold mb-2">Reply</h3>
                    <div data-color-mode="light">
                      <Editor
                        value={reply}
                        onTextChange={(e: any) => setReply(e.htmlValue)}
                        style={{ height: '320px' }}
                      />
                    </div>
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mt-2"
                      onClick={handleReply}
                      disabled={sending || isEditorEmpty(reply)}
                    >
                      {sending ? "Sending..." : "Send Reply"}
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
            <div className="sticky top-19 flex flex-col space-y-6">
              {/* Customer Info Card */}
              <div className="w-[350px] bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-5">Customer Info</h2>
                <div className="mb-4">
                  <span className="font-semibold">Name: </span>
                  {dummyCustomer.name}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Email: </span>
                  {dummyCustomer.email}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Phone: </span>
                  {dummyCustomer.phone}
                </div>
                <div>
                  <span className="font-semibold">Address: </span>
                  {dummyCustomer.address}
                </div>
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