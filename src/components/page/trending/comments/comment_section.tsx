import React, { useState, useEffect, useRef, useContext } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

import Comment from "./comment";
import CreateCommentModal from "./create-comment-modal";

interface CommentSectionProps {
  videoId: string | undefined;
  onCommentClick: () => void;
  showComments: boolean;
  onCommentAdded?: () => void;
  onCommentRemove?: () => void;
}

interface Comment {
  _id: string;
  username: string;
  image?: string;
  parentId: any;
  CommentDescription: string;
  totalOfChildComments: number;
  totalReactions: number;
  user?: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  videoId,
  onCommentClick,
  showComments,
  onCommentAdded,
  onCommentRemove,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [childComments, setChildComments] = useState<Map<string, Comment[]>>(
    new Map()
  );
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");
  const commentSectionRef = useRef<HTMLDivElement | null>(null);

  const { accessToken, user } = useContext(AuthContext) ?? {};
  const userAvatar =
    user?.image ||
    "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"; // Avatar mặc định

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/video/${videoId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.statusCode === 200) {
          setComments(res.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchComments();
  }, [videoId]);

  const handleRemoveComment = (commentId: string, parentId: string | null) => {
    if (parentId) {
      console.log("hello");

      // Nếu comment có parentId, xóa nó khỏi danh sách childComments của parent
      setChildComments((prev) => {
        const updatedMap = new Map(prev);
        const parentCommentReplies = updatedMap.get(parentId);
        if (parentCommentReplies) {
          updatedMap.set(
            parentId,
            parentCommentReplies.filter((c) => c._id !== commentId)
          );
        }
        return updatedMap;
      });
    } else {
      // Nếu comment không có parentId, xóa nó khỏi danh sách comments chính
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    }

    // Gọi hàm onCommentRemove từ props (nếu có)
    onCommentRemove!();
  };

  const handlePostComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/create`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { videoId, CommentDescription: newComment },
      });
      console.log(res);

      if (res.statusCode === 201) {
        setComments([
          ...comments,
          {
            _id: res.data._id,
            username: user.name,
            image: userAvatar,
            parentId: null,
            CommentDescription: res.data.CommentDescription,
            totalOfChildComments: 0,
            totalReactions: 0,
            user: {
              _id: user._id,
            },
          },
        ]);
        setNewComment("");
        onCommentAdded?.();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const toggleChildComments = async (parentId: string) => {
    const updatedExpanded = new Set(expandedComments);
    if (updatedExpanded.has(parentId)) {
      updatedExpanded.delete(parentId);
    } else {
      updatedExpanded.add(parentId);
      if (!childComments.has(parentId)) {
        try {
          const res = await sendRequest<any>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/child-comments/${parentId}`,
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.statusCode === 200) {
            setChildComments(new Map(childComments.set(parentId, res.data)));
          }
        } catch (error) {
          console.error("Error fetching child comments:", error);
        }
      }
    }
    setExpandedComments(updatedExpanded);
  };

  return (
    showComments && (
      <div
        ref={commentSectionRef}
        className="w-[25%] bg-white shadow-lg absolute right-0 top-[95px] pt-10 pl-2 h-[87%] flex flex-col justify-between z-50"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Comments</h3>
          <button onClick={onCommentClick} className="text-sm text-blue-500">
            Hide
          </button>
        </div>

        <div className="comments-list p-4 overflow-y-auto flex-1">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                comment={comment}
                childComments={childComments}
                expandedComments={expandedComments}
                toggleChildComments={toggleChildComments}
                user={user}
                userAvatar={userAvatar}
                key={comment._id}
                videoId={videoId}
                setChildComments={setChildComments}
                onDeleteComment={handleRemoveComment}
                onCommentAdded={onCommentAdded!}
              />
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        {user && (
          <CreateCommentModal
            handlePostComment={handlePostComment}
            newComment={newComment}
            setNewComment={setNewComment}
            userAvatar={userAvatar}
          />
        )}
      </div>
    )
  );
};

export default CommentSection;
