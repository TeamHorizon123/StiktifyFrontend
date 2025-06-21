"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface PersonalSideBarProps {
}

const PersonalSideBar: React.FC<PersonalSideBarProps> = () => {
  const pathname = usePathname();
  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-lg font-bold text-red-500"
      : "text-lg text-gray-700 hover:text-red-500";
  };

  return (
    <div className="w-[100%] pt-10 h-screen bg-white shadow-lg p-5">
      <nav>
        <ul className="space-y-4">
        <li>
            <Link
              href="/page/trending-user"
              className={getLinkClass("/page/trending-user")}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/personal/videohistory"
              className={getLinkClass("/personal/videohistory")}
            >
              Video History
            </Link>
          </li>
          <li>
            <Link
              href="/personal/musichistory"
              className={getLinkClass("/personal/musichistory")}
            >
              Music History
            </Link>
          </li>
        </ul>
      </nav>
      <footer className="mt-[10px] text-center">
        <small className="text-gray-500">© 2025 Stiktify</small>
      </footer>
    </div>
  );
};

export default PersonalSideBar;
