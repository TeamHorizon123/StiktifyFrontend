import { useContext, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import TickedUser from "@/components/ticked-user/TickedUser";

interface CommentProps {
  comment: {
    _id: string;
    username: string;
    userImage: string;
    CommentDescription: string;
    totalReactions: number;
    userId: {
      _id: string;
    };
  };
  userId: string;
  liked: boolean;
  toggleLike: (id: string) => void;
  updateComment: (id: string, newText: string) => void;
  deleteComment: (id: string) => void;
}

const Comment = ({
  comment,
  userId,
  liked,
  toggleLike,
  updateComment,
  deleteComment,
}: CommentProps) => {
  const { accessToken } = useContext(AuthContext) ?? {};

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedText, setEditedText] = useState(comment.CommentDescription);

  // Lưu comment đã chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/update`,
        method: "POST",
        body: {
          commentId: comment._id,
          CommentDescription: editedText,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data) {
        updateComment(comment._id, editedText);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Xác nhận xóa
  const handleConfirmDelete = async () => {
    console.log("comment ?>>>>", comment._id);

    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/deleteMusicComment`,
        method: "DELETE",
        body: { commentId: comment._id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data) {
        setIsDeleting(false);
        deleteComment(comment._id);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div key={comment._id} className="p-3 border rounded-lg bg-white shadow-sm">
      {/* Ảnh + Tên người dùng */}
      <div className="flex gap-3">
        <img
          src={comment.userImage}
          alt={comment.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-600">
            {comment.username} <TickedUser userId={comment.userId._id} />
          </p>

          {/* Nếu đang edit thì hiển thị ô nhập */}
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-700">{comment.CommentDescription}</p>
          )}

          {/* Nút lưu khi đang chỉnh sửa */}
          {isEditing && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-4 py-1 text-sm text-gray-500"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nút Like hoặc Edit/Delete */}
      {comment?.userId?._id !== userId ? (
        <button
          onClick={() => toggleLike(comment._id)}
          className="flex items-center gap-1 mt-2"
        >
          {liked ? (
            <MdFavorite size={20} className="text-red-500 transition-all" />
          ) : (
            <MdFavoriteBorder
              size={20}
              className="text-gray-400 transition-all"
            />
          )}
          <span className="text-sm">{comment.totalReactions}</span>
        </button>
      ) : (
        <div className="flex flex-row mt-2">
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => setIsEditing(true)}
          >
            <FiEdit />
          </button>
          <button
            className="p-1 hover:bg-red-200 rounded"
            onClick={() => setIsDeleting(true)}
          >
            <FiTrash2 />
          </button>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-2">Delete Comment</h2>
            <p className="text-gray-700">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-4 py-2 text-sm text-gray-500"
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
