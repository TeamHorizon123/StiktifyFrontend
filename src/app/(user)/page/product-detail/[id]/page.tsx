"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Spin, message } from "antd";
import { handleGetProductDetails } from "@/actions/product.action";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return; // Kiểm tra nếu id không tồn tại

      setLoading(true);
      try {
        const result = await handleGetProductDetails(id as string);
        console.log("Product details result:", result);

        if (result && result.data) {
          setProduct(result.data); // Lưu dữ liệu sản phẩm
        } else {
          message.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        message.error("Failed to load product details");
      }
      setLoading(false);
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      message.warning("This product is out of stock!");
      return;
    }
    message.success(`${product.productName} has been added to your cart!`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : product ? (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Hình ảnh sản phẩm */}
            <div className="md:w-1/2 p-6">
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-96 object-cover rounded-lg"
                loading="lazy"
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.productName}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {product.productDescription}
                </p>
                <p className="text-indigo-600 text-2xl font-bold mb-4">
                  ${product.productPrice}
                </p>
                <p
                  className={`text-sm font-medium mb-4 ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock: ${product.stock} items`
                    : "Out of Stock"}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Category: {product.productCategory}
                </p>
                <p className="text-gray-500 text-sm">
                  Last Updated:{" "}
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Nút Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || product.isDelete}
                className={`w-full py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
                  product.stock > 0 && !product.isDelete
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {product.stock > 0 && !product.isDelete
                  ? "Add to Cart"
                  : "Unavailable"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-semibold py-10">
          Product Not Found
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
