import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Message } from "../../types";
import Layout from "../../layouts/Layout";
import EmailViewer from "../../components/EmailViewer";
import SMSViewer from "../../components/SMSViewer";
import OrderInfoCard from "../../components/OrderInfoCard";
import type { OrderInfo } from "../../types";
import EmailReplySection from "../../components/EmailReplySection";
import SMSReplySection from "../../components/SMSReplySection";
import { usePageTitle } from "../../context/PageTitleContext";
import Comments from "../../components/Comments";

const MessageDetailPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");

  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    //hasFetchedOrder.current = false;
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

  return (
    <Layout>
      {loading && <div className="p-4">Loading...</div>}
      {!loading && (
        <div className="flex min-h-screen w-full p-4">
          {/* Main Email Thread */}
          <div className="flex-1 max-w-4xl">
            
            {message ? (
              <div className="space-y-2 mt-4">
                {message.messages.map((entry, index) => {
                  const isLast = index === message.messages.length - 1;

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        entry.sender === "client" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div className="w-full max-w-5xl">
                        <div className="mb-2">
                          {entry.message_type === "html" && (
                            <EmailViewer
                              subject={entry.title || "No Subject"}
                              from={entry.metadata?.from || "Unknown"}
                              to={entry.metadata?.to || "Unknown"}
                              date={entry.timestamp}
                              htmlBody={entry.content}
                              threadId={threadId}
                              //expended={isLast} // <-- only last element expanded
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
                              isExpanded={isLast} // <-- only last element expanded
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

            <Comments messageId={message?._id} pComments={message?.comments} />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col justify-start ml-6 space-y-6">
            <div className="sticky top-24 flex flex-col space-y-6">
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
