"use client";

import { useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { handleCreateCommentAction } from "@/actions/music.action";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Comment from "./comment";

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
      alert("Bạn cần đăng nhập để bình luận!");
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
    <div className="relative h-[46vh] border rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Bình luận</h3>

      {/* Danh sách bình luận có thể cuộn */}
      <div className="overflow-y-auto max-h-[30vh] space-y-3 pr-2">
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
          <p className="text-gray-500 text-center">Chưa có bình luận nào.</p>
        )}
      </div>

      {/* Ô nhập bình luận - cố định dưới cùng */}
      <div className="absolute w-[98%] bottom-0 left-0 right-0 bg-white border-t mx-2 p-2 flex justify-between items-center mr-8">
        <textarea
          className="w-5/6 p-2 border rounded h-10 resize-none"
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 h-10 text-white px-4 py-1 rounded w-16"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
