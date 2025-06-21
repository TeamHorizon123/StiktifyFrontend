"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: string;
  quantity: number;
}

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  image?: string;
}

interface CartPreviewProps {
  cart: any[];
  products: any[];
  userId: string; // Add userId prop
  isOpen: boolean;
  onClose: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  setCart?: React.Dispatch<React.SetStateAction<any[]>>;
}

const CartPreview: React.FC<CartPreviewProps> = ({
  cart,
  products,
  userId, // Receive userId as prop
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get product info by ID
  const getProductById = (productId: string) => {
    return products.find((product) => product._id === productId);
  };

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    return product ? total + product.productPrice * item.quantity : total;
  }, 0);

  // Navigate to cart page with user ID
  const viewCartClick = () => {
    router.push(`/page/detail_cart`);
  };

  // Add delay to mouse enter/leave for better UX
  let enterTimer: NodeJS.Timeout;
  let leaveTimer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer);
    enterTimer = setTimeout(() => {
      setIsHovering(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(enterTimer);
    leaveTimer = setTimeout(() => {
      setIsHovering(false);
    }, 300);
  };

  // Handle clicks outside to close the preview
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        previewRef.current &&
        !previewRef.current.contains(event.target as Node)
      ) {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);
    };
  }, []);

  return (
    <div
      ref={previewRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Badge count={totalItems} size="small">
        <div
          className="flex items-center cursor-pointer hover:text-blue-600"
          onClick={viewCartClick}
        >
          <ShoppingCartOutlined style={{ fontSize: "30px" }} />
          <span className="text-gray-500 ml-2 hover:text-blue-600"></span>
        </div>
      </Badge>

      {isHovering && (
        <div
          className="absolute right-0 z-50 bg-white shadow-lg rounded border mt-1 w-80"
          style={{
            minWidth: "320px",
            boxShadow:
              "0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05), 0 12px 48px 16px rgba(0,0,0,0.03)",
          }}
        >
          {/* Triangle indicator pointing to cart icon */}
          <div className="absolute -top-2 right-8 w-4 h-4 bg-white transform rotate-45 border-t border-l"></div>

          {/* Preview header */}
          <div className="border-b p-3">
            <span className="font-semibold text-sm">Recently Added Items</span>
          </div>

          {/* Preview content */}
          <div className="max-h-64 overflow-y-auto p-2">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <img
                  src="/empty-cart.png"
                  alt="Empty Cart"
                  className="w-16 h-16 mx-auto mb-2 opacity-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="text-gray-500">No items in the cart</p>
              </div>
            ) : (
              <>
                {cart.slice(0, 5).map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center py-2 hover:bg-gray-50"
                    >
                      <img
                        src={product.image || "/default-image.jpg"}
                        alt={product.productName}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="ml-2 flex-1 overflow-hidden">
                        <p className="text-xs truncate mb-1">
                          {product.productName}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-red-500 font-medium">
                            ${product.productPrice}
                          </span>
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {cart.length > 5 && (
                  <div className="text-center text-xs text-gray-500 py-2 border-t">
                    {cart.length - 5} more item(s) in cart
                  </div>
                )}
              </>
            )}
          </div>

          {/* Preview footer */}
          <div className="p-3 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-500">
                {totalItems} item(s) in cart
              </span>
              <span className="text-sm font-medium">
                Total:{" "}
                <span className="text-red-500">${totalPrice.toFixed(2)}</span>
              </span>
            </div>
            <Button
              type="primary"
              block
              onClick={viewCartClick}
              className="bg-blue-500 hover:bg-blue-600 border-blue-500"
              style={{ backgroundColor: "#007BFF", borderColor: "#007BFF" }}
            >
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPreview;
