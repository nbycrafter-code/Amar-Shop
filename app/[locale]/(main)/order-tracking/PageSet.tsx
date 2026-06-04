// app/order-tracking/PageSet.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { taka } from "@/utils/currency";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext"; // ✅ যোগ করুন
import { toBengaliNumber } from "@/utils/helpers";

interface OrderItem {
  productId: string;
  name: string;
  nameBn: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedColorBn?: string;
  selectedColorHex?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export const PageSet = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage(); // ✅ যোগ করুন
  const isBn = language === 'bn';

  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchMethod, setSearchMethod] = useState<"orderId" | "phone">(
    "orderId",
  );

  // Check URL params on load
  useEffect(() => {
    const urlOrderId = searchParams.get("orderId");
    const urlPhone = searchParams.get("phone");

    if (urlOrderId) {
      setOrderId(urlOrderId);
      setSearchMethod("orderId");
      handleTrackOrder(urlOrderId);
    } else if (urlPhone) {
      setPhone(urlPhone);
      setSearchMethod("phone");
      handleTrackByPhone(urlPhone);
    }
  }, [searchParams]);

  const handleTrackOrder = async (trackingId?: string) => {
    const orderToTrack = trackingId || orderId;
    if (!orderToTrack) {
      setError(isBn ? "অর্ডার আইডি দিন" : "Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");
    setOrders([]);
    setSelectedOrder(null);

    try {
      const response = await fetch(`/api/orders/track?orderId=${orderToTrack}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setSelectedOrder(data.order);
      } else {
        setError(data.error || (isBn ? "অর্ডার পাওয়া যায়নি" : "Order not found"));
      }
    } catch (error) {
      setError(isBn ? "অর্ডার ট্র্যাক করতে ব্যর্থ হয়েছে" : "Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackByPhone = async (phoneNumber?: string) => {
    const phoneToTrack = phoneNumber || phone;
    if (!phoneToTrack) {
      setError(isBn ? "মোবাইল নম্বর দিন" : "Please enter your phone number");
      return;
    }

    if (phoneToTrack.length < 11) {
      setError(isBn ? "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন" : "Please enter a valid 11-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedOrder(null);

    try {
      const response = await fetch(`/api/orders/track?phone=${phoneToTrack}`);
      const data = await response.json();

      if (response.ok && data.orders) {
        if (data.orders.length === 0) {
          setError(isBn ? "এই মোবাইল নম্বরে কোন অর্ডার পাওয়া যায়নি" : "No orders found for this phone number");
        } else {
          setOrders(data.orders);
        }
      } else {
        setError(data.error || (isBn ? "অর্ডার পাওয়া যায়নি" : "Failed to fetch orders"));
      }
    } catch (error) {
      setError(isBn ? "অর্ডার তথ্য সংগ্রহ করতে ব্যর্থ হয়েছে" : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrders([]);
  };

  const handleBackToSearch = () => {
    setSelectedOrder(null);
    setOrders([]);
    setError("");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: isBn ? "বিবেচনাধীন" : "Pending",
      confirmed: isBn ? "কনফার্মড" : "Confirmed",
      processing: isBn ? "প্রক্রিয়াকরণে" : "Processing",
      shipped: isBn ? "পাঠানো হয়েছে" : "Shipped",
      delivered: isBn ? "ডেলিভারি সম্পন্ন" : "Delivered",
      cancelled: isBn ? "বাতিল করা হয়েছে" : "Cancelled",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: isBn ? "অপেক্ষমান" : "Pending",
      paid: isBn ? "পরিশোধিত" : "Paid",
      failed: isBn ? "ব্যর্থ" : "Failed",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateBn = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2c3e2f] mb-2">
            {isBn ? "অর্ডার ট্র্যাকিং" : "Order Tracking"}
          </h1>
          <p className="text-gray-600">
            {isBn
              ? "আপনার অর্ডারের সর্বশেষ অবস্থা জানুন"
              : "Know the latest status of your order"}
          </p>
        </div>

        {/* Search Section */}
        {!selectedOrder && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setSearchMethod("orderId")}
                className={`pb-2 px-4 font-medium transition-colors ${searchMethod === "orderId"
                  ? "text-[#ef553f] border-b-2 border-[#ef553f]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {isBn ? "অর্ডার আইডি দ্বারা" : "By Order ID"}
              </button>
              <button
                onClick={() => setSearchMethod("phone")}
                className={`pb-2 px-4 font-medium transition-colors ${searchMethod === "phone"
                  ? "text-[#ef553f] border-b-2 border-[#ef553f]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {isBn ? "মোবাইল নম্বর দ্বারা" : "By Mobile Number"}
              </button>
            </div>

            {searchMethod === "orderId" ? (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {isBn ? "অর্ডার আইডি" : "Order ID"}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder={
                      isBn
                        ? "যেমন: ORD-20241215-1234"
                        : "Example: ORD-20241215-1234"
                    }
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#ef553f] focus:ring-1 focus:ring-[#ef553f] transition outline-none"
                    onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                  />
                  <button
                    onClick={() => handleTrackOrder()}
                    disabled={loading}
                    className="bg-[#ef553f] hover:bg-[#d44a35] text-white px-6 py-2.5 rounded-xl transition disabled:bg-gray-400"
                  >
                    {loading
                      ? isBn
                        ? "খুঁজছি..."
                        : "Searching..."
                      : isBn
                        ? "ট্র্যাক করুন"
                        : "Track"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {isBn
                    ? "আপনার অর্ডার কনফার্মেশন ইমেইলে অর্ডার আইডি পাবেন"
                    : "You will find the order ID in your order confirmation email"}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {isBn ? "মোবাইল নম্বর" : "Mobile Number"}
                </label>
                <div className="flex gap-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#ef553f] focus:ring-1 focus:ring-[#ef553f] transition outline-none"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTrackByPhone()
                    }
                  />
                  <button
                    onClick={() => handleTrackByPhone()}
                    disabled={loading}
                    className="bg-[#ef553f] hover:bg-[#d44a35] text-white px-6 py-2.5 rounded-xl transition disabled:bg-gray-400"
                  >
                    {loading
                      ? isBn
                        ? "খুঁজছি..."
                        : "Searching..."
                      : isBn
                        ? "খুঁজুন"
                        : "Search"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {isBn
                    ? "অর্ডার করার সময় যে নম্বর ব্যবহার করেছেন সেটি দিন"
                    : "Enter the phone number you used when placing the order"}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <svg className="inline w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <svg className="animate-spin w-12 h-12 text-[#ef553f] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">
              {isBn
                ? "অর্ডার তথ্য সংগ্রহ করা হচ্ছে..."
                : "Fetching order information..."}
            </p>
          </div>
        )}

        {/* Orders List (for phone search) */}
        {!loading && orders.length > 0 && !selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isBn ? "আপনার অর্ডারসমূহ" : "Your Orders"} (
                {isBn && !isNaN(Number(orders.length))
                  ? toBengaliNumber(orders.length.toString())
                  : orders.length}
                )
              </h2>
              <button
                onClick={handleBackToSearch}
                className="text-[#ef553f] hover:underline text-sm"
              >
                <svg className="inline w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {isBn ? "নতুন খুঁজুন" : "New Search"}
              </button>
            </div>

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleViewOrderDetails(order)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "অর্ডার আইডি" : "Order ID"}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {order.orderId}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      order.orderStatus,
                    )}`}
                  >
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-gray-500">{isBn ? "তারিখ" : "Date"}</p>
                    <p className="text-gray-800">
                      {isBn
                        ? formatDateBn(order.createdAt)
                        : formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      {isBn ? "মোট মূল্য" : "Total"}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {isBn
                        ? toBengaliNumber(taka(order.total).toString())
                        : taka(order.total)}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    {isBn ? "আইটেম" : "Items"}:{" "}
                    {isBn
                      ? toBengaliNumber(order.items.length.toString())
                      : order.items.length}{" "}
                    {isBn ? "টি পণ্য" : "products"}
                  </p>
                </div>

                <button className="mt-3 text-[#ef553f] text-sm hover:underline">
                  {isBn ? "বিস্তারিত দেখুন" : "View Details"}{" "}
                  <svg className="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Order Details */}
        {!loading && selectedOrder && (
          <div className="space-y-6">
            <button
              onClick={handleBackToSearch}
              className="text-[#ef553f] hover:underline mb-4 inline-flex items-center"
            >
              <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isBn ? "নতুন অর্ডার ট্র্যাক করুন" : "Track New Order"}
            </button>

            {/* Order Info Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#ef553f] to-[#d44a35] px-6 py-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h2 className="text-white font-bold text-xl">
                    {isBn ? "অর্ডার তথ্য" : "Order Information"}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      selectedOrder.orderStatus,
                    )}`}
                  >
                    {getStatusText(selectedOrder.orderStatus)}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "অর্ডার আইডি" : "Order ID"}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {selectedOrder.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "তারিখ" : "Date"}
                    </p>
                    <p className="text-gray-800">
                      {isBn ? formatDateBn(selectedOrder.createdAt) : formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "নাম" : "Name"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "মোবাইল" : "Mobile"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.customerPhone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">
                      {isBn ? "ঠিকানা" : "Address"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.customerAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "পেমেন্ট পদ্ধতি" : "Payment Method"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.paymentMethod === "cash_on_delivery"
                        ? isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"
                        : isBn ? "অনলাইন পেমেন্ট" : "Online Payment"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "পেমেন্ট স্ট্যাটাস" : "Payment Status"}
                    </p>
                    <p className="text-gray-800">
                      {getPaymentStatusText(selectedOrder.paymentStatus)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {isBn ? "অর্ডারকৃত পণ্যসমূহ" : "Ordered Products"}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 border-b border-gray-100 pb-4 last:border-0"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {isBn ? item.nameBn : item.name}
                      </h4>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500">
                          {isBn ? "সাইজ" : "Size"}: {item.selectedSize}
                        </p>
                      )}
                      {item.selectedColor && (
                        // <p className="text-sm text-gray-500">
                        //   {isBn ? "রং" : "Color"}:{" "}
                        //   <span
                        //     className="w-3 h-3 rounded-full border border-gray-300 inline-flex"
                        //     style={{
                        //       backgroundColor:
                        //         item.selectedColorHex || "",
                        //     }}
                        //   />
                        //   {isBn ? item.selectedColorBn : item.selectedColor}
                        // </p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {isBn ? "রং" : "Color"}:
                          </span>
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{
                              backgroundColor:
                                item.selectedColorHex || "#000",
                            }}
                          />
                          <span className="text-xs text-gray-500">
                            {isBn
                              ? (item.selectedColorBn || item.selectedColor)
                              : (item.selectedColor || item.selectedColorBn)}
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">
                        {isBn ? "পরিমাণ" : "Quantity"}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {isBn
                          ? toBengaliNumber(
                            taka(item.price * item.quantity).toString(),
                          )
                          : taka(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isBn
                          ? toBengaliNumber(taka(item.price).toString())
                          : taka(item.price)}{" "}
                        ×{" "}
                        {isBn
                          ? toBengaliNumber(item.quantity.toString())
                          : item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                {isBn ? "মূল্য বিবরণী" : "Price Summary"}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isBn ? "সাবটোটাল" : "Subtotal"}
                  </span>
                  <span className="text-gray-800">
                    {isBn
                      ? toBengaliNumber(taka(selectedOrder.subtotal).toString())
                      : taka(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isBn ? "ডেলিভারি চার্জ" : "Delivery Charge"}
                  </span>
                  <span className="text-gray-800">
                    {isBn
                      ? toBengaliNumber(
                        taka(selectedOrder.deliveryCharge).toString(),
                      )
                      : taka(selectedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">
                      {isBn ? "মোট" : "Total"}
                    </span>
                    <span className="text-[#ef553f]">
                      {isBn
                        ? toBengaliNumber(taka(selectedOrder.total).toString())
                        : taka(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <svg className="w-8 h-8 text-[#ef553f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {isBn ? "সাহায্য প্রয়োজন?" : "Need Help?"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {isBn
                      ? "অর্ডার সংক্রান্ত যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন"
                      : "Contact us for any order-related issues"}
                  </p>
                  <p className="text-lg font-bold text-[#ef553f]">
                    <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {isBn ? toBengaliNumber("01741571104") : "01741571104"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isBn
                      ? "সকাল ১০টা - রাত ৯টা (শুক্রবার বন্ধ)"
                      : "10:00 AM - 9:00 PM (Closed on Fridays)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};