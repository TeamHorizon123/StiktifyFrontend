"use client";
import React, { useContext, useState } from "react";
import { FiEdit, FiTrash2, FiThumbsUp, FiMessageCircle } from "react-icons/fi";
import ReplyCommentModal from "./reply-comment-modal";
import ReactSection from "./react-comment-section";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import TickedUser from "@/components/ticked-user/TickedUser";
import { useRouter } from "next/navigation";

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
  userImage: string;
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
  userImage,
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
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyText, setEditingReplyText] = useState("");
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);

  const replies = childComments.get(comment._id) || [];
  const replyCount = thisComment.totalOfChildComments || replies.length;
  const router = useRouter();

  const handleDeleteConfirm = async () => {
    if (!accessToken) return;
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/delete`,
        method: "DELETE",
        body: { commentId: comment._id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data) {
        onDeleteComment(comment._id, comment.parentId);
        setDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!accessToken) return;
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

  const handleNewReply = (newReply: any) => {
    setChildComments((prev: Map<string, any[]>) => {
      const updatedMap = new Map(prev);
      const existingReplies: any[] = updatedMap.get(comment._id) || [];
      updatedMap.set(comment._id, [...existingReplies, newReply]);
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

  const handleReplySubmit = async () => {
    if (!accessToken) return;
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/reply/${comment._id}`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          parentId: comment._id,
          videoId,
          CommentDescription: replyText,
        },
      });
      if (res.statusCode === 201) {
        setReplyText("");
        setReplyModalOpen(false);

        // Đảm bảo replies hiển thị ngay lập tức
        setShowAllReplies(true);

        // Đảm bảo expandedComments có parentId
        if (!expandedComments.has(comment._id)) {
          toggleChildComments(comment._id);
        }

        handleNewReply({
          _id: res.data._id,
          username: user?.name || "Unknown",
          userImage: userImage, // Thêm userImage
          parentId: comment._id,
          CommentDescription: replyText,
          totalOfChildComments: 0,
          totalReactions: 0,
          createdAt: new Date().toISOString(),
          user: { _id: user?._id },
        });
      }
    } catch (error) {
      console.error("Error replying:", error);
    } finally {
      setReplyLoading(false);
    }
  };

  // Add missing handleEditReply function
  const handleEditReply = async (replyId: string) => {
    if (!accessToken) return;
    if (!editingReplyText.trim()) return;
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/update`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          commentId: replyId,
          CommentDescription: editingReplyText,
        },
      });
      if (res.data) {
        setChildComments((prev: Map<string, any[]>) => {
          const updated = new Map(prev);
          const arr = [...(updated.get(comment._id) || [])];
          const idx = arr.findIndex((c) => c._id === replyId);
          if (idx !== -1) {
            arr[idx] = { ...arr[idx], CommentDescription: editingReplyText };
            updated.set(comment._id, arr);
          }
          return updated;
        });
        setEditingReplyId(null);
        setEditingReplyText("");
      }
    } catch (error) {
      console.error("Error editing reply:", error);
    }
  };

  // Add missing handleDeleteReply function
  const handleDeleteReply = async (replyId: string | null) => {
    if (!accessToken || !replyId) return;
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/delete`,
        method: "DELETE",
        body: { commentId: replyId },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data) {
        setChildComments((prev: Map<string, any[]>) => {
          const updated = new Map(prev);
          const arr = [...(updated.get(comment._id) || [])];
          const idx = arr.findIndex((c) => c._id === replyId);
          if (idx !== -1) {
            arr.splice(idx, 1);
            updated.set(comment._id, arr);
          }
          setThisComment((prevState) => ({
            ...prevState,
            totalOfChildComments: Math.max(
              (prevState.totalOfChildComments || 1) - 1,
              0
            ),
          }));
          return updated;
        });
        setDeletingReplyId(null);
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const stopPropagationForKeys = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.stopPropagation();
    }
  };
  const handleProfileClick = () => {
    const userId = comment.user?._id;
    router.push(`/page/detail_user/${userId}`);
  };
  const isOwner = (comment.user?._id || comment.userId) === user?._id;
  return (
    <div key={comment._id} className="mb-4">
      <div className="comment flex gap-3 p-3 rounded-lg transition-all">
        <img
          src={comment.userImage ? comment.userImage : comment.image}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
          onClick={handleProfileClick}
        />
        <div>
          <div className="flex items-center gap-2">
            <p
              className="font-medium text-white text-base"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            >
              {comment.username}
              <TickedUser userId={comment.user?._id} />
            </p>
          </div>
          <p className="text-white text-sm mt-1 mb-2">
            {thisComment.CommentDescription}
          </p>
          {/* Actions */}
          <div className="flex items-center gap-6 text-sm">
            {user && isOwner ? (
              <>
                <button
                  className="flex items-center gap-1 text-gray-300 hover:text-blue-400 bg-transparent border-none shadow-none p-0"
                  onClick={handleEditClick}
                >
                  <FiEdit />
                  Edit
                </button>
                <button
                  className="flex items-center gap-1 text-gray-300 hover:text-red-400 bg-transparent border-none shadow-none p-0"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <FiTrash2 />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center gap-1 text-gray-300 hover:text-purple-400 bg-transparent border-none shadow-none p-0">
                  <ReactSection
                    commentId={comment._id}
                    onReactionAdded={onReactionAdded}
                    onReactionRemove={onReactionRemove}
                  />
                  <span>{thisComment.totalReactions || 0}</span>
                </button>
                <button
                  className="flex items-center gap-1 text-gray-300 hover:text-purple-400 bg-transparent border-none shadow-none p-0"
                  onClick={() => setReplyModalOpen(true)}
                >
                  Reply
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {user && isReplyModalOpen && (
        <div className="flex items-center gap-3 ml-12 mt-2">
          <img
            src={user.userImage || "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                stopPropagationForKeys(e);
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleReplySubmit();
                }
              }}
              className="w-full bg-transparent border border-purple-400 text-white placeholder-gray-400 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:border-purple-500 transition"
              placeholder="Write your reply..."
            />
            <button
              onClick={handleReplySubmit}
              disabled={!replyText.trim() || replyLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full
              ${replyText.trim()
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-purple-900/60"
                }
              text-white transition`}
            >
              <FiMessageCircle className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setReplyModalOpen(false)}
            className="text-gray-400 hover:text-white ml-2"
          >
            Cancel
          </button>
        </div>
      )}
      {replyCount > 0 && (
        <button
          className="ml-12 text-purple-400 text-sm hover:underline bg-transparent border-none p-0 mt-1"
          onClick={() => {
            if (!showAllReplies) {
              if (!expandedComments.has(comment._id)) {
                toggleChildComments(comment._id);
              }
              setShowAllReplies(true);
            } else {
              setShowAllReplies(false);
            }
          }}
        >
          {showAllReplies ? "Hide" : `View ${replyCount} comment`}
        </button>
      )}
      {showAllReplies &&
        expandedComments.has(comment._id) &&
        replyCount > 0 && (
          <div className="ml-12 mt-2">
            {replies.map((child, idx) => {
              const isChildOwner =
                (child.userId?._id) === user?._id;
              console.log("Child Comment:", child);

              return (
                <div
                  key={child._id}
                  className="flex gap-3 p-3 rounded-lg bg-white/5 mb-2"
                >
                  <img
                    src={child.userImage}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">
                        {child.username}
                      </span>
                      {child.createdAt && (
                        <span className="text-gray-400 text-xs ml-2">
                          {new Date(child.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {editingReplyId === child._id ? (
                      <div className="mt-2">
                        <textarea
                          value={editingReplyText}
                          onChange={(e) => setEditingReplyText(e.target.value)}
                          className="w-full p-2 border border-purple-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-white"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm"
                            onClick={() => {
                              setEditingReplyId(null);
                              setEditingReplyText("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm"
                            onClick={() => handleEditReply(child._id)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-white text-sm mt-1">
                          {child.CommentDescription}
                        </p>
                        <div className="flex items-center gap-6 text-sm mt-1">
                          {isChildOwner ? (
                            <>
                              <button
                                className="flex items-center gap-1 text-gray-300 hover:text-blue-400 bg-transparent border-none shadow-none p-0"
                                onClick={() => {
                                  setEditingReplyId(child._id);
                                  setEditingReplyText(child.CommentDescription);
                                }}
                              >
                                <FiEdit />
                                Edit
                              </button>
                              <button
                                className="flex items-center gap-1 text-gray-300 hover:text-red-400 bg-transparent border-none shadow-none p-0"
                                onClick={() => setDeletingReplyId(child._id)}
                              >
                                <FiTrash2 />
                                Delete
                              </button>
                            </>
                          ) : (
                            <button className="flex items-center gap-1 text-gray-300 hover:text-purple-400 bg-transparent border-none shadow-none p-0">
                              <ReactSection
                                commentId={child._id}
                                onReactionAdded={() => {
                                  setChildComments(
                                    (prev: Map<string, any[]>) => {
                                      const updated = new Map(prev);
                                      const arr = [
                                        ...(updated.get(comment._id) || []),
                                      ];
                                      arr[idx] = {
                                        ...arr[idx],
                                        totalReactions:
                                          (arr[idx].totalReactions || 0) + 1,
                                      };
                                      updated.set(comment._id, arr);
                                      return updated;
                                    }
                                  );
                                }}
                                onReactionRemove={() => {
                                  setChildComments(
                                    (prev: Map<string, any[]>) => {
                                      const updated = new Map(prev);
                                      const arr = [
                                        ...(updated.get(comment._id) || []),
                                      ];
                                      arr[idx] = {
                                        ...arr[idx],
                                        totalReactions: Math.max(
                                          (arr[idx].totalReactions || 1) - 1,
                                          0
                                        ),
                                      };
                                      updated.set(comment._id, arr);
                                      return updated;
                                    }
                                  );
                                }}
                              />
                              <span>{child.totalReactions || 0}</span>
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Edit your comment</h2>
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <textarea
                  value={editedCommentDescription}
                  onChange={(e) => setEditedCommentDescription(e.target.value)}
                  className="w-full p-3 border border-purple-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700 text-white"
                  placeholder="Edit your comment..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={handleEditSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <p className="text-white">
                  Do you want to delete this comment?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete confirmation popup cho reply */}
      {deletingReplyId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <p className="text-white mb-4">Do you want to delete this reply?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                onClick={() => setDeletingReplyId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={() => handleDeleteReply(deletingReplyId)}
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
