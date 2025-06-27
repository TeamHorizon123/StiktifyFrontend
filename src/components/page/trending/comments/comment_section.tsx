"use client";

import React, { useState, useEffect, useContext, Fragment } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, Button } from "antd";

interface CommentSectionProps {
  videoId: string | undefined;
  showComments: boolean;
  onCommentAdded?: () => void;
}

interface CommentI {
  _id: string;
  username: string;
  image?: string;
  parentId: string | null;
  CommentDescription: string;
  totalOfChildComments: number;
  totalReactions: number;
  createdAt?: string;
}

const CommentItem: React.FC<{
  comment: CommentI;
  depth?: number;
  canExpand?: boolean;
  childCount?: number;
  isExpanded?: boolean;
  onToggleReplies?: (parentId: string) => void;
}> = ({
  comment,
  depth = 0,
  canExpand,
  childCount = 0,
  isExpanded,
  onToggleReplies,
}) => {
  return (
    <div className={depth === 0 ? "space-y-3" : `space-y-3 ml-${depth * 4}`}>
      {/* indent */}
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 shrink-0">
          {/* <AvatarImage
            src={comment.image || "/placeholder.svg?height=32&width=32"}
          />
          <AvatarFallback>
            {comment.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback> */}
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Username & time */}
          <div className="flex items-center gap-2 mb-1 truncate">
            <span className="text-white font-medium text-sm truncate">
              {comment.username}
            </span>
            {comment.createdAt && (
              <span className="text-gray-400 text-xs">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Content */}
          <p className="text-gray-300 text-sm break-words mb-2">
            {comment.CommentDescription}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-xs select-none">
            <Button
              size="small"
              className="text-gray-400 hover:text-white p-0 h-auto flex items-center gap-1"
            >
              <ThumbsUp className="h-3 w-3" />
              {comment.totalReactions}
            </Button>

            {canExpand && (
              <Button
                size="small"
                className="text-gray-400 hover:text-white p-0 h-auto flex items-center gap-1"
                onClick={() => onToggleReplies?.(comment._id)}
              >
                {isExpanded ? (
                  <>
                    Hide replies <ChevronUp className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    {childCount} replies{" "}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const CommentSection: React.FC<CommentSectionProps> = ({
  videoId,
  showComments,
  onCommentAdded,
}) => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<CommentI[]>([]);
  const [childComments, setChildComments] = useState<Map<string, CommentI[]>>(
    new Map()
  );
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  useEffect(() => {
    if (!videoId || !showComments) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/video/${videoId}`,
          method: "GET",
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        });
        if (res.statusCode === 200) {
          setComments(res.data);
        }
      } catch (err) {
        console.error("Error fetching comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId, accessToken, showComments]);

  const toggleReplies = async (parentId: string) => {
    setExpandedComments((prev) => {
      const n = new Set(prev);
      if (n.has(parentId)) n.delete(parentId);
      else n.add(parentId);
      return n;
    });

    if (!childComments.has(parentId)) {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/child-comments/${parentId}`,
          method: "GET",
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        });
        if (res.statusCode === 200) {
          setChildComments((prev) => new Map(prev).set(parentId, res.data));
        }
      } catch (err) {
        console.error("Error fetching child comments", err);
      }
    }
  };

  const renderCommentTree = (comment: CommentI, depth = 0): React.ReactNode => {
    const children = childComments.get(comment._id) || [];
    const isExpanded = expandedComments.has(comment._id);
    const hasReplies = comment.totalOfChildComments > 0;

    return (
      <Fragment key={comment._id}>
        <CommentItem
          comment={comment}
          depth={depth}
          canExpand={hasReplies}
          childCount={comment.totalOfChildComments}
          isExpanded={isExpanded}
          onToggleReplies={toggleReplies}
        />
        {isExpanded &&
          children.map((child) => renderCommentTree(child, depth + 1))}
      </Fragment>
    );
  };
  if (!showComments) return null;

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">No comments yet.</p>
      ) : (
        comments.map((c) => renderCommentTree(c))
      )}
    </div>
  );
};

export default CommentSection;
