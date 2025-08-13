"use client";

import SearchUser from "@/components/page/search/searchUser";
import { Suspense } from "react";
const SearchUserPage = () => {
  return (
    <Suspense>
      <div className="min-h-screen bg-gray-900">
        <div className="w-[80vw] ml-40">
          <SearchUser />
        </div>
      </div>
    </Suspense>
  );
};

export default SearchUserPage;