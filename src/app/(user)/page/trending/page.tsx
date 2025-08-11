"use client";

import TrendingContent from "@/app/(user)/page/trending/trendingContent";
import { Suspense } from "react";

const TrendingPage = () => {
  return (
    <Suspense>
      <TrendingContent />
    </Suspense>
  );
};

export default TrendingPage;
