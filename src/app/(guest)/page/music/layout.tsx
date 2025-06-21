"use client";
import MusicPlayer from "@/components/music/music.player";
import NotificationModel from "@/components/notification/NotificationModal";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";

const MusicGuestLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useContext(AuthContext)!;
  useEffect(() => { }, [user]);
  return (
    <div className="flex flex-col min-h-screen border-none">
      <div className="flex-auto">
        {user && <NotificationModel />}
        {children}
      </div>
      <div className="w-full flex-none h-[14vh] bg-gray-900/80 rounded-lg shadow-gray-400/50">
        <MusicPlayer />
      </div>
    </div>
  );
};

export default MusicGuestLayout;
