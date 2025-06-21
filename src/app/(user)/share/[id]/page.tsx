"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Copy, Check, Loader2, AlertCircle } from "lucide-react";

interface Video {
  videoUrl: string;
  videoDescription: string;
}

const ShareVideo = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideoShare();
    } else {
      setError("Invalid video ID");
      setLoading(false);
    }
  }, [id]);

  const fetchVideoShare = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/share/${id}`,
        method: "GET",
      });

      if (res?.data) {
        setVideoData({
          videoUrl: res.data.videoUrl,
          videoDescription: res.data.videoDescription,
        });
      } else {
        setError("Video not found");
      }
    } catch (err) {
      setError("Failed to fetch video");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${pathname}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 opacity-50 blur-3xl"></div>
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-2xl w-full border border-gray-200 relative z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Video Sharing
        </h1>

        {loading && (
          <div className="flex flex-col items-center justify-center text-gray-600">
            <Loader2 className="animate-spin w-6 h-6" />
            <p className="mt-2">Loading video...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {videoData && (
          <div className="mt-4 text-center">
            <div className="bg-gray-100 p-2 rounded-xl">
              <video className="w-full rounded-xl shadow-md" controls>
                <source src={videoData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              {videoData.videoDescription}
            </h2>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCopyLink}
                className="
                  px-4 py-2 
                  rounded-md 
                  transition 
                  duration-300 
                  border 
                  border-gray-300 
                  text-gray-700 
                  bg-white 
                  hover:bg-gray-50 
                  hover:shadow-md 
                  active:scale-95 
                  flex 
                  items-center 
                  shadow-sm
                "
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareVideo;
