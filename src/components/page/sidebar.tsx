"use client";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
// import { usePathname, useParams } from 'next/navigation';
import { useContext, useEffect, useState, useRef } from "react";
// import Chatbox from "./chatBox/chatBox";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { FaGlobeAsia, FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { AiFillFire } from "react-icons/ai";
import { AiFillShop } from "react-icons/ai";
import { FaUserGroup } from "react-icons/fa6";
import { RiUserReceivedFill } from "react-icons/ri";
import { BsPlusSquareFill } from "react-icons/bs";
import { PiBellSimpleFill } from "react-icons/pi";
import { FaCircleUser } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { AiOutlineHistory } from "react-icons/ai";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AiFillCustomerService } from "react-icons/ai";
import { MdReport, MdHelp, MdFeedback, MdDashboard } from "react-icons/md";
import SearchBar from "@/components/page/searchBar";
import BtnSignIn from "@/components/button/btnSignIn";
import NotificationModel from "../notification/NotificationModal";
import { usePathname } from "next/navigation";
import { Modal } from "antd";
import UploadVideoPost from "./trending/upload_video_post";

interface SideBarProps {
  isHidden?: boolean;
}

const SideBar: React.FC<SideBarProps> = () => {
  // const pathname = usePathname();
  const { user } = useContext(AuthContext) ?? {};
  const [isGuest, setIsGuest] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    if (user && user._id) {
      setIsGuest(false);
    }
  }, [user]);

  // xử lý search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  // const getLinkClass = (path: string) => {
  //   const isActive = pathname === path || pathname.startsWith(`${path}/`);
  //   return isActive
  //     ? "text-lg font-bold text-red-500"
  //     : "text-lg text-gray-700 hover:text-red-500";
  // };

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

    <div className="fixed z-20 flex">
      <div className="w-[13rem] max-[600px]:w-[16vw] h-[100vh] flex flex-col bg-[#18182c] text-white items-center lg:items-start overflow-auto drop-shadow-sm lg:pl-4 lg:pr-4">
        {/* logo */}
        <div className="w-full mt-8 mb-4 flex flex-col space-y-4">
          <Link
            className="pl-2 flex items-center text-end text-lg space-x-3"
            href="/page/trending"
          >
            <FaHeadphonesSimple />
            <p className="sm:hidden max-[600px]:hidden lg:block">Stiktify</p>
          </Link>
          <button
            className="w-full h-fit bg-zinc-700 p-2 pt-3 pb-3 rounded-xl flex items-center"
            onClick={() => setShowSearch(true)}
          >
            <FaSearch />
            <p className="pl-2 text-gray-400">Search</p>
          </button>
        </div>

        {/* nav */}
        <nav className="w-full space-y-6 relative bottom-0 overflow-y-scroll ">
          <ul className="w-full space-y-2 text-base text-center flex flex-col items-center lg:items-start">
            <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
              <Link
                className="flex items-center space-x-2"
                href="/page/trending"
              >
                <AiFillFire />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                  Trending
                </p>
              </Link>
            </li>
            {/* <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
              <Link href="" className="flex items-center space-x-2">
                <FaGlobeAsia />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">Explore</p>
              </Link>
            </li> */}
            {!isGuest ? (
              <>
                <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
                  <Link
                    href="/page/following"
                    className="flex items-center space-x-2"
                  >
                    <RiUserReceivedFill />
                    <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                      Following
                    </p>
                  </Link>
                </li>
                <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
                  <Link
                    href="/page/music"
                    className="flex items-center space-x-2"
                  >
                    <AiFillCustomerService />
                    <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                      Music
                    </p>
                  </Link>
                </li>

                {pathname === "/page/trending" && (
                  <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="flex items-center space-x-2"
                    >
                      <BsPlusSquareFill />
                      <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                        Upload
                      </p>
                    </button>
                  </li>
                )}
                <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
                  <NotificationModel />
                </li>
                <li className="relative w-full h-fit p-2 hover:bg-purple-500 rounded-md transition ease-in-out">
                  <div
                    onClick={() => setOpenHistory(!openHistory)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <AiOutlineHistory />
                      <div className="red-dot absolute hidden"></div>
                      <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                        History
                      </p>
                    </div>
                    <div className="ml-2">
                      {openHistory ? (
                        <FaChevronUp size={14} />
                      ) : (
                        <FaChevronDown size={14} />
                      )}
                    </div>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openHistory ? "max-h-40 mt-2" : "max-h-0"
                    }`}
                  >
                    <ul className="rounded-md shadow-md w-40">
                      <li className="p-2 hover:bg-[#3a3936] hover:rounded">
                        <Link
                          href="/page/videohistory"
                          className={"/personal/videohistory"}
                        >
                          Video History
                        </Link>
                      </li>
                      <li className="p-2 hover:bg-[#3a3936] hover:rounded">
                        <Link
                          href="/page/musichistory"
                          className={"/personal/musichistory"}
                        >
                          Music History
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
                  <Link
                    href={`/page/detail_user/${user?._id}`}
                    className="flex items-center space-x-2"
                  >
                    <FaCircleUser />
                    <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                      Profile
                    </p>
                  </Link>
                </li>
              </>
            ) : (
              <> </>
            )}
            {/* <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
              <Link href={isGuest ? "/page/trending-guest" : "/page/trending-user"} className="flex items-center space-x-2">
                <AiFillFire />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">Trending</p>
              </Link>
            </li> */}
            {isGuest ? (
              <>
                <li className="w-full h-fit p-2">
                  <BtnSignIn />
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
          <hr />
          {!isGuest ? (
            <>
              <Link
                href="/page/shop"
                className="test-base flex items-center space-x-2 w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out"
              >
                <AiFillShop />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                  Shop
                </p>
              </Link>
              <Link
                href="/page/manage-shop"
                className="test-base flex items-center space-x-2 w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out"
              >
                <MdDashboard />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">
                  Manage Shop
                </p>
              </Link>
              <hr />
            </>
          ) : (
            <></>
          )}
          {/* setting account */}
          {/* <ul className="w-full space-y-2 text-base text-center flex flex-col items-center lg:items-start">
            <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
              <Link className="flex items-center space-x-2" href="">
                <IoSettings />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">Setting</p>
              </Link>
            </li> */}
          {/* <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
              <Link href="" className="flex items-center space-x-2">
                <MdReport />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">Report</p>
              </Link>
            </li>
            <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
              <Link className="flex items-center space-x-2" href="">
                <MdHelp />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">Helps</p>
              </Link>
            </li>
            <li className="w-full h-fit hover:bg-purple-500 p-2 hover:rounded-md hover:transition hover:ease-in-out">
              <Link href="" className="flex items-center space-x-2">
                <MdFeedback />
                <p className="text-base sm:hidden max-[600px]:hidden lg:block">Feedback</p>
              </Link>
            </li> */}
          {/* </ul> */}
          {/* Term & Privacy */}
          <div className="mt-14 ext-sm max-[600px]:text-xs flex flex-col items-center justify-center space-y-1">
            <ul className="flex flex-wrap text-center items-center justify-center space-x-1 lg:text-[10px]">
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
            <ul className="flex flex-wrap text-center items-center justify-center space-x-1 lg:text-[10px]">
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
        </nav>
      </div>
      {/* Search bar */}
      {showSearch && (
        <div ref={searchRef}>
          <SearchBar />
        </div>
      )}

      {/* Modal hiển thị form Upload Video */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-[#1f2937] text-white p-6 rounded-lg w-full max-w-xl shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-2 right-3 text-gray-300 hover:text-white text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
            <UploadVideoPost />
          </div>
        </div>
      )}

      {/* <style jsx global>{`
        .ant-modal-content,
        .ant-modal-header,
        .ant-modal-body {
          background-color: #1f2937 !important;
          color: #ffffff !important;
        }

        .ant-modal-title,
        .ant-modal-close,
        .ant-modal-body * {
          color: #ffffff !important;
        }
      `}</style> */}
      <style jsx global>{`
        .custom-upload-modal .ant-modal-content {
          background-color: #1f2937;
          color: #f9fafb;
        }

        .custom-upload-modal .ant-modal-header {
          background-color: #1f2937;
          border-bottom: 1px solid #374151;
        }

        .custom-upload-modal .ant-modal-title {
          color: #f9fafb;
        }

        .custom-upload-modal .ant-modal-close-x {
          color: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default SideBar;
