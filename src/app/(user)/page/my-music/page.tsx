"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import ListMyMusic from "@/components/page/mymusic/list-my-music";

const MusicMyMusicPage = () => {
  const { user } = useContext(AuthContext) ?? {};
  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-5">🎶 My music 🎶</h1>
      {user ? (
        <ListMyMusic />
      ) : (
        <p className="text-center text-gray-500">You must login!</p>
      )}
    </div>
  );
};

export default MusicMyMusicPage;
