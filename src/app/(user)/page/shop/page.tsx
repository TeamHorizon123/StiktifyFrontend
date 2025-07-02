import ListProduct from "@/app/(user)/page/shop/listProduct";
import SearchProduct from "@/app/(user)/page/shop/searchProduct";
import { FaShop } from "react-icons/fa6";

const ShopPage = () => {

  return (
    <>
      <div>
        <div className="flex items-center justify-center text-white space-x-2 text-4xl font-black">
          <FaShop />
          <p className="">Stiktify Shop</p>
        </div>
        <SearchProduct />
        {/* <FlashSale /> */}
        <ListProduct page={1} />
      </div>
    </>
  );
};

export default ShopPage;
