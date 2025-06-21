"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Table,
  InputNumber,
  Modal,
  notification,
  Spin,
  Empty,
} from "antd";
import {
  DeleteOutlined,
  DollarCircleOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DetailCart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    return <p className="text-red-500 text-center">Authentication error!</p>;
  }

  const { accessToken, user } = authContext;

  // Load cart data from sessionStorage
  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart:", error);
        setCart([]);
      }
    }

    // Fetch products data
    fetchProducts();
  }, [accessToken, user?._id]);

  // Fetch all products to get details
  const fetchProducts = async () => {
    if (!accessToken || !user?._id) return;

    setLoading(true);
    try {
      const res = await sendRequest<{ statusCode: number; data: any[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/user/${user._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.statusCode === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.error({
        message: "Failed to load products",
        description: "Please try again later",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Combine cart items with product details
  useEffect(() => {
    if (cart.length && products.length) {
      const items = cart
        .map((cartItem) => {
          const product = products.find((p) => p._id === cartItem.productId);
          if (product) {
            return {
              ...cartItem,
              productName: product.productName,
              price: product.productPrice,
              image: product.image,
              description: product.productDescription,
              productId: product._id,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      setCartItems(items);
    } else {
      setCartItems([]);
    }
  }, [cart, products]);

  // Save cart data to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Update product quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );

    notification.success({
      message: "Cart updated",
      placement: "bottomRight",
    });
  };

  // Remove product from cart
  const removeItem = (productId: string) => {
    Modal.confirm({
      title: "Are you sure you want to remove this product?",
      onOk: () => {
        setCart((prevCart) =>
          prevCart.filter((item) => item.productId !== productId)
        );
        notification.success({
          message: "Product removed from cart",
          placement: "bottomRight",
        });
      },
    });
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.quantity * (item.price || 0), 0)
      .toFixed(2);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Continue shopping - go back to previous page
  const handleContinueShopping = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Empty
              description="Your cart is empty"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={handleContinueShopping}
              className="mt-4"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Cart Items ({getTotalItems()})
                  </h2>

                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex border-b py-4 last:border-0"
                    >
                      <div className="w-24 h-24 relative flex-shrink-0">
                        <img
                          src={item.image || "/default-image.jpg"}
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg">
                            {item.productName}
                          </h3>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeItem(item.productId)}
                          />
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-blue-600 font-semibold">
                            ${item.price}
                          </div>
                          <div className="flex items-center">
                            <Button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2 w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                          <div className="font-semibold">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-1 ">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>

                  <Button
                    type="link"
                    icon={<DollarCircleOutlined />}
                    onClick={() => router.push("/page/order")}
                    className="w-full mt-6 h-12 text-lg"
                  >
                    Payment
                  </Button>
                </div>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleContinueShopping}
                  size="large"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailCart;
