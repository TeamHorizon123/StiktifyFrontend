"use client";

import { useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { handleCreateCommentAction } from "@/actions/music.action";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Comment from "./comment";
import { a } from "framer-motion/client";

interface Comment {
  _id: string;
  username: string;
  userImage: string;
  musicId: string;
  parentId?: string;
  CommentDescription: string;
  totalReactions: number;
  userId: {
    _id: string;
  };
}

const CommentSection = ({
  musicId,
  onNewComment,
  handleDeleteComment,
}: {
  musicId: string;
  onNewComment: () => void;
  handleDeleteComment: () => void;
}) => {
  const { user, accessToken } = useContext(AuthContext) || {};
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const [likedComments, setLikedComments] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleLike = async (id: string) => {
    if (!accessToken) return;
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comment-reactions/like-music-comment`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { commentId: id },
      });

      if (res.statusCode === 201) {
        if (res.data) {
          // Nếu chưa like và like thành công -> Cập nhật totalReactions
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === id
                ? { ...comment, totalReactions: comment.totalReactions + 1 }
                : comment
            )
          );
          setLikedComments((prev) => ({
            ...prev,
            [id]: true,
          }));
        } else {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === id
                ? { ...comment, totalReactions: comment.totalReactions - 1 }
                : comment
            )
          );
          setLikedComments((prev) => ({
            ...prev,
            [id]: false,
          }));
        }
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  const updateComment = (id: string, newText: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === id
          ? { ...comment, CommentDescription: newText }
          : comment
      )
    );
  };

  const deleteComment = (id: string) => {
    handleDeleteComment();
    setComments((prev) => prev.filter((comment) => comment._id !== id));
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    const fetchComments = async () => {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/music/${musicId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setComments(res.data || []);

        if (user) {
          const likedRes = await Promise.all(
            res.data.map((comment: Comment) =>
              sendRequest<any>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comment-reactions/getReactByUser`,
                method: "POST",
                headers: { Authorization: `Bearer ${accessToken}` },
                body: { commentId: comment._id },
              })
            )
          );

          console.log(likedRes);

          // Cập nhật trạng thái likedComments
          const likedMap: { [key: string]: boolean } = {};
          likedRes.forEach((reaction, index) => {
            if (reaction.data && reaction.data.reactionTypeId) {
              likedMap[res.data[index]._id] = true;
            }
          });

          setLikedComments(likedMap);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [musicId]);

  const handleSubmit = async () => {
    if (!user) {
      alert("You need to log in to comment!");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await handleCreateCommentAction(musicId, newComment);

      const comment = res.data;
      if (comment) {
        setComments([
          ...comments,
          {
            _id: comment._id,
            username: user.name,
            musicId,
            CommentDescription: newComment,
            userImage: user.image,
            totalReactions: 0,
            userId: {
              _id: user._id,
            },
          },
        ]);

        setNewComment("");
        onNewComment(); // Gọi hàm callback để tăng số lượng bình luận
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="relative h-[46vh] p-4">
      <h3 className="text-xl font-bold mb-4 text-white">Comments</h3>

      {/* Scrollable comment list */}
      <div className="overflow-y-auto max-h-[28vh] space-y-3 pr-2 custom-scrollbar">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              liked={likedComments[comment._id] || false}
              userId={user?._id || ""}
              toggleLike={toggleLike}
              deleteComment={deleteComment}
              updateComment={updateComment}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">No comments yet.</p>
        )}
      </div>

      {/* Comment input box - fixed at the bottom */}
      <div className="absolute w-[98%] bottom-0 left-0 right-0 bg-[#23234a] border-t border-[#35356b] mx-2 p-2 flex justify-between items-center rounded-b-2xl">
        <textarea
          className="w-5/6 p-2 bg-[#23234a] text-white border border-[#35356b] rounded-lg h-10 resize-none focus:outline-none focus:ring-2 focus:ring-[#7c3aed] placeholder-gray-400"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] h-10 text-white px-6 py-1 rounded-lg font-semibold shadow hover:from-[#a78bfa] hover:to-[#7c3aed] transition-all"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
