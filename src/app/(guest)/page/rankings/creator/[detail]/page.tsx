"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { notification } from "antd";
interface CreatorProps {
  _id: string;
  fullname: string;
  image: string;
  totalFollows: number;
  totalReactions: number;
  totalViews: number;
}

const DetailPage = ({ params }: { params: { detail: string } }) => {
  const detail = decodeURIComponent(params.detail);
  const [creatorData, setCreatorData] = useState<CreatorProps[]>([]);
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  const router = useRouter();
  useEffect(() => {
    getVideosData();
  }, []);

  const getVideosData = async () => {
    try {
      const res = await sendRequest<IBackendRes<CreatorProps[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/getTopCreator/${detail}`,
        method: "GET",
      });
      console.log(res.data);
      setCreatorData(res.data || []);
    } catch (error) {
      console.log("Failed to fetch top one videos:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .scrollbar-hidden {
          scrollbar-width: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hidden">
        {/* Header */}
        <div className="flex items-end p-6">
          <div className="relative w-full h-80">
            <Image
              src={
                creatorData[0]?.image
                  ? creatorData[0].image
                  : "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"
              }
              alt={creatorData[0]?.fullname}
              sizes="100vw"
              style={{ objectFit: "cover", filter: "blur(8px)" }}
              fill
              className="absolute inset-0 z-0"
            />
            <div className="absolute inset-0 bg-black opacity-50 z-5"></div>
            <div className="absolute bottom-6 left-6 w-48 h-48 z-10">
              <Image
                src={
                  creatorData[0]?.image
                    ? creatorData[0].image
                    : "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"
                }
                alt={creatorData[0]?.fullname}
                sizes="192px"
                style={{ objectFit: "cover" }}
                fill
                className="rounded"
              />
            </div>
            <div className="absolute bottom-6 left-72 text-white">
              <h1 className="text-4xl font-bold mb-2">
                {detail.split("-")[0] === "Views"
                  ? "Top 50 - Views"
                  : "Top 50 - Reactions"}
              </h1>
              <p className="text-sm text-gray-200 mb-2">
                Ranking of Creator with the highest
                {detail.split("-")[0] === "Views"
                  ? " viewed"
                  : detail.split("-")[0] === "Reactions"
                  ? " reacted"
                  : " follow"}{" "}
                of the{" "}
                {detail.split("-")[1] == "alltime"
                  ? "All Time"
                  : detail.split("-")[1].charAt(0).toUpperCase() +
                    detail.split("-")[1].slice(1).toLowerCase()}
                .
              </p>
              <p className="text-sm text-gray-300">
                Stiktify • {creatorData.length.toLocaleString()} Creators •{" "}
                {new Date().toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-12 gap-4 text-gray-600 text-sm font-semibold border-b border-gray-300 pb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-7">FullName</div>
            <div className="col-span-1">Views</div>
            <div className="col-span-1">Reactions</div>
            <div className="col-span-2 text-right">Follows</div>
          </div>

          {creatorData.map((creator, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="col-span-1 w-8 h-8 flex items-center justify-center rounded-full text-gray-600 transition-colors duration-200">
                <span className="group-hover:hidden">{index + 1}</span>
                <span className="hidden group-hover:block">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              <div
                className="col-span-7 flex items-center cursor-pointer"
                onClick={() => {
                  if (accessToken)
                    router.push(
                      `http://localhost:3000/page/detail_user/${creator._id}`
                    );
                  else {
                    return notification.warning({
                      message:
                        "Please create an account to view profile this creator.",
                    });
                  }
                }}
              >
                <div className="relative w-10 h-10 mr-3">
                  <Image
                    src={
                      creator.image
                        ? creator.image
                        : "https://firebasestorage.googleapis.com/v0/b/stiktify-bachend.firebasestorage.app/o/avatars%2Fdefault_avatar.png?alt=media&token=93109c9b-d284-41ea-95e7-4786e3c69328"
                    }
                    alt={creator.fullname}
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                    fill
                    className="rounded"
                  />
                </div>
                <div className="pl-3">
                  <p className="text-black font-medium">{creator.fullname}</p>
                </div>
              </div>
              <div className="col-span-1 text-gray-600">
                {creator.totalViews.toLocaleString()}
              </div>
              <div className="col-span-1 text-gray-600">
                {creator.totalReactions}
              </div>
              <div className="col-span-2 text-gray-600 text-right">
                {creator.totalFollows}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
