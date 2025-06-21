"use client";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { formatDateTimeVn } from "@/utils/utils";
import { Dropdown, MenuProps } from "antd";
import throttle from "lodash.throttle";
import { useRouter } from "next/navigation";

import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";

interface HistoryListProps {
  videoList: VideoHistoryProps[];
  maxLength: Boolean;
  currentPage: number;
  setIsFetch: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setMaxLength: Dispatch<SetStateAction<boolean>>;
  setVideoList: Dispatch<SetStateAction<VideoHistoryProps[]>>;
}

const HistoryList: React.FC<HistoryListProps> = ({
  videoList,
  maxLength,
  setIsFetch,
  setCurrentPage,
  setVideoList,
  currentPage,
  setMaxLength,
}) => {
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  const lastVideoRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (maxLength) return;

      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < 100) {
        if (currentPage > videoList.length / 10) {
          setMaxLength(true);
        } else {
          setIsFetch(true);
          setCurrentPage((prev) => prev + 1);
        }
      }
    }, 300); // Chỉ gọi tối đa 1 lần mỗi 300ms

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [videoList]);

  const handleClearHistory = async (id: string, index: number) => {
    await sendRequest<IBackendRes<IVideo[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/viewinghistory/clear`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: { id },
    });

    setVideoList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-[70%] bg-white p-4">
      {videoList.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videoList.map((history, index) => {
          const items: MenuProps["items"] = [
            {
              key: "1",
              label: (
                <div
                  onClick={() => handleClearHistory(history._id, index)}
                  className="w-[300px] flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 448 512"
                  >
                    <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.7 23.7 0 0 0 -21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0 -16-16z" />
                  </svg>
                  <span className="text-sm font-medium">
                    Clear this watch history
                  </span>
                </div>
              ),
            },
          ];

          return (
            <div
              key={history._id}
              className="mb-[10px] p-[10px] pl-[20px] border-b flex gap-4 cursor-pointer"
              ref={index === videoList?.length - 1 ? lastVideoRef : null}
            >
              <img
                onClick={() => {
                  router.push(`/page/trending-user?id=${history.videoId._id}`);
                }}
                src={history.videoId?.videoThumbnail}
                alt="Thumbnail"
                className="w-[250px] h-[150px] object-cover border-3 border-gray-300 rounded-lg"
              />

              <div
                className="flex-1"
                onClick={() => {
                  router.push(`/page/trending-user?id=${history.videoId._id}`);
                }}
              >
                <h3 className="font-semibold text-lg">
                  {history?.videoId?.videoDescription}
                </h3>
                <p className="text-gray-600 text-sm">{`Tags:#${history?.videoId?.videoTag?.join(
                  " #"
                )}`}</p>
                <p>{`Views: ${history?.videoId?.totalViews}`}</p>
                <p>{`Reactions: ${history?.videoId?.totalReaction}`}</p>
                <p>{`View At: ${formatDateTimeVn(history?.updatedAt + "")}`}</p>
              </div>

              <Dropdown
                menu={{ items }}
                trigger={["click"]}
                className="h-7 w-7"
              >
                <div className="text-xl cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 128 512"
                    className="w-7 h-7"
                  >
                    <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                  </svg>
                </div>
              </Dropdown>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HistoryList;
