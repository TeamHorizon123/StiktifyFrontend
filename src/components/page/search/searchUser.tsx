"use client";

import { handleSearchUserAndVideo } from "@/actions/search.user.action";
import { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { notification } from "antd";

const SearchUser = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
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

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/page/search-user-video?q=${encodeURIComponent(searchValue)}`);
  };

  return (

    <div className="min-h-screen text-white bg-gray-900">
      {/* Search Bar */}
      <div className="w-full flex items-center justify-center py-4 bg-gray-900">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-[50vw] md:w-[40vw] lg:w-[35vw] px-4 py-2 border border-purple-700 bg-gray-800 text-white placeholder-gray-400 rounded-l-lg focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={handleSearch}
          className="flex items-center justify-center px-4 py-2 rounded-r-lg border border-purple-700 bg-purple-700 hover:bg-purple-800 transition"
          aria-label="Search"
        >
          <svg
            className="h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
          </svg>
        </button>
      </div>

      {/* Results */}
      <div className="flex flex-col w-full">
        <div className="w-full bg-gray-900 pt-8 px-4">
          {loading ? (
            <p className="text-purple-400 text-center">Loading...</p>
          ) : (
            <>
              {users.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">Users</h3>
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
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-600"
                        />
                        <span className="mt-2 text-center text-sm">
                          {user.fullname}
                          <br />
                          <span className="text-purple-400 text-xs">@{user.userName}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {videos.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video._id}
                        className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:border-purple-500 border border-gray-700"
                        onClick={() => router.push(`/page/trending?id=${video._id}`)}
                      >
                        <div className="w-full h-40 rounded-md overflow-hidden relative">
                          <img
                            src={video.videoThumbnail}
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {video.videoDescription}
                        </p>
                        <p className="text-xs text-purple-400">
                          Views: {video.totalViews}
                        </p>
                      </div>
                    </>
                  )}


              {users.length === 0 && videos.length === 0 && !loading && (
                <p className="text-purple-400 text-center">No results found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
