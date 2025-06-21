"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import {
  handleGetAllProducts,
  handleSearchProducts,
} from "@/actions/product.action";
import InputCustomize from "@/components/input/input.customize";
import { SearchOutlined } from "@ant-design/icons";

const StorePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = search
          ? await handleSearchProducts(search, 1, 10) // Nếu có từ khóa tìm kiếm
          : await handleGetAllProducts(1, 10, ""); // Nếu không có từ khóa tìm kiếm

        console.log("check result", result);
        if (result && result.data && result.data.result) {
          // Lọc sản phẩm theo từ khóa tìm kiếm trong productName và productDescription
          const filteredProducts = result.data.result.filter(
            (product: any) =>
              product.productName
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              product.productDescription
                .toLowerCase()
                .includes(search.toLowerCase())
          );
          setProducts(filteredProducts);
        } else {
          console.error("Invalid result structure:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [search]); // Gọi lại khi `search` thay đổi

  const handleCardClick = (productId: string) => {
    router.push(`/page/product-detail/${productId}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1
        className="text-4xl font-bold text-center mb-8 text-transparent 
                   bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "2px",
        }}
      >
        Sticktify Shop
      </h1>
      <div style={{ width: "300px", marginBottom: "20px" }}>
        <div>
          <InputCustomize
            setValue={setSearch}
            value={search}
            icon={<SearchOutlined />}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCardClick(product._id)}
            >
              <div className="relative w-full h-56">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
                {product.stock <= 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Hết hàng
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 text-center truncate w-full">
                  {product.productName}
                </h3>
                <p className="text-gray-500 text-sm mt-1 text-center truncate w-full">
                  {product.productDescription}
                </p>
                <p className="text-indigo-600 text-lg font-bold mt-2">
                  ${product.productPrice}
                </p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200">
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-semibold py-10">
          Not Found
        </div>
      )}
    </div>
  );
};

export default StorePage;
