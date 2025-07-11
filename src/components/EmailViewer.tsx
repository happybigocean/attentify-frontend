import React, {useState, useEffect} from "react";
import DOMPurify from "dompurify";
import { formatEmailAddress } from "../utils/formatEmailAddress";
import { Editor } from "primereact/editor";
import axios from "axios";

type EmailViewerProps = {
  subject: string;
  from: string;
  to: string;
  date: string;
  htmlBody: string;
  threadId?: string;
  isExpanded?: boolean;
  replyFromParent?: string;
  OnHandleReply?: () => void;
};

const EmailViewer: React.FC<EmailViewerProps> = ({
  subject,
  from,
  to,
  date,
  htmlBody,
  threadId,
  isExpanded,
  replyFromParent,
  OnHandleReply,
}) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlBody);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // If replyFromParent is provided, set it as the initial reply content
    if (replyFromParent) {
      setReply(replyFromParent);
    }
  }, [replyFromParent]);

  // Handle reply submit
  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/message/${threadId}/reply`,
        { content: reply }
      );
      setReply("");
      //setMessage(response.data);

      // Expand only the last message by default
      //if (response.data?.messages?.length) {
        //setExpandedIndexes([response.data.messages.length - 1]);
      //}
    } catch (err) {
      // Handle error
    } finally {
      setSending(false);
    }
  };

  const isEditorEmpty = (html: string | undefined) => {
    return !html || html.replace(/<(.|\n)*?>/g, '').trim() === '';
  };

  return (
    <div>
      {!isExpanded && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
          <header>
            <h2 className="text-xl font-bold mb-2">{subject}</h2>
            <div className="flex gap-3 text-sm text-gray-600">
              <div>
                <span className="font-semibold">From:</span>{" "}
                {from}
              </div>
              <div>
                <span className="font-semibold">To:</span>{" "}
                {to}
              </div>
              <div>
                <span className="font-semibold">Date:</span>  {new Date(date).toLocaleString()}
              </div>
            </div>
          </header>
        </div>
      )}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
          <header className="mb-4 border-b pb-4">
            <h2 className="text-xl font-bold mb-2">{subject}</h2>
            <div className="flex gap-3 text-sm text-gray-600">
              <div>
                <span className="font-semibold">From:</span>{" "}
                {formatEmailAddress(from)}
              </div>
              <div>
                <span className="font-semibold">To:</span>{" "}
                {formatEmailAddress(to)}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {new Date(date).toLocaleString()}
              </div>
            </div>
          </header>
          <section className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </section>
        </div>
      )}

      {/* Reply Section */}
      <div className="mt-4">
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
  );
};

export default EmailViewer;