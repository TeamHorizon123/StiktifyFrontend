"use client";

import { handleSearchUserAndVideo } from "@/actions/search.user.action";
import { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoCustomize from "@/components/video/video.customize";
import Header from "../trending/header";
import { AuthContext } from "@/context/AuthContext";
import { notification } from "antd";

const SearchUser = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || ""; // Lấy dữ liệu từ URL (?q=keyword)
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  const handleNavigateToUser = (userId: string) => {
    if (accessToken) {
      router.push(`/page/detail_user/${userId}`);
    } else {
      notification.error({
        message: "Please login to view user details",
        description: "Please try again later",
      });
    }
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

  useEffect(() => {
    console.log("Users:", users);
    console.log("Videos:", videos);
  }, [users, videos]);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/page/search-user-video?q=${encodeURIComponent(searchValue)}`);
  };
  return (
    <div>
      <div>
        <Header
          isGuest={user ? false : true}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onClick={handleSearch}
        />
        <div className="flex flex-col w-full bg-gray-100">

          <div className="w-full bg-white">
            {/* Search Results */}
            <div className="w-full p-4">
              {loading ? (
                <p className="text-gray-500 text-center">Loading...</p>
              ) : (
                <>
                  {users.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-2">Users</h3>
                      <ul>
                        <ul className="flex flex-row flex-wrap gap-12 p-2">
                          {users.map((user) => (
                            <li
                              key={user._id}
                              className="flex flex-col items-center cursor-pointer"
                              onClick={() => handleNavigateToUser(user._id)}
                            >
                              <img
                                src={user.image}
                                alt={user.fullname}
                                className="w-20 h-20 rounded-full object-cover"
                              />
                              <span className="mt-2 text-center text-sm">
                                {user.fullname}
                                <br />
                                <span className="text-gray-500 text-xs">@{user.userName}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
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
                            className="bg-gray-50 p-4 rounded-lg shadow-md cursor-pointer"
                            onClick={() => router.push(`/page/trending?id=${video._id}`)}
                          >
                            <div className="w-50 h-40 ml-3 rounded-md overflow-hidden relative">
                              <div className="absolute inset-0 w-full h-full">
                                <img
                                  src={video.videoThumbnail}
                                  alt="Video Thumbnail"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain"
                                  }} />
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
      </div>
    </div>
  );
};

export default SearchUser;
