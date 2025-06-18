import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Message } from "../../types";
import Layout from "../../layouts/Layout";
import EmailViewer from "../../components/EmailViewer";

// Dummy customer info
const dummyCustomer = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Springfield, USA",
};

const MessageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/message/${id}`
        );
        setMessage(response.data);
      } catch (error) {
        console.error("Error fetching message:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <Layout>
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
            <div className="space-y-0">
              {message.messages.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${
                    entry.sender === "client" ? "justify-start" : "justify-end"
                  } mb-6`}
                >
                  <div className="w-full max-w-5xl">
                    {entry.message_type === "text" ? (
                      <EmailViewer
                        subject={entry.title || "No Subject"}
                        from={entry.metadata?.from || "Unknown"}
                        to={entry.metadata?.to || "Unknown"}
                        date={entry.timestamp}
                        htmlBody={entry.content}
                      />
                    ) : (
                      <div
                        className={`p-6 rounded-lg shadow ${
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
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-red-600">Message not found</div>
          )}
        </div>

        {/* Customer Info */}
        <div className="flex flex-col justify-start ml-8">
          <div className="sticky top-21">
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessageDetailPage;