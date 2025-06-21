"use client";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Chatbox from "./chatBox/chatBox";

interface SideBarProps {
  isHidden?: Boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isHidden }) => {
  const pathname = usePathname();
  const { user } = useContext(AuthContext) ?? {};
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      setIsGuest(false);
    }
  }, [user]);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    return isActive
      ? "text-lg font-bold text-red-500"
      : "text-lg text-gray-700 hover:text-red-500";
  };

  return (
    <div
      className="w-[10%] pt-10 h-screen bg-white shadow-lg p-5"
      style={isHidden && { display: "none" }}
    >
      <nav>
        <ul className="space-y-4">
          {isGuest ? (
            <li>
              <Link
                href="/page/trending-guest"
                className={getLinkClass("/page/trending-guest")}
              >
                Trending
              </Link>
            </li>
          ) : (
            <li>
              <Link
                href="/page/trending-user"
                className={getLinkClass("/page/trending-user")}
              >
                Trending
              </Link>
            </li>
          )}
          {isGuest ? (
            ""
          ) : (
            <li>
              <Link
                href="/page/following"
                className={getLinkClass("/page/following")}
              >
                Following
              </Link>
            </li>
          )}
          <li>
            <Link href="/page/live" className={getLinkClass("/page/live")}>
              Live
            </Link>
          </li>
          <li>
            <Link href="/page/music" className={getLinkClass("/page/music")}>
              Music
            </Link>
          </li>
          <li>
            <Link
              href="/page/rankings"
              className={getLinkClass("/page/rankings")}
            >
              Rankings
            </Link>
          </li>

          <li>
            <Link
              href="/page/sticktify-shop"
              className={getLinkClass("/page/stiktify-shop")}
            >
              Stiktify Shop
            </Link>
          </li>
        </ul>
      </nav>
      <footer className="mt-[10px] text-center">
        <Chatbox />
        <small className="text-gray-500">©2025 Stiktify</small>
      </footer>
    </div>
  );
};

export default SideBar;
