"use client";
import React, { useContext, useState } from "react";
import { FiEdit, FiTrash2, FiThumbsUp, FiMessageCircle } from "react-icons/fi";
import ReplyCommentModal from "./reply-comment-modal";
import ReactSection from "./react-comment-section";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import TickedUser from "@/components/ticked-user/TickedUser";

interface CommentProps {
  comment: {
    _id: string;
    username: string;
    userImage?: string;
    image?: string;
    parentId: string;
    CommentDescription: string;
    totalOfChildComments: number;
    totalReactions: number;
    user?: any;
  };
  user: any;
  userAvatar: string;
  toggleChildComments: (parentId: string) => void;
  expandedComments: Set<string>;
  childComments: Map<string, any[]>;
  videoId: string | undefined;
  setChildComments: any;
  onCommentAdded: () => void;
  onDeleteComment: (commentId: string, parentId: string | null) => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  user,
  userAvatar,
  toggleChildComments,
  expandedComments,
  childComments,
  videoId,
  setChildComments,
  onDeleteComment,
  onCommentAdded,
}) => {
  const { accessToken } = useContext(AuthContext) ?? {};

  const [isReplyModalOpen, setReplyModalOpen] = useState(false);
  const [thisComment, setThisComment] = useState(comment);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editedCommentDescription, setEditedCommentDescription] = useState(
    comment.CommentDescription
  );
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/delete`,
        method: "DELETE",
        body: { commentId: comment._id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data) {
        // Gọi hàm xóa từ component cha
        onDeleteComment(comment._id, comment.parentId);

        // Đóng form xác nhận xóa
        setDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  // Xử lý khi người dùng nhấn nút "Edit"
  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  // Xử lý khi người dùng submit chỉnh sửa comment
  const handleEditSubmit = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/update`,
        method: "POST",
        body: {
          commentId: comment._id,
          CommentDescription: editedCommentDescription,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data) {
        setThisComment((prev) => ({
          ...prev,
          CommentDescription: editedCommentDescription,
        }));
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    }
  };

  const handleNewReply = (newReply: any) => {
    setChildComments((prev: Map<string, any[]>) => {
      const updatedMap = new Map(prev);
      const existingReplies: any[] = updatedMap.get(comment._id) || [];
      updatedMap.set(comment._id, [...existingReplies, newReply]);

      // // Tự động mở comment con nếu chưa mở
      // if (!expandedComments.has(comment._id)) {
      //   toggleChildComments(comment._id);
      // }
      setThisComment((prevState) => ({
        ...prevState,
        totalOfChildComments: prevState.totalOfChildComments + 1,
      }));
      onCommentAdded!();
      return updatedMap;
    });
  };

  const onReactionAdded = () => {
    if (thisComment) {
      setThisComment({
        ...comment,
        totalReactions: (thisComment.totalReactions || 0) + 1,
      });
    }
  };
  const onReactionRemove = () => {
    if (comment) {
      setThisComment({
        ...comment,
        totalReactions: (thisComment.totalReactions || 0) - 1,
      });
    }
  };

  const handleReplyClick = () => {
    setReplyModalOpen((prev) => !prev);
    toggleChildComments(comment._id);
  };

  const handleCancel = () => {
    setReplyModalOpen((prev) => !prev);
    toggleChildComments(comment._id);
  };

  return (
    <div key={comment._id} className="mb-4">
      <div className="comment flex gap-3 p-3 rounded-lg group transition-all">
        <img
          src={comment.userImage ? comment.userImage : comment.image}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">
            {comment.username}
            <TickedUser userId={comment.user._id} />
          </p>
          <p>{thisComment.CommentDescription}</p>
          {user && comment?.user?._id === user?._id ? (
            <div className="flex justify-end w-full opacity-0 group-hover:opacity-100">
              <button
                className="flex  p-1 hover:bg-gray-200"
                onClick={handleEditClick}
              >
                <FiEdit />
              </button>
              <button
                className="flex p-1 hover:bg-red-200"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <FiTrash2 />
              </button>
            </div>
          ) : (
            user && (
              <div className="flex justify-start opacity-0 group-hover:opacity-100">
                <button className="text-blue-500 flex items-center">
                  <ReactSection
                    commentId={comment._id}
                    onReactionAdded={onReactionAdded}
                    onReactionRemove={onReactionRemove}
                  />
                  <p className="text-gray-400 text-xl">
                    {thisComment.totalReactions
                      ? thisComment.totalReactions
                      : 0}
                  </p>
                </button>

                <button
                  className="text-green-500 flex items-center ml-5 text-2xl"
                  onClick={handleReplyClick}
                >
                  <FiMessageCircle />
                  <p className="text-gray-400 text-xl ">
                    {thisComment.totalOfChildComments
                      ? thisComment.totalOfChildComments
                      : 0}
                  </p>
                </button>
              </div>
            )
          )}

          {/* {comment.totalOfChildComments > 0 && (
            <button
              className="text-sm text-gray-500 mt-2 hover:underline"
              onClick={() => toggleChildComments(comment._id)}
            >
              {expandedComments.has(comment._id)
                ? "Hide replies"
                : `View ${comment.totalOfChildComments} replies`}
            </button>
          )} */}
        </div>
      </div>
      {expandedComments.has(comment._id) &&
        childComments.get(comment._id)?.map((child) => (
          <div key={child._id} className="ml-10">
            <div className="comment flex gap-3 p-3 bg-gray-100 rounded-lg group hover:bg-gray-200 transition-all">
              <img
                src={child.avatar || userAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{child.username}</p>
                <p>{child.CommentDescription}</p>
                {/* <div className="flex justify-between mt-2 space-x-10 opacity-0 group-hover:opacity-100">
                  {comment.username !== user.username ? (
                    <div className="flex">
                      <button className="text-blue-500 flex items-center">
                        <FiThumbsUp />
                      </button>
                      <button className="text-green-500 flex items-center ml-3">
                        <FiMessageCircle />
                      </button>
                    </div>
                  ) : (
                    <div className="flex">
                      <button className="flex items-center gap-1 w-full p-1 hover:bg-gray-200">
                        <FiEdit />
                      </button>
                      <button className="flex items-center gap-1 w-full p-1 hover:bg-red-200">
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        ))}

      {isEditModalOpen && (
        <div className="flex gap-3 p-3 mt-2">
          {/* Avatar */}
          <img
            src={comment.userImage || userAvatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Form chỉnh sửa */}
          <div className="flex-1">
            <textarea
              value={editedCommentDescription}
              onChange={(e) => setEditedCommentDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              // rows={3}
              placeholder="Edit your comment..."
              onKeyDown={handleKeyDown}
            />

            {/* Nút Save và Cancel */}
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleEditSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="flex gap-3 p-3 mt-2">
          {/* Avatar */}
          <img
            src={comment.userImage || userAvatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Form xác nhận xóa */}
          <div className="flex-1">
            <p className="text-gray-700">Do you want to delete this comment?</p>

            {/* Nút Xác nhận và Hủy */}
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {user && isReplyModalOpen && (
        <ReplyCommentModal
          onCancel={handleCancel}
          parentId={comment._id}
          userId={user._id}
          videoId={videoId}
          userAvatar={userAvatar}
          onReplySuccess={handleNewReply} // Cập nhật UI
        />
      )}
    </div>
  );
};

export default Comment;
