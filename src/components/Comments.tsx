import React, {useState, useEffect} from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import type { Comment } from "../types";

type CommentsProps = {
  messageId?: string;
  pComments?: Comment[];
};

const Comments: React.FC<CommentsProps> = ({
  messageId,
  pComments
}) => {
  const [newComment, setNewComment] = useState("");
  const [message_id, setMessageId] = useState(messageId);
  const [comments, setComments] = useState<Comment[]>(pComments || []);
  const { user } = useUser();

  // Handle new comment add
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!message_id) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/message/add_comment/${message_id}`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const newBackendComment = res.data.comment;

      const comment: Comment = {
        id: newBackendComment.id, // from backend
        user: user?.name || "Unknown", // you can also map by user context
        content: newBackendComment.content,
        created_at: new Date(newBackendComment.created_at).toLocaleString(),
      };

      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8 border border-gray-300 p-4">
      <h3 className="text-xl font-semibold mb-3">Comments</h3>
      <div className="space-y-3">
        {comments?.map((c) => (
          <div
            key={c.id}
            className="bg-gray-100 p-3 "
          >
            <div className="text-sm text-gray-600 mb-1">
              {c.user} • {formatDate(c.created_at)}
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
  );
};

export default Comments;