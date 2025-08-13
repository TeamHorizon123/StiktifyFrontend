import ListProduct from "@/app/(user)/page/shop/listProduct";
import Search from "@/components/page/shop/searchProduct";
import { FaShop } from "react-icons/fa6";

const ShopPage = () => {

  return (
    <>
      <div className="main-layout min-h-screen ">
        <div className="flex items-center justify-center text-white space-x-2 text-4xl font-black">
          <FaShop />
          <p className="">Stiktify Shop</p>
        </div>
        <Search />
        {/* <FlashSale /> */}
        <ListProduct />
      </div>
    </>
  );
};

export default ShopPage;
