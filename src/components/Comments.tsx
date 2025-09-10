import React, {useState, useEffect} from "react";
import axios from "axios";
import type { Comment } from "../types";

type CommentsProps = {
  pComments?: Comment[];
};

const Comments: React.FC<CommentsProps> = ({
  pComments
}) => {
  const [newComment, setNewComment] = useState("");
  // comments state
  const [comments, setComments] = useState<Comment[]>(pComments || []);

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
    <div className="mt-8 border border-gray-300 p-4">
      <h3 className="text-xl font-semibold mb-3">Comments</h3>
      <div className="space-y-3">
        {comments?.map((c) => (
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
  );
};

export default Comments;