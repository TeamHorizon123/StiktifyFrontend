"use client";

import { useState } from "react";
import CommentSection from "@/components/music/comment/comment.section";
import DisplayMusicDetail from "@/components/music/detail.music";

const MusicDetailClient = ({ data, id }: { data: any; id: string }) => {
  const [totalComment, setTotalComment] = useState(data?.totalComment || 0);

  const handleNewComment = () => {
    setTotalComment(totalComment + 1);
  };

  const handleDeleteComment = () => {
    setTotalComment(totalComment - 1);
  };

  return (
    <div>
      <div className="h-[40vh]">
        <DisplayMusicDetail item={{ ...data, totalComment }} />
      </div>
      <div className="h-[46vh]">
        <CommentSection
          musicId={id}
          onNewComment={handleNewComment}
          handleDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
};

export default MusicDetailClient;
