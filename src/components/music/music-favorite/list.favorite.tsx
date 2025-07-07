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

  const [favoriteMusic, setFavoriteMusic] = useState<any[]>([]);
  const [areItemsHidden, setAreItemsHidden] = useState(false);
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
    setAreItemsHidden((prev) => !prev);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-40 mt-[-22px]">
      <div className="flex justify-between items-center mb-4 mx-20">
        <h2 className="text-xl font-bold">List of Favorite Music</h2>
        <button
          onClick={toggleAllItems}
          className="text-gray-600 hover:text-gray-800"
          title={areItemsHidden ? "Show all music" : "Hide all music"}
        >
          {areItemsHidden ? <FaUnlock size={20} /> : <FaLock size={20} />}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : !areItemsHidden ? (
        favoriteMusic.length > 0 ? (
          <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
            {favoriteMusic
              .filter((item) => item && item._id) // Lọc bỏ phần tử null hoặc không có _id
              .map((item) => (
                <CardMusic
                  key={item._id}
                  handlePlayer={() => {}}
                  isPlaying={false}
                  item={item}
                />
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center w-full">
            No favorite music found.
          </p>
        )
      ) : null}
    </div>
  );
};

export default ListFavoriteMusic;
