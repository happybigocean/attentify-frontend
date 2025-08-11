import React, {useState, useEffect} from "react";
import axios from "axios";

type SMSReplyProps = {
  threadId?: string;
  replyFromParent: string;
};

const SMSReplySection: React.FC<SMSReplyProps> = ({
  replyFromParent,
  threadId
}) => {
  const [reply, setReply] = useState(replyFromParent);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setReply(replyFromParent);
  }, [replyFromParent]);

  // Handle reply submit
  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      //await axios.post(
        //`${import.meta.env.VITE_API_URL || ""}/message/${threadId}/reply`,
        //{ content: reply }
      //);
      setReply("");
    } catch (err) {
      // Handle error (e.g., show toast)
    } finally {
      setSending(false);
    }
  };

  const isEditorEmpty = (text: string | undefined) => {
    return !text || text.trim() === '';
  };

  return (
    <div className="mt-4">
      <div className="bg-white  p-4 shadow">
        <h3 className="text-lg font-semibold mb-2">Reply</h3>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your reply here..."
        />
        <button
          className="bg-blue-600 text-white px-6 py-2  hover:bg-blue-700 disabled:opacity-50 mt-2"
          onClick={handleReply}
          disabled={sending || isEditorEmpty(reply)}
        >
          {sending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </div>
  );
};

export default SMSReplySection;
