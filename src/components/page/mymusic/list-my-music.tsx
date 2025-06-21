"use client";

import { useEffect, useState, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CardMusic from "@/components/music/card.music";
import { handleGetMyMusic } from "@/actions/music.action";
import { AuthContext } from "@/context/AuthContext";

const MyMusic = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext) ?? {};
  const userIdFromURL = pathname.split("/").pop();
  const queryUserId = searchParams.get("userId");
  const currentUserId = userIdFromURL || queryUserId || user?._id;

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
    <div className="p-6 bg-white shadow-md rounded-lg mb-40 mt-[-22px]">
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : myMusic.length > 0 ? (
        <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
          {myMusic.map((item: any) => (
            <CardMusic
              isEdit={true}
              showPlaying={false}
              key={item._id}
              handlePlayer={() => { }}
              isPlaying={false}
              item={item}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center w-full">No music found.</p>
      )}
    </div>
  );
};

export default MyMusic;
