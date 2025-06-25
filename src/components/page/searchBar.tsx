import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

export default function SearchBar() {
    const [isVisible, setIsVisible] = useState(true);
    if (!isVisible) return null;
    return (
        <div id="search" className="border-l border-r border-zinc-700 p-4 w-[20vw] h-[100vh] bg-[#21201E] text-white transform translate-x-0 transition-transform duration-1000 ease-in-out relative">
            <button className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 absolute right-5 top-5"
                onClick={() => setIsVisible(false)}>
                <RxCross2 />
            </button>
            <p className="text-lg font-bold">Search</p>
            <input className="w-full p-2 mt-9 rounded-lg outline-none text-black" type="text" placeholder="Search content" />
        </div>
    );
}