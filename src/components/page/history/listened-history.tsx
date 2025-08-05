"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { handleGetAllListeningHistory } from "@/actions/music.action";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/library/global.context";

interface Music {
  _id: string;
  musicDescription: string;
  musicThumbnail: string;
  musicUrl: string;
  totalListener: number;
  totalReactions: number;
}

interface ListeningHistory {
  _id: string;
  musicId: Music;
  createdAt: string;
}

interface ListenedHistoryProps {
  setHistory?: React.Dispatch<React.SetStateAction<ListeningHistory[]>>;
}

const ListenedHistory = ({
  setHistory: setParentHistory,
}: ListenedHistoryProps) => {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?._id;
  const [history, setHistory] = useState<ListeningHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshHistoryMusic } = useGlobalContext()!

  useEffect(() => {
    if (userId) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          const response = await handleGetAllListeningHistory(userId);
          if (response?.data?.result) {
            setHistory(response.data.result);
            if (setParentHistory) {
              setParentHistory(response.data.result);
            }
          } else {
            console.warn("No listening history found!");
            setHistory([]);
            if (setParentHistory) setParentHistory([]);
          }
        } catch (err) {
          setError("Error fetching history data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [userId, setParentHistory, refreshHistoryMusic]);

  const handleNavigateToMusic = (musicId: string) => {
    router.push(`/page/music/${musicId}`);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!history.length)
    return <p className="text-center text-gray-500">No music history found.</p>;

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4 ">
        <div className="space-y-4">
          {history.map((item) => {
            const music = item.musicId;
            return (
              <div
                key={item._id}
                className="flex items-center bg-[#18182c] shadow-md rounded-lg p-4"
              >
                <img
                  src={music?.musicThumbnail}
                  className="w-32 h-32 object-cover rounded-md shadow-sm cursor-pointer"
                  alt={music?.musicDescription}
                  onClick={() => handleNavigateToMusic(music?._id)}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white-900">
                    {music?.musicDescription}
                  </h3>
                  <p className="text-sm text-white-700">
                    Views: {music?.totalListener || 0}
                  </p>
                  <p className="text-sm text-white-700">
                    Reactions: {music?.totalReactions || 0}
                  </p>
                  <p className="text-sm text-white-700">
                    View At: {new Date(item.createdAt).toLocaleTimeString()}{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListenedHistory;
