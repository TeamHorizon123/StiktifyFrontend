"use client";

import React from "react";
import {
  CheckCircle,
  ShoppingCart,
  ArrowRight,
  Package,
  Mail,
  Truck,
  HomeIcon,
} from "lucide-react";
import Head from "next/head";

const OrderConfirmationPage: React.FC = () => {
  const handleBackToHome = () => {
    window.history.go(-5);
  };

  const handleContinueShopping = () => {
    window.history.go(-3);
  };

  return (
    <>
      {/* SEO and Metadata */}
      <Head>
        <title>Order Confirmed | Your Store Name</title>
        <meta
          name="description"
          content="Your order has been successfully processed. Thank you for your purchase!"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="/order-confirmation" />
        <meta property="og:title" content="Order Confirmed | Your Store Name" />
        <meta
          property="og:description"
          content="Your order has been successfully processed. Thank you for your purchase!"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Order Confirmed | Your Store Name"
        />
        <meta
          name="twitter:description"
          content="Your order has been successfully processed. Thank you for your purchase!"
        />
      </Head>

      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
        role="main"
        aria-labelledby="order-confirmation-title"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center">
            {/* Checkmark with Improved Accessibility */}
            <div className="flex justify-center mb-6" aria-hidden="true">
              <CheckCircle
                className="text-green-500 w-24 h-24 drop-shadow-lg"
                strokeWidth={1.5}
              />
            </div>

            <h1
              id="order-confirmation-title"
              className="text-4xl font-extrabold text-transparent 
              bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text mb-4
              tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Order Confirmed!
            </h1>

            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              Your purchase is complete.
              <br />
              Thank you for choosing our store.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={handleBackToHome}
                className="flex items-center px-5 py-3 bg-blue-50 text-blue-700 
                rounded-xl hover:bg-blue-100 transition-all duration-300 
                hover:shadow-md group"
                aria-label="Back to Home"
              >
                <HomeIcon className="mr-2 w-6 h-6 group-hover:rotate-6 transition" />
                Back to Home
              </button>

              <button
                onClick={handleContinueShopping}
                className="flex items-center px-5 py-3 bg-blue-600 text-white 
                rounded-xl hover:bg-blue-700 transition-all duration-300 
                hover:shadow-xl group"
                aria-label="Continue Shopping"
              >
                Continue Shopping
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition" />
              </button>
            </div>

            {/* Next Steps Section */}
            <div
              className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 text-left"
              aria-labelledby="next-steps-title"
            >
              <h2
                id="next-steps-title"
                className="text-xl font-bold mb-4 text-blue-800 flex items-center"
              >
                <Package className="mr-3 text-blue-600" />
                What's Next?
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700" role="status">
                  <Mail className="mr-3 text-blue-500 w-5 h-5" />
                  Confirmation email sent to your inbox
                </div>
                <div className="flex items-center text-gray-700" role="status">
                  <ShoppingCart className="mr-3 text-blue-500 w-5 h-5" />
                  Order details in your account dashboard
                </div>
                <div className="flex items-center text-gray-700" role="status">
                  <Truck className="mr-3 text-blue-500 w-5 h-5" />
                  Estimated delivery: 3-5 business days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
