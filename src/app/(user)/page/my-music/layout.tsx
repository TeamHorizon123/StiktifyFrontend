"use client";

const MusicMyMusicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen border-none">
      <div className="flex-auto">{children}</div>
    </div>
  );
};

export default MusicMyMusicLayout;
