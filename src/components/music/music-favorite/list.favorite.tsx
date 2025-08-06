"use client";

import { useEffect, useState, useContext } from "react";
import CardMusic from "@/components/music/card.music";
import { handleGetAllFavoriteMusic } from "@/actions/music.action";
import { FaLock, FaUnlock } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";

interface ListFavoriteMusicProps {
  userId?: string;
}

const ListFavoriteMusic = ({ userId }: ListFavoriteMusicProps) => {
  const { user } = useContext(AuthContext) ?? {};
  const currentUserId = userId || user?._id;
  const isOwner = user && user._id && user._id === currentUserId;

  const [favoriteMusic, setFavoriteMusic] = useState<any[]>([]);
  const [areItemsHidden, setAreItemsHidden] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem(`favoriteMusicHidden_${currentUserId}`) === "true"
      );
    }
    return false;
  });
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

  const toggleAllItems = () => {
    setAreItemsHidden((prev) => {
      localStorage.setItem(
        `favoriteMusicHidden_${currentUserId}`,
        (!prev).toString()
      );
      return !prev;
    });
  };

  return (
    <div className="p-6 shadow-md rounded-lg mb-40 mt-[-22px]">
      <div className="flex justify-between items-center mb-4 mx-20">
        {isOwner && (
          <button
            onClick={toggleAllItems}
            className="text-gray-600 hover:text-gray-800"
            title={areItemsHidden ? "Show all music" : "Hide all music"}
          >
            {areItemsHidden ? (
              <div className="flex items-center gap-2">
                <FaLock className="text-purple-500" size={20} />
                <span className="text-purple-500"> Private like music</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaUnlock className="text-purple-500" size={20} />
                <span className="text-purple-500"> Public like music</span>
              </div>
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} />
          ))}
        </div>
      ) : areItemsHidden && !isOwner ? (
        <p className="text-gray-500 text-center w-full">
          This is user privacy.
        </p>
      ) : favoriteMusic.length > 0 ? (
        <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
          {favoriteMusic
            .filter((item) => item && item._id)
            .map((item) => (
              <CardMusic
                key={item._id}
                handlePlayer={() => { }}
                isPlaying={false}
                item={item}
              />
            ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center w-full">
          No favorite music found.
        </p>
      )}
    </div>
  );
};

export default ListFavoriteMusic;
