"use client";

const MusicFavoriteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen border-none">
      <div className="flex flex-col p-4">{children}</div>
    </div>
  );
};

export default MusicFavoriteLayout;
