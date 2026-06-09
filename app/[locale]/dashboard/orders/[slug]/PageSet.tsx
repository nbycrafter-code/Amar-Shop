// app/dashboard/orders/[slug]/PageSet.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { taka, toBengaliNumber } from "@/utils/helpers";
import { ArrowLeft, CheckCircle, Truck, Package, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

interface PageSetProps {
  order?: Order | null;
  settings?: any;
}

// Status options with icons and colors
const statusOptions = [
  { value: "pending", labelEn: "Pending", labelBn: "বিবেচনাধীন", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", labelEn: "Confirmed", labelBn: "কনফার্মড", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
  { value: "processing", labelEn: "Processing", labelBn: "প্রক্রিয়াকরণে", icon: Package, color: "bg-purple-100 text-purple-800" },
  { value: "shipped", labelEn: "Shipped", labelBn: "পাঠানো হয়েছে", icon: Truck, color: "bg-indigo-100 text-indigo-800" },
  { value: "delivered", labelEn: "Delivered", labelBn: "ডেলিভারি সম্পন্ন", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { value: "cancelled", labelEn: "Cancelled", labelBn: "বাতিল করা হয়েছে", icon: XCircle, color: "bg-red-100 text-red-800" },
];

export const PageSet = ({ order, settings = {} }: PageSetProps) => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order || null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "pending");

  // Check if order exists
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isBn ? "অর্ডার পাওয়া যায়নি" : "Order Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {isBn ? "আপনার অনুরোধ করা অর্ডারটি পাওয়া যায়নি।" : "The order you requested could not be found."}
          </p>
          <Link
            href="/my-account/orders"
            className="inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {isBn ? "অর্ডারে ফিরুন" : "Back to Orders"}
          </Link>
        </div>
      </div>
    );
  }

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === currentOrder.orderStatus) return;
    
    const confirmed = confirm(
      isBn 
        ? `আপনি কি অর্ডার স্ট্যাটাস "${getStatusText(newStatus)}" এ পরিবর্তন করতে চান?`
        : `Are you sure you want to change order status to "${getStatusText(newStatus)}"?`
    );
    
    if (!confirmed) return;
    
    setUpdatingStatus(true);
    console.log(currentOrder);
    
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: [currentOrder._id], orderStatus: newStatus })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentOrder({ ...currentOrder, orderStatus: newStatus });
        setSelectedStatus(newStatus);
        toast.success(
          isBn 
            ? `অর্ডার স্ট্যাটাস "${getStatusText(newStatus)}" এ আপডেট করা হয়েছে`
            : `Order status updated to "${getStatusText(newStatus)}"`
        );
      } else {
        toast.error(data.error || (isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে" : "Failed to update status"));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে" : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
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

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodText = (method: string) => {
    if (method === "cash_on_delivery") return isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery";
    return isBn ? "অনলাইন পেমেন্ট" : "Online Payment";
  };

  const getPaymentStatusText = (status: string) => {
    if (status === "paid") return isBn ? "পরিশোধিত" : "Paid";
    if (status === "failed") return isBn ? "ব্যর্থ" : "Failed";
    return isBn ? "অপেক্ষমান" : "Pending";
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductName = (item: OrderItem) => {
    return isBn ? (item.nameBn || item.name) : item.name;
  };

  // Translations
  const texts = {
    orderDetails: isBn ? "অর্ডার বিবরণ" : "Order Details",
    backToOrders: isBn ? "← অর্ডারে ফিরুন" : "← Back to Orders",
    orderInformation: isBn ? "অর্ডার তথ্য" : "Order Information",
    orderId: isBn ? "অর্ডার আইডি" : "Order ID",
    orderDate: isBn ? "অর্ডার তারিখ" : "Order Date",
    orderStatus: isBn ? "অর্ডার স্ট্যাটাস" : "Order Status",
    updateStatus: isBn ? "স্ট্যাটাস আপডেট করুন" : "Update Status",
    paymentStatus: isBn ? "পেমেন্ট স্ট্যাটাস" : "Payment Status",
    paymentMethod: isBn ? "পেমেন্ট পদ্ধতি" : "Payment Method",
    customerInformation: isBn ? "গ্রাহকের তথ্য" : "Customer Information",
    name: isBn ? "নাম" : "Name",
    phone: isBn ? "মোবাইল নম্বর" : "Phone Number",
    email: isBn ? "ইমেইল" : "Email",
    address: isBn ? "ঠিকানা" : "Address",
    orderedProducts: isBn ? "অর্ডারকৃত পণ্যসমূহ" : "Ordered Products",
    product: isBn ? "পণ্য" : "Product",
    price: isBn ? "দাম" : "Price",
    quantity: isBn ? "পরিমাণ" : "Quantity",
    subtotal: isBn ? "সাবটোটাল" : "Subtotal",
    priceSummary: isBn ? "মূল্য বিবরণী" : "Price Summary",
    itemsSubtotal: isBn ? "পণ্যের সাবটোটাল" : "Items Subtotal",
    deliveryCharge: isBn ? "ডেলিভারি চার্জ" : "Delivery Charge",
    totalPayable: isBn ? "মোট পরিশোধ্য" : "Total Payable",
    specialInstructions: isBn ? "বিশেষ নির্দেশনা" : "Special Instructions",
    downloadInvoice: isBn ? "ইনভয়েস ডাউনলোড করুন" : "Download Invoice",
    trackOrder: isBn ? "অর্ডার ট্র্যাক করুন" : "Track Order",
    cashOnDelivery: isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery",
    onlinePayment: isBn ? "অনলাইন পেমেন্ট" : "Online Payment",
    paymentPending: isBn ? "অপেক্ষমান" : "Pending",
    paymentPaid: isBn ? "পরিশোধিত" : "Paid",
    paymentFailed: isBn ? "ব্যর্থ" : "Failed",
    updating: isBn ? "আপডেট হচ্ছে..." : "Updating...",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/my-account/orders"
            className="inline-flex items-center text-gray-600 hover:text-red-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {texts.backToOrders}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {texts.orderDetails}
          </h1>
          <p className="text-gray-500 mt-1">
            {texts.orderId}: <span className="font-mono font-semibold">{currentOrder.orderId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order & Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {texts.orderInformation}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{texts.orderId}</p>
                  <p className="font-semibold text-gray-800 font-mono">{currentOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{texts.orderDate}</p>
                  <p className="font-semibold text-gray-800">{formatDate(currentOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{texts.orderStatus}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(currentOrder.orderStatus)}`}
                    >
                      {getStatusText(currentOrder.orderStatus)}
                    </span>
                    
                    {/* Status Update Dropdown */}
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      disabled={updatingStatus}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white cursor-pointer disabled:opacity-50"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {isBn ? option.labelBn : option.labelEn}
                        </option>
                      ))}
                    </select>
                    
                    {updatingStatus && (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{texts.paymentStatus}</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(currentOrder.paymentStatus)}`}
                  >
                    {getPaymentStatusText(currentOrder.paymentStatus)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{texts.paymentMethod}</p>
                  <p className="font-semibold text-gray-800">{getPaymentMethodText(currentOrder.paymentMethod)}</p>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {texts.customerInformation}
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">{texts.name}</p>
                  <p className="font-semibold text-gray-800">{currentOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{texts.phone}</p>
                  <p className="font-semibold text-gray-800">{currentOrder.customerPhone}</p>
                </div>
                {currentOrder.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-500">{texts.email}</p>
                    <p className="font-semibold text-gray-800">{currentOrder.customerEmail}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">{texts.address}</p>
                  <p className="font-semibold text-gray-800">{currentOrder.customerAddress}</p>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {currentOrder.specialInstructions && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {texts.specialInstructions}
                </h2>
                <p className="text-gray-600">{currentOrder.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Price Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {texts.priceSummary}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{texts.itemsSubtotal}</span>
                  <span className="font-semibold text-gray-800">
                    {isBn ? toBengaliNumber(taka(currentOrder.subtotal).toString()) : taka(currentOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{texts.deliveryCharge}</span>
                  <span className="font-semibold text-gray-800">
                    {isBn ? toBengaliNumber(taka(currentOrder.deliveryCharge).toString()) : taka(currentOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">{texts.totalPayable}</span>
                    <span className="text-xl font-bold text-red-500">
                      {isBn ? toBengaliNumber(taka(currentOrder.total).toString()) : taka(currentOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {texts.downloadInvoice}
                </button>
                <Link
                  href={`/order-tracking?orderId=${currentOrder.orderId}`}
                  className="block w-full py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-center font-medium"
                >
                  {texts.trackOrder}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              {texts.orderedProducts}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    {texts.product}
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    {texts.price}
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    {texts.quantity}
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">
                    {texts.subtotal}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={getProductName(item)}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {getProductName(item)}
                          </p>
                          {item.selectedSize && (
                            <p className="text-xs text-gray-500 mt-1">
                              {isBn ? "সাইজ" : "Size"}: {item.selectedSize}
                            </p>
                          )}
                          {item.selectedColor && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-gray-500">
                                {isBn ? "রং" : "Color"}:
                              </span>
                              <span
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.selectedColorHex || "#000" }}
                              />
                              <span className="text-xs text-gray-500">
                                {isBn ? (item.selectedColorBn || item.selectedColor) : item.selectedColor}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-red-500">
                        {isBn ? toBengaliNumber(taka(item.price).toString()) : taka(item.price)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{item.quantity}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-red-500">
                        {isBn ? toBengaliNumber(taka(item.price * item.quantity).toString()) : taka(item.price * item.quantity)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};