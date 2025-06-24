"use client";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useParams } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import Chatbox from "./chatBox/chatBox";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { FaGlobeAsia } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { FaChild } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { AiFillFire } from "react-icons/ai";
import { AiFillShop } from "react-icons/ai";
import Account from "@/components/page/navFriend";


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

  const account = {
    _id: "temp",
    userName: "Username",
  }

  return (
    // <div
    //   className="w-[10%] pt-10 h-screen bg-white shadow-lg p-5"
    //   style={isHidden && { display: "none" }}
    // >
    //   <nav>
    //     <ul className="space-y-4">
    //       {isGuest ? (
    //         <li>
    //           <Link
    //             href="/page/trending-guest"
    //             className={getLinkClass("/page/trending-guest")}
    //           >
    //             Trending
    //           </Link>
    //         </li>
    //       ) : (
    //         <li>
    //           <Link
    //             href="/page/trending-user"
    //             className={getLinkClass("/page/trending-user")}
    //           >
    //             Trending
    //           </Link>
    //         </li>
    //       )}
    //       {isGuest ? (
    //         ""
    //       ) : (
    //         <li>
    //           <Link
    //             href="/page/following"
    //             className={getLinkClass("/page/following")}
    //           >
    //             Following
    //           </Link>
    //         </li>
    //       )}
    //       <li>
    //         <Link href="/page/live" className={getLinkClass("/page/live")}>
    //           Live
    //         </Link>
    //       </li>
    //       <li>
    //         <Link href="/page/music" className={getLinkClass("/page/music")}>
    //           Music
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           href="/page/rankings"
    //           className={getLinkClass("/page/rankings")}
    //         >
    //           Rankings
    //         </Link>
    //       </li>

    //       <li>
    //         <Link
    //           href="/page/sticktify-shop"
    //           className={getLinkClass("/page/stiktify-shop")}
    //         >
    //           Stiktify Shop
    //         </Link>
    //       </li>
    //     </ul>
    //   </nav>
    //   <footer className="mt-[10px] text-center">
    //     <Chatbox />
    //     <small className="text-gray-500">©2025 Stiktify</small>
    //   </footer>
    // </div>
    <div
      className="w-[12vw] max-[600px]:w-[16vw] min-h-[100vh] flex flex-col bg-[#21201E] text-white items-center lg:items-start overflow-auto drop-shadow-sm lg:pl-4">
      {/* logo */}
      <Link className="mt-8 mb-8 flex items-center text-end sm:text-[4vw] lg:text-[24px] lg:text-right space-x-3" href="/">
        <FaHeadphonesSimple />
        <p className="sm:hidden max-[600px]:hidden lg:block">Stiktify</p>
      </Link>
      {/* nav */}
      <nav className="space-y-8">
        <ul className="space-y-8 lg:text-base">
          <li className="test-base sm:text-[4vw] lg:text-base">
            <Link className="flex items-center space-x-2" href="">
              <AiFillHome />
              <p className="text-base sm:hidden max-[600px]:hidden lg:block">Home</p>
            </Link>
          </li>
          <li className="test-base sm:text-[4vw] lg:text-base">
            <Link href="" className="flex items-center space-x-2">
              <FaGlobeAsia />
              <p className="text-base sm:hidden max-[600px]:hidden lg:block">Explore</p>
            </Link>
          </li>
          <li className="test-base sm:text-[4vw] lg:text-base">
            <Link href="/page/following" className="flex items-center space-x-2">
              <FaChild />
              <p className="text-base sm:hidden max-[600px]:hidden lg:block">Following</p>
            </Link>
          </li>
          <li className="test-base sm:text-[4vw] lg:text-base">
            <Link href="" className="flex items-center space-x-2">
              <AiOutlineTeam />
              <p className="text-base sm:hidden max-[600px]:hidden lg:block">Friends</p>
            </Link>
          </li>
          <li className="test-base sm:text-[4vw] lg:text-base relative">
            <Link href="" className="flex items-center space-x-2">
              <AiFillMessage />
              <div className="red-dot absolute hidden"></div>
              <p className="text-base sm:hidden max-[600px]:hidden lg:block">Messages</p>
            </Link>
          </li>
          <li className="test-base sm:text-[4vw] lg:text-base">
            <Link href={isGuest ? "/page/trending-guest" : "/page/trending-user"} className="flex items-center space-x-2">
              <AiFillFire />
              <p className="text-base sm:hidden max-[600px]:hidden lg:block">Trending</p>
            </Link>
          </li>
        </ul>
        <hr />
        <Link href="" className="test-base sm:text-[4vw] lg:text-base flex items-center space-x-2">
          <AiFillShop />
          <p className="text-base sm:hidden max-[600px]:hidden lg:block">Home</p>
        </Link>
        <hr />
        {/* Following account */}
      </nav>

      {/* Term & Privacy */}
      <div className="mt-14 ext-sm max-[600px]:text-xs flex flex-col items-center justify-center space-y-1">
        <ul className="flex flex-wrap text-center items-center justify-center space-x-1 lg:text-[10px]" >
          <li>
            <Link href="/">About</Link>
          </li>
          <li>
            <Link href="/">Copyright</Link>
          </li>
          <li>
            <Link href="/">Contact us</Link>
          </li>
        </ul>
        <ul className="flex flex-wrap text-center items-center justify-center space-x-1 lg:text-[10px]" >
          <li>
            <Link href="/">Terms</Link>
          </li>
          <li>
            <Link href="/">Privacy</Link>
          </li>
          <li>
            <Link href="/">Policy & Safety</Link>
          </li>
        </ul>
        <p className="text-xs text-center">@2025 Stiktify</p>
      </div>
    </div>
  );
};

export default SideBar;
