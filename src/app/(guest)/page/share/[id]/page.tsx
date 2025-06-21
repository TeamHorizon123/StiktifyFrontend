"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Copy, Check, Loader2, AlertCircle, Play, Globe } from "lucide-react";

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
      setError("Invalid video identifier");
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
        setError("Video content could not be retrieved");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden transform transition-all hover:scale-[1.02]">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-4">
            <Globe className="w-10 h-10 text-white/80" />
            Video Sharing
          </h1>
        </div>

        <div className="p-8 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center text-blue-600">
              <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
              <p className="mt-4 text-lg text-blue-700 font-medium">
                Loading video content...
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center bg-red-50 border-2 border-red-300 p-5 rounded-xl text-red-700 shadow-md">
              <AlertCircle className="w-8 h-8 mr-4 shrink-0 text-red-500" />
              <p className="text-base font-semibold">{error}</p>
            </div>
          )}

          {videoData && (
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-2xl p-4 shadow-lg border border-blue-100">
                <video
                  className="w-full rounded-xl shadow-2xl border-4 border-white"
                  controls
                  poster="/api/placeholder/800/450"
                >
                  <source src={videoData.videoUrl} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>

              <div className="text-center space-y-6">
                <p className="text-xl font-semibold text-neutral-800 px-4">
                  {videoData.videoDescription}
                </p>

                <button
                  onClick={handleCopyLink}
                  className="
                    w-full 
                    py-4 
                    rounded-xl 
                    bg-gradient-to-r 
                    from-blue-600 
                    to-indigo-700 
                    text-white 
                    text-lg 
                    font-bold 
                    hover:from-blue-700 
                    hover:to-indigo-800 
                    transition-all 
                    duration-300 
                    flex 
                    items-center 
                    justify-center 
                    space-x-3
                    focus:outline-none 
                    focus:ring-4 
                    focus:ring-blue-300 
                    focus:ring-opacity-50
                    shadow-lg
                    hover:shadow-xl
                  "
                >
                  {copied ? (
                    <>
                      <Check className="w-6 h-6 text-green-300" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-6 h-6" />
                      <span>Copy Sharing Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareVideo;
