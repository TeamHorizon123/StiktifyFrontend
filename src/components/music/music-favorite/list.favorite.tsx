"use client";

import { useEffect, useState, useContext } from "react";
import CardMusic from "@/components/music/card.music";
import { handleGetAllFavoriteMusic } from "@/actions/music.action";
import { AuthContext } from "@/context/AuthContext";

interface ListFavoriteMusicProps {
  userId?: string;
}

const ListFavoriteMusic = ({ userId }: ListFavoriteMusicProps) => {
  const { user } = useContext(AuthContext) ?? {};
  const currentUserId = userId || user?._id;
  const [favoriteMusic, setFavoriteMusic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = "1";
  const pageSize = "30";

  useEffect(() => {
    const fetchFavoriteMusic = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const response = await handleGetAllFavoriteMusic(
          currentUserId,
          currentPage,
          pageSize
        );
        if (response?.data) {
          setFavoriteMusic(response.data);
        } else {
          setFavoriteMusic([]);
        }
      } catch (error) {
        console.error("Error fetching favorite music:", error);
      }
      setLoading(false);
    };

    fetchFavoriteMusic();
  }, [currentUserId]);

  return (
    <div className="p-6 mb-40 mt-[-22px]">
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} />
          ))}
        </div>
      ) : favoriteMusic.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-3 mx-2">
          {favoriteMusic
            .filter((item) => item && item._id)
            .map((item) => (
              <div
                key={item._id}
                className="flex justify-center items-stretch"
              >
                <div className="w-[160px] sm:w-[170px] md:w-[180px] lg:w-[190px]">
                  <CardMusic
                    handlePlayer={() => { }}
                    isPlaying={false}
                    item={item}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg font-medium">
            No liked music found
          </p>
        </div>
      )}
    </div>
  );
};

export default ListFavoriteMusic;
