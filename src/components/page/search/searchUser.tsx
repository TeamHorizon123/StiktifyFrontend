"use client";

import { handleSearchUserAndVideo } from "@/actions/search.user.action";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoCustomize from "@/components/video/video.customize";

const SearchUser = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || ""; // Lấy dữ liệu từ URL (?q=keyword)

  const [users, setUsers] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNavigateToUser = (userId: string) => {
    router.push(`/page/detail_user/${userId}`);
  };

  useEffect(() => {
    if (!searchTerm) return;
    const fetchResults = async () => {
      setLoading(true);
      const response: any = await handleSearchUserAndVideo(searchTerm, 1, 10);
      const usersData = response?.data?.users?.result || [];
      const videosData = response?.data?.videos?.result || [];
      setUsers(usersData);
      setVideos(videosData);
      setLoading(false);
    };

    fetchResults();
  }, [searchTerm]);

  return (
    <div className="flex flex-col items-center w-full h-[97vh] bg-gray-100 py-10 overflow-hidden">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        {/* Search Results */}
        <div className="overflow-y-auto max-h-[600px] border border-gray-300 rounded-lg w-full p-4">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : (
            <>
              {users.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Users</h3>
                  <ul>
                    {users.map((user) => (
                      <li
                        key={user._id}
                        className="flex items-center space-x-4 p-2 border-b"
                        onClick={() => handleNavigateToUser(user._id)}
                      >
                        <img
                          src={user.image}
                          alt={user.fullname}
                          className="w-10 h-10 rounded-full object-cover"
                          onClick={() => handleNavigateToUser(user._id)}
                        />
                        <span>
                          {user.fullname} (@{user.userName})
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Videos</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video._id}
                        className="bg-gray-50 p-4 rounded-lg shadow-md"
                      >
                        <div className="w-50 h-20 ml-3 rounded-md overflow-hidden relative">
                          <div className="absolute inset-0 w-full h-full">
                            <VideoCustomize
                              videoThumbnail={video.videoThumbnail}
                              videoUrl={video.videoUrl}
                            />
                          </div>
                        </div>
                        <p className="mt-2 text-sm font-semibold">
                          {video.videoDescription}
                        </p>
                        <p className="text-xs text-gray-500">
                          Views: {video.totalViews}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* No results */}
              {users.length === 0 && videos.length === 0 && (
                <p className="text-gray-500 text-center">No results found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
