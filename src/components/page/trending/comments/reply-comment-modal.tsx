import React, { useContext, useState } from "react";
import axios from "axios";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { notification } from "antd";

interface ReplyCommentFormProps {
  parentId: string;
  userId: string;
  videoId: string | undefined;
  userAvatar: string;
  onReplySuccess: (newReply: any) => void; // Hàm gọi lại sau khi gửi thành công
  onCancel: any; // Đóng form khi hủy
}

const ReplyCommentForm: React.FC<ReplyCommentFormProps> = ({
  parentId,
  userId,
  videoId,
  userAvatar,
  onReplySuccess,
  onCancel,
}) => {
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken, user } = useContext(AuthContext) || {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return console.log("no text");
    setLoading(true);
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/reply/${parentId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { parentId, videoId, CommentDescription: replyText },
      });

      if (res.statusCode === 201) {
        notification.success({ message: "Reply successfully" });
        setReplyText("");
        onReplySuccess({
          _id: res.data._id,
          username: user?.name || "Unknown",
          avatar: userAvatar,
          parentId: parentId,
          CommentDescription: replyText,
          totalOfChildComments: 0,
        });
        // onCancel();
      }
    } catch (error) {
      console.error("Error replying to comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 p-3 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-start gap-3">
        <img
          src={userAvatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your reply..."
          className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
          rows={2}
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-gray-500 bg-gray-200 rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleReply}
          className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
          disabled={loading || !replyText.trim()}
        >
          {loading ? "Posting..." : "Reply"}
        </button>
      </div>
    </div>
  );
};

export default ReplyCommentForm;
