"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation"; // Add router import
import {
  Button,
  Input,
  Modal,
  Spin,
  notification,
  Select,
  Dropdown,
  Menu,
  Rate,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  MoreOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import UploadProduct from "@/components/modal/modal.add.product";
import EditProduct from "@/components/modal/modal.edit.product";
import EditShopOwnerDetail from "@/components/modal/modal.edit.shop.infor";
import ShoppingCartModal from "@/components/modal/modal.shopping.cart";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import CartPreview from "@/components/modal/modal.shopping.cart";

const { confirm } = Modal;
const { Option } = Select;

interface Rating {
  _id: string;
  productId: string;
  rating: number;
  totalRatings: number;
}

const StorePage: React.FC = () => {
  const router = useRouter(); // Initialize router
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditShopModalOpen, setIsEditShopModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [shopData, setShopData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p className="text-red-500 text-center">Authentication error!</p>;
  }

  const { accessToken, user } = authContext;

  // Enhanced rating calculation functions
  const getProductRating = (
    productId: string
  ): { averageRating: number; totalRatings: number } => {
    const productRatings = ratings.filter(
      (rating) => rating.productId === productId
    );

    if (productRatings.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    // Calculate total of all ratings
    const totalRatingSum = productRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );

    // Calculate average rating
    const averageRating = totalRatingSum / productRatings.length;

    return {
      averageRating: Math.round(averageRating * 2) / 2, // Round to nearest 0.5
      totalRatings: productRatings.length,
    };
  };

  // Enhanced color function for star ratings
  const getStarColor = (averageRating: number) => {
    if (averageRating >= 4.5) {
      return "text-yellow-500"; // Bright yellow for excellent rating
    } else if (averageRating >= 4) {
      return "text-yellow-500"; // Same bright yellow for very good rating
    } else if (averageRating >= 3.5) {
      return "text-yellow-400"; // Slightly lighter yellow for good rating
    } else if (averageRating >= 3) {
      return "text-yellow-400"; // Same lighter yellow for average rating
    } else if (averageRating >= 2) {
      return "text-yellow-300"; // Light yellow for below average
    } else {
      return "text-yellow-200"; // Pale yellow for poor rating
    }
  };
  // Load cart from session storage on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchShopData();
    fetchRatings();
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from session storage:", error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [accessToken, user?._id]);

  // Save cart to session storage when it changes
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCategories = async () => {
    if (!accessToken || !user?._id) return;
    try {
      const res = await sendRequest<{ statusCode: number; data: any[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-for-products`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.statusCode === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRatings = async () => {
    if (!accessToken || !user?._id) return;
    try {
      const res = await sendRequest<{ statusCode: number; data: Rating[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ratings/`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.statusCode === 200) {
        setRatings(res.data);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const fetchShopData = async () => {
    if (!accessToken || !user?._id) return;
    try {
      const res = await sendRequest<{ statusCode: number; data: any }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/shop/${user._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.statusCode === 200) {
        setShopData(res.data);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  // Function to add product to cart
  const addToCart = (productId: string) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productId === productId
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity: 1 }];
      }
    });

    notification.success({
      message: "Product added to cart",
      placement: "bottomRight",
    });
  };

  // New function to handle Buy Now
  const handleBuyNow = (productId: string) => {
    // Clear existing cart and add only this product
    const newCart = [{ productId, quantity: 1 }];
    setCart(newCart);

    // Save to session storage immediately
    sessionStorage.setItem("cart", JSON.stringify(newCart));

    // Navigate to the order page
    router.push("/page/order");

    notification.info({
      message: "Proceeding to checkout",
      placement: "bottomRight",
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        try {
          await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`,
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      },
    });
  };

  // Handle category selection
  const handleCategoryChange = (value: string | undefined) => {
    setSelectedCategory(value);
  };

  // Hàm tính toán tổng số sản phẩm trong giỏ hàng
  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = (product.productName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.productCategory === selectedCategory;
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1
        className="text-4xl font-bold text-center mb-6 text-transparent 
            bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "2px",
        }}
      >
        My Store
      </h1>

      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      />

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
        <Input
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 border p-2 rounded-lg shadow-sm"
          prefix={<SearchOutlined className="text-gray-500" />}
        />
        <Select
          placeholder="Select Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-1/4"
        >
          <Option value={undefined}>All</Option>
          {categories.map((category) => (
            <Option key={category._id} value={category.categoryProductName}>
              {category.categoryProductName}
            </Option>
          ))}
        </Select>

        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2"
          >
            New Product
          </Button>
          <Button
            type="default"
            icon={<ShopOutlined />}
            onClick={() => setIsEditShopModalOpen(true)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg px-4 py-2"
          >
            Edit Shop
          </Button>
        </div>
        <CartPreview
          cart={cart}
          products={products}
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          onQuantityChange={(productId, quantity) => {
            setCart((prevCart) =>
              prevCart.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: quantity }
                  : item
              )
            );
          }}
          onRemoveItem={(productId) => {
            setCart((prevCart) =>
              prevCart.filter((item) => item.productId !== productId)
            );
          }}
          userId={user?._id || ""}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const { averageRating, totalRatings } = getProductRating(
              product._id
            );

            return (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center relative"
              >
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="edit"
                        onClick={() => handleEdit(product)}
                        icon={<EditOutlined />}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        key="delete"
                        onClick={() => handleDelete(product._id)}
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <MoreOutlined className="absolute top-3 right-3 text-xl cursor-pointer" />
                </Dropdown>
                <img
                  src={product.image || "/default-image.jpg"}
                  alt={product.productName}
                  className="w-40 h-40 object-cover rounded-lg mb-4"
                />
                <span className="text-lg font-semibold text-gray-800 text-center">
                  {product.productName}
                </span>
                <span className="text-gray-500 text-xs mt-1">
                  {product.productDescription}
                </span>
                <span className="text-green-600 text-sm font-medium mt-1">
                  ${product.productPrice}
                </span>
                <div className="flex items-center mt-2">
                  <Rate
                    disabled
                    defaultValue={averageRating}
                    allowHalf
                    className={getStarColor(averageRating)}
                  />
                  <span className="text-gray-500 text-xs ml-2">
                    ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
                  </span>
                </div>
                <div className="flex gap-2 mt-3 w-full">
                  <Button
                    className="flex-1"
                    icon={<DollarCircleOutlined />}
                    onClick={() => handleBuyNow(product._id)}
                  >
                    Buy Now
                  </Button>
                  <Button
                    type="default"
                    className="flex-1"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-semibold py-10">
          Not Found
        </div>
      )}

      <Modal
        title="Upload Product"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <UploadProduct
          isEditMode={false}
          editingProduct={null}
          onClose={() => setIsModalOpen(false)}
          onProductUpdated={fetchProducts}
        />
      </Modal>

      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <EditProduct
          product={editingProduct}
          onClose={() => setIsEditModalOpen(false)}
          refreshProducts={fetchProducts}
        />
      </Modal>

      <Modal
        title="Edit Shop"
        open={isEditShopModalOpen}
        onCancel={() => setIsEditShopModalOpen(false)}
        footer={null}
      >
        <EditShopOwnerDetail
          onClose={() => setIsEditShopModalOpen(false)}
          refreshData={fetchShopData}
          visible={isEditShopModalOpen}
          onViewCart={() => setIsCartModalOpen(true)}
          product={{
            image: "",
            name: "",
            description: "",
            price: 0,
          }}
        />
      </Modal>

      <Modal
        title="Shopping Cart"
        open={isCartModalOpen}
        onCancel={() => setIsCartModalOpen(false)}
        footer={null}
      >
        <CartPreview
          cart={cart}
          products={products}
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          onQuantityChange={(productId, quantity) => {
            setCart((prevCart) =>
              prevCart.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: quantity }
                  : item
              )
            );
          }}
          onRemoveItem={(productId) => {
            setCart((prevCart) =>
              prevCart.filter((item) => item.productId !== productId)
            );
          }}
          userId={user?._id || ""}
        />
      </Modal>
    </div>
  );
};

export default StorePage;
