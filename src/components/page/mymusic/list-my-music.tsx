"use client";

import { useEffect, useState, useContext } from "react";
import CardMusic from "@/components/music/card.music";
import { handleGetMyMusic } from "@/actions/music.action";
import { AuthContext } from "@/context/AuthContext";

interface MyMusicProps {
  userId?: string;
  isOwner?: boolean;
}

const MyMusic = ({ userId, isOwner }: MyMusicProps) => {
  const { user } = useContext(AuthContext) ?? {};
  // Ưu tiên prop userId, fallback context
  const currentUserId = userId || user?._id;

  const [myMusic, setMyMusic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyMusic = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const response = await handleGetMyMusic(currentUserId, "1", "30");
        if (response?.data?.result) {
          setMyMusic(response.data.result);
        } else {
          setMyMusic([]);
        }
      } catch (error) {
        console.error("Error fetching music:", error);
      }
      setLoading(false);
    };

    fetchMyMusic();
  }, [currentUserId]);

  return (
    <div className="p-0 bg-transparent">
      {loading ? (
        <p className="text-gray-300 text-center">Loading...</p>
      ) : myMusic.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 py-6">
          {myMusic.map((item: any) => (
            <div
              key={item._id}
              className="bg-[#2d2250cc] rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02]"
            >
              <CardMusic
                isEdit={!!isOwner}
                showPlaying={false}
                handlePlayer={() => {}}
                isPlaying={false}
                item={item}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 text-center w-full">No music found.</p>
      )}
    </div>
  );
};

export default MyMusic;
