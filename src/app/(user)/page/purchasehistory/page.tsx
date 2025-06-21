"use client";

import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Spin,
  Alert,
  Image,
  Tooltip,
  Badge,
  Rate,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import {
  Package,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShoppingBag,
  User,
  Phone,
  MailIcon,
} from "lucide-react";
import TextArea from "antd/es/input/TextArea";

const { Title, Text } = Typography;

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  image: string;
}

interface Order {
  _id: string;
  amount: number;
  status: string;
  createdAt?: string;
  paymentMethod: string;
  isPaid: boolean;
  shippingAddress: string;
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  products?: OrderProduct[];
}

interface OrderProduct {
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  rating?: number;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: Order[];
}

interface RatingData {
  productId: string;
  rating: number;
  description?: string;
}

// OrderStatusBadge Component
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "processing";
      case "completed":
        return "success";
      case "shipped":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "refunded":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Badge
      status={getStatusColor(status)}
      text={status.charAt(0).toUpperCase() + status.slice(1)}
      className="order-status-badge"
    />
  );
};

const PurchaseHistory: React.FC = () => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // New state for rating modal
  const [ratingModalVisible, setRatingModalVisible] = useState<boolean>(false);
  const [currentRatingData, setCurrentRatingData] = useState<RatingData | null>(
    null
  );
  const [ratingForm] = Form.useForm();

  // Handle product rating
  const handleProductRating = async (productId: string, star: number) => {
    if (!accessToken) {
      message.error("Please log in to rate");
      return;
    }

    // Open modal to add description
    setCurrentRatingData({ productId, rating: star });
    setRatingModalVisible(true);
  };

  // Submit rating with description
  const submitRating = async () => {
    if (!currentRatingData || !accessToken) return;

    try {
      // Get description from form (optional)
      const description = ratingForm.getFieldValue("description") || "";

      // Send request to rating API
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ratings`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          productId: currentRatingData.productId,
          star: currentRatingData.rating,
          description: description,
        },
      });

      // Send request to update product rating
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${currentRatingData.productId}/rate`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          rating: currentRatingData.rating,
        },
      });

      message.success("Thank you for your rating!");

      // Update orders state to reflect new rating
      const updatedOrders = orders.map((order) => ({
        ...order,
        products: order.products?.map((product) =>
          product.productId === currentRatingData.productId
            ? { ...product, rating: currentRatingData.rating }
            : product
        ),
      }));
      setOrders(updatedOrders);

      // Close modal and reset form
      setRatingModalVisible(false);
      ratingForm.resetFields();
      setCurrentRatingData(null);
    } catch (err: any) {
      message.error(
        err.response?.data?.message ||
          "An error occurred while submitting rating. Please try again."
      );
    }
  };

  // Thay đổi đoạn code trong useEffect khi bạn nhận được dữ liệu đơn hàng

  useEffect(() => {
    const fetchOrders = async () => {
      if (!accessToken) {
        setError("Please log in to view order history");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await sendRequest<ApiResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (res.data && res.data.length > 0) {
          // Fetch products for each order
          const ordersWithProducts = await Promise.all(
            res.data.map(async (order) => {
              try {
                const productsRes = await sendRequest<{ data: OrderProduct[] }>(
                  {
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${order._id}/products`,
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                return {
                  ...order,
                  products: productsRes.data || [],
                };
              } catch (productError) {
                console.error(
                  `Error fetching products for order ${order._id}:`,
                  productError
                );
                return order;
              }
            })
          );

          // Sắp xếp đơn hàng theo thời gian tạo, mới nhất lên đầu
          const sortedOrders = ordersWithProducts.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Sắp xếp giảm dần (mới nhất đầu tiên)
          });

          setOrders(sortedOrders);
        } else {
          setError("No orders found");
        }
      } catch (err: any) {
        console.error("Fetch Orders Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load order list"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  const renderProductRating = (order: Order, product: OrderProduct) => (
    <>
      <div className="mt-3 flex justify-center items-center space-x-2">
        <Text className="text-gray-600">Rate Product:</Text>
        <Rate
          value={product.rating || 0}
          onChange={(value) => handleProductRating(product.productId, value)}
          className={product.rating ? "" : ""}
        />
        {product.rating && (
          <Text type="secondary" className="ml-2">
            (Rated)
          </Text>
        )}
      </div>

      {/* Rating Description Modal */}
      <Modal
        title="Rate Product"
        open={ratingModalVisible}
        onOk={submitRating}
        onCancel={() => {
          setRatingModalVisible(false);
          ratingForm.resetFields();
          setCurrentRatingData(null);
        }}
      >
        <Form form={ratingForm} layout="vertical">
          <div className="flex justify-center mb-4">
            <Rate value={currentRatingData?.rating || 0} disabled />
          </div>
          <Form.Item name="description" label="Product Review">
            <TextArea
              rows={4}
              placeholder="Share your experience with this product (Optional)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  const renderProductColumn = (order: Order) => {
    const products = order.products || [];

    return (
      <div className="w-full">
        <div className="flex items-center space-x-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-green-600" />
          <Text strong>Product Information</Text>
          <Text className="text-gray-500 ml-2">({products.length} items)</Text>
        </div>
        {products.length > 0 ? (
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
            {products.map((product, index) => (
              <div
                key={`${product.productId}-${index}`}
                className="flex flex-col items-center space-y-4 pb-6 border-b last:border-b-0"
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.productName}
                    className="w-12 h-12 object-cover rounded"
                    preview={true}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                    <ShoppingBag className="w-6 h-6 text-gray-500" />
                  </div>
                )}

                <div className="w-full text-center">
                  <Text strong className="block text-base mb-1 truncate">
                    {product.productName}
                  </Text>
                  <div className="text-gray-500 text-sm space-x-2 mb-2">
                    <span>
                      Price:{" "}
                      {product.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                    <span>•</span>
                    <span>Quantity: {product.quantity}</span>
                  </div>
                  <Text strong className="text-green-600">
                    {(product.price * product.quantity).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}
                  </Text>

                  {renderProductRating(order, product)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-500">
            <ShoppingBag className="w-5 h-5" />
            <Text type="secondary">No products in this order</Text>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-gray-100">
      <div className="mb-8">
        <Title level={2} className="text-gray-800 mb-2">
          Purchase History
        </Title>
        <Text className="text-gray-600">
          View and manage all of your previous orders
        </Text>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Notification"
          description={error}
          type="error"
          showIcon
        />
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="
                bg-white 
                shadow-lg 
                rounded-xl 
                border 
                border-gray-200 
                overflow-hidden 
                transition 
                hover:shadow-xl
              "
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3 truncate">
                    <Package className="text-blue-600 w-6 h-6 flex-shrink-0" />
                    <div className="truncate">
                      <Text
                        strong
                        className="
                          text-lg 
                          text-gray-800 
                          block 
                          truncate 
                          max-w-[250px] 
                          sm:max-w-full
                        "
                      >
                        Order ID: #{order._id.slice(-8)}
                      </Text>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Text
                      strong
                      className="text-xl text-green-600 block mb-1 whitespace-nowrap"
                    >
                      {order.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Text>
                    <div className="text-sm text-gray-500 flex items-center justify-end space-x-2 whitespace-nowrap">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Date Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-4 border-t pt-4 border-gray-100">
                  {/* Product Details Column */}
                  <div className="md:col-span-1">
                    {renderProductColumn(order)}
                  </div>

                  {/* Payment Information Column */}
                  <div className="md:col-span-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <Text strong>Payment Information</Text>
                    </div>
                    <div className="space-y-1 text-gray-700">
                      <p className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Method:</span>
                        <span>{order.paymentMethod}</span>
                      </p>
                      <p className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status:</span>
                        {order.isPaid ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Paid
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <XCircle className="w-4 h-4 mr-1" /> Not Paid
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Information Column */}
                  <div className="md:col-span-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <Text strong>Shipping Information</Text>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Name:
                        </span>
                        <span>{order.fullName || "Unknown"}</span>
                      </p>
                      <Tooltip
                        title={order.emailAddress || "No email provided"}
                      >
                        <p className="flex items-center justify-between">
                          <span className="text-gray-500 flex items-center">
                            <MailIcon className="w-4 h-4 mr-2 text-gray-500" />
                            Email:
                          </span>
                          <span>{order.emailAddress || "N/A"}</span>
                        </p>
                      </Tooltip>
                      <p className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          Phone:
                        </span>
                        <span>{order.phoneNumber || "N/A"}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          Address:
                        </span>
                        <span className="text-right">
                          {order.shippingAddress}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <p className="text-xl text-gray-600">You have no orders yet.</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
