import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import type { Comment } from "../types";

type CommentsProps = {
  messageId?: string;
  pComments?: Comment[];
};

const Comments: React.FC<CommentsProps> = ({ messageId, pComments }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(pComments || []);
  const { user } = useUser();
  const { notify } = useNotification();
  const [markAsResolution, setMarkAsResolution] = useState(false);

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Turn URLs in text into clickable links
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  // Handle new comment add
  const handleAddComment = async () => {
    if (!newComment || !messageId) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/message/add_comment/${messageId}`,
        {
          content: newComment,
          is_resolution: markAsResolution,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newBackendComment = res.data.comment;

      const comment: Comment = {
        id: newBackendComment.id,
        user: user?.name || "Unknown",
        content: newBackendComment.content,
        created_at: new Date(newBackendComment.created_at).toISOString(),
        is_resolution: newBackendComment.is_resolution || false,
      };
      
      notify("success", "Comment added");
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setMarkAsResolution(false);
    } catch (error) {
      notify("error", "Failed to add comment");
      console.error("Failed to add comment:", error);
    }
  };

  // Handle edit start
  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditContent(c.content);
  };

  // Handle edit save
  const saveEdit = async (id: string) => {
    if (!messageId) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/message/edit_comment/${messageId}/${id}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedComment = res.data.comment;
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, content: updatedComment.content, updated_at: new Date().toISOString() }
            : c
        )
      );

      notify("success", "Comment updated");
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      notify("error", "Failed to edit comment");
      console.error("Failed to edit comment:", error);
    }
  };

  // Handle delete
  const deleteComment = async (id: string) => {
    if (!messageId) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/message/delete_comment/${messageId}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      notify("success", "Comment deleted");
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      notify("error", "Failed to delete comment");
      console.error("Failed to delete comment:", error);
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
            className={`p-3 ${
              c.is_resolution ? "bg-green-100 border border-green-400" : "bg-gray-100"
            }`}
          >
            {/* Header row: user + date + resolution + actions */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <div className="flex items-center gap-2">
                <span>{c.user}</span>
                <span>•</span>
                <span>{formatDate(c.created_at)}</span>
                {c.is_resolution && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-green-200 text-green-800">
                    Resolution
                  </span>
                )}
              </div>

              {/* Actions (hide while editing) */}
              {editingId !== c.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Edit mode */}
            {editingId === c.id ? (
              <div>
                <textarea
                  className="w-full border p-2 mb-2"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(c.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {linkify(c.content)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Comment Input */}
      <div className="mt-4">
        <textarea
          rows={3}
          className="w-full border p-2"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="mt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={markAsResolution}
              onChange={(e) => setMarkAsResolution(e.target.checked)}
            />
            Mark as resolution summary
          </label>
          <button
            onClick={handleAddComment}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 transition"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
