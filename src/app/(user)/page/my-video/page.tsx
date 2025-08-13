import MyVideo from "@/components/page/myvideo/MyVideo";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense >
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <MyVideo />
      </div>
    </Suspense>

  );
};

export default Page;