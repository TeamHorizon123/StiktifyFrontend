import React from "react";

interface CreateCommentModalProps {
  userAvatar: string;
  newComment: string;
  setNewComment: (value: string) => void;
  handlePostComment: () => void;
}

const CreateCommentModal: React.FC<CreateCommentModalProps> = ({
  userAvatar,
  newComment,
  setNewComment,
  handlePostComment,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  return (
    <div className="comment-input w-full flex items-center gap-3 p-3 border-t bg-white">
      <img
        src={userAvatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-3 border border-gray-300 rounded-xl"
        placeholder="Write a comment..."
      />
      <button
        onClick={handlePostComment}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        disabled={!newComment.trim()}
      >
        Post
      </button>
    </div>
  );
};

export default CreateCommentModal;
