"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { sendRequest } from "@/utils/api";
import Image from "next/image";
import {
  Loader2,
  AlertCircle,
  Headphones,
  Heart,
  Copy,
  Check,
} from "lucide-react";

interface Music {
  musicThumbnail: string;
  musicDescription: string;
  totalListener: number;
  totalFavorite: number;
  musicUrl: string;
}

const ShareMusic = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const [musicData, setMusicData] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMusicShare();
    } else {
      setError("Invalid music ID");
      setLoading(false);
    }
  }, [id]);

  const fetchMusicShare = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/share/${id}`,
        method: "GET",
      });

      if (res?.data) {
        setMusicData(res.data);
      } else {
        setError("Music not found");
      }
    } catch (err) {
      setError("Failed to fetch music");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#22C55E] p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E] to-[#a1e9b0] opacity-50 blur-3xl"></div>
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-lg w-full border border-white/20 relative z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 font-serif text-center ">
          Music Player
        </h1>
        {loading && (
          <div className="flex flex-col items-center justify-center text-white">
            <Loader2 className="animate-spin w-6 h-6" />
            <p className="mt-2">Loading music...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-500/50">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {musicData && (
          <div className="mt-4 text-center">
            <Image
              src={musicData.musicThumbnail}
              alt="Music Thumbnail"
              width={300}
              height={200}
              className="rounded-xl mx-auto shadow-md border border-white/10"
            />
            <h2 className="text-3xl font-bold text-white mt-4 drop-shadow-md">
              {musicData.musicDescription}
            </h2>
            <div className="flex justify-center gap-6 text-white mt-3">
              <div className="flex items-center gap-1">
                <Headphones className="w-5 h-5 text-white" />
                <span>{musicData.totalListener}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>{musicData.totalFavorite}</span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-md transition duration-300 border border-white/20 text-white bg-white/20 hover:bg-white/30 active:scale-95 flex items-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white-300" />
                      <span className="ml-2">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="ml-2">Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <audio
              className="w-full rounded-md shadow-md mt-4 bg-[#16A34A] p-2 text-white"
              controls
            >
              <source src={musicData.musicUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareMusic;
