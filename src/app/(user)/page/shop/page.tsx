import ListProduct from "@/app/(user)/page/shop/listProduct";
import SearchProduct from "@/app/(user)/page/shop/searchProduct";
import FlashSale from "@/components/page/shop/flashSale";
import { FaShop } from "react-icons/fa6";

const ShopPage = () => {
  return (
    <>
      <div>
        <div className="flex items-center justify-center text-white space-x-2 text-4xl font-black">
          <FaShop />
          <p className="">Stiktify Shop</p>
        </div>
        <div className="w-full">
          <SearchProduct />
        </div>
        <div>
          <FlashSale />
        </div>
        <ListProduct />
      </div>
    </>
  );
};

export default ShopPage;
