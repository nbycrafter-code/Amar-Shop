"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { taka, toBengaliNumber } from "@/utils/helpers";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  nameBn?: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  image?: string;
  slug?: string;
  selectedColorHex?: string;
}

interface Order {
  id: string;
  orderId: string;
  order_number: string;
  created_at: string;
  status: string;
  orderStatus: string;
  paymentStatus: string;
  total_amount: number;
  total: number;
  subtotal: number;
  items_count: number;
  payment_method: string;
  paymentMethod: string;
  items: OrderItem[];
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: string;
  shipping_address?: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  billing_address?: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
}

interface OrderDetailPageSetProps {
  order: Order;
  settings?: any; // settings prop যোগ করা হলো
}

const OrderDetailPageSet = ({ order, settings = {} }: OrderDetailPageSetProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#FFFFFF";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const successColor = settings?.successColor || "#10B981";
  const warningColor = settings?.warningColor || "#F59E0B";
  const infoColor = settings?.infoColor || "#3B82F6";
  const errorColor = settings?.errorColor || "#EF4444";

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const subtotal = order.subtotal || order.total_amount;
  const shipping = 0;
  const total = subtotal + shipping;

  // Get product name based on language
  const getProductName = (item: OrderItem) => {
    return isBn ? (item.nameBn || item.name) : item.name;
  };

  // Translations
  const texts = {
    order: isBn ? "অর্ডার" : "Order",
    wasPlacedOn: isBn ? "প্লেস করা হয়েছে" : "was placed on",
    andIsCurrently: isBn ? "এবং বর্তমানে" : "and is currently",
    payment: isBn ? "পেমেন্ট" : "Payment",
    backToOrders: isBn ? "← অর্ডারে ফিরুন" : "← Back to Orders",
    orderProgress: isBn ? "অর্ডার অগ্রগতি" : "Order Progress",
    orderPlaced: isBn ? "অর্ডার প্লেস" : "Order Placed",
    processing: isBn ? "প্রক্রিয়াকরণ" : "Processing",
    shipped: isBn ? "পাঠানো হয়েছে" : "Shipped",
    delivered: isBn ? "ডেলিভারি হয়েছে" : "Delivered",
    orderDetails: isBn ? "অর্ডার বিবরণ" : "Order details",
    product: isBn ? "পণ্য" : "Product",
    total: isBn ? "মোট" : "Total",
    qty: isBn ? "পরিমাণ" : "Qty",
    size: isBn ? "সাইজ" : "Size",
    color: isBn ? "রং" : "Color",
    subtotalLabel: isBn ? "সাবটোটাল:" : "Subtotal:",
    shippingLabel: isBn ? "ডেলিভারি চার্জ:" : "Shipping:",
    paymentMethodLabel: isBn ? "পেমেন্ট পদ্ধতি:" : "Payment method:",
    totalLabel: isBn ? "মোট:" : "Total:",
    free: isBn ? "ফ্রি" : "Free",
    billingAddress: isBn ? "বিলিং ঠিকানা" : "Billing address",
    shippingAddress: isBn ? "ডেলিভারি ঠিকানা" : "Shipping address",
    pending: isBn ? "বিবেচনাধীন" : "pending",
    paid: isBn ? "পরিশোধিত" : "paid",
    cashOnDelivery: isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"
  };

  const progressSteps = [
    texts.orderPlaced,
    texts.processing,
    texts.shipped,
    texts.delivered
  ];

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: isBn ? "বিবেচনাধীন" : "Pending",
      processing: isBn ? "প্রক্রিয়াকরণে" : "Processing",
      completed: isBn ? "সম্পন্ন" : "Completed",
      shipped: isBn ? "পাঠানো হয়েছে" : "Shipped",
      delivered: isBn ? "ডেলিভারি হয়েছে" : "Delivered",
      cancelled: isBn ? "বাতিল" : "Cancelled"
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  const getStatusStyle = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    let bgColor, color;
    
    if (statusLower === "processing" || statusLower === "pending") {
      bgColor = `${warningColor}20`;
      color = warningColor;
    } else if (statusLower === "completed" || statusLower === "delivered") {
      bgColor = `${successColor}20`;
      color = successColor;
    } else if (statusLower === "shipped") {
      bgColor = `${infoColor}20`;
      color = infoColor;
    } else if (statusLower === "cancelled") {
      bgColor = `${errorColor}20`;
      color = errorColor;
    } else {
      bgColor = `${textMuted}20`;
      color = textMuted;
    }
    
    return { backgroundColor: bgColor, color: color, borderColor: borderColor };
  };

  const getStatusDotColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "processing" || statusLower === "pending") return warningColor;
    if (statusLower === "completed" || statusLower === "delivered") return successColor;
    if (statusLower === "shipped") return infoColor;
    if (statusLower === "cancelled") return errorColor;
    return textMuted;
  };

  const getPaymentStatusStyle = (paymentStatus: string) => {
    const isPaid = paymentStatus === "paid";
    return {
      backgroundColor: isPaid ? `${successColor}20` : `${warningColor}20`,
      color: isPaid ? successColor : warningColor,
      borderColor: borderColor
    };
  };

  const getOrderProgress = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "pending") return 0;
    if (statusLower === "processing") return 1;
    if (statusLower === "shipped") return 2;
    if (statusLower === "delivered" || statusLower === "completed") return 3;
    if (statusLower === "cancelled") return -1;
    return 0;
  };

  const currentProgress = getOrderProgress(order.orderStatus || order.status);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(
      isBn ? "bn-BD" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const orderStatus = getStatusText(order.orderStatus || order.status);
  const paymentStatus = (order.paymentStatus || "pending").toLowerCase();
  const paymentMethod = order.paymentMethod || order.payment_method || "cash_on_delivery";

  const getPaymentMethodText = () => {
    if (isBn) {
      return paymentMethod === "cash_on_delivery" ? "ক্যাশ অন ডেলিভারি" : "অনলাইন পেমেন্ট";
    }
    return paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Online Payment";
  };

  return (
    <div className="flex-1 order-2 lg:order-1 space-y-6">
      {/* Order Status Banner */}
      <div 
        className="rounded-lg border p-5"
        style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
      >
        <p className="text-sm" style={{ color: textMuted }}>
          {texts.order} <strong style={{ color: textColor }}>{order.orderId || order.order_number}</strong>{" "}
          {texts.wasPlacedOn}{" "}
          <strong style={{ color: textColor }}>{formatDate(order.createdAt)}</strong>{" "}
          {texts.andIsCurrently}{" "}
          <strong style={{ color: primaryColor }}>{orderStatus}</strong>.
        </p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
            style={getStatusStyle(order.orderStatus || order.status)}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mr-1.5"
              style={{ backgroundColor: getStatusDotColor(order.orderStatus || order.status) }}
            ></span>
            {orderStatus}
          </span>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
            style={getPaymentStatusStyle(paymentStatus)}
          >
            {texts.payment}: {paymentStatus === "paid" ? texts.paid : texts.pending}
          </span>
          <Link
            href="/my-account/orders"
            className="text-sm hover:underline"
            style={{ color: primaryColor }}
          >
            {texts.backToOrders}
          </Link>
        </div>
      </div>

      {/* Order Progress - Only show if not cancelled */}
      {currentProgress >= 0 && (
        <div 
          className="rounded-lg border p-6"
          style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
        >
          <h3 className="font-semibold mb-4" style={{ color: textColor }}>{texts.orderProgress}</h3>
          <div className="flex items-center gap-0">
            {progressSteps.map((step, i) => {
              const isCompleted = i <= currentProgress;
              const isLast = i === progressSteps.length - 1;

              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                      style={{
                        backgroundColor: isCompleted ? primaryColor : 'transparent',
                        borderColor: isCompleted ? primaryColor : borderColor,
                        color: isCompleted ? '#FFFFFF' : textMuted
                      }}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className="text-xs mt-1 text-center whitespace-nowrap"
                      style={{ color: isCompleted ? primaryColor : textMuted }}
                    >
                      {step}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className="flex-1 h-0.5 mx-1 mb-4"
                      style={{ backgroundColor: i < currentProgress ? primaryColor : borderColor }}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Details Table */}
      <div 
        className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
      >
        <div className="px-6 py-4 border-b" style={{ borderBottomColor: borderColor }}>
          <h2 className="text-lg font-bold" style={{ color: textColor }}>{texts.orderDetails}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: hoverBg }}>
              <tr className="border-b" style={{ borderBottomColor: borderColor }}>
                <th className="text-left px-6 py-3 font-medium" style={{ color: textMuted }}>{texts.product}</th>
                <th className="text-right px-6 py-3 font-medium" style={{ color: textMuted }}>{texts.total}</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} className="border-b" style={{ borderBottomColor: borderColor }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Product Image - Clickable */}
                      <div
                        className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer transition-all relative group"
                        onClick={() => item.image && handleImageClick(item.image)}
                        style={{ boxShadow: `0 0 0 1px ${borderColor}` }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}`}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0 1px ${borderColor}`}
                      >
                        {item.image ? (
                          <>
                            <img
                              src={item.image}
                              alt={getProductName(item)}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke={textMuted}
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="hover:underline text-left font-medium"
                          style={{ color: primaryColor }}
                        >
                          {getProductName(item)}
                        </Link>
                        <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: textMuted }}>
                          {item.selectedSize && (
                            <span>{texts.size}: {item.selectedSize} | </span>
                          )}
                          <div className="flex items-center gap-1">
                            {item.selectedColor && (
                              <>
                                <span>{texts.color}:</span>
                                <span
                                  className="w-3 h-3 rounded-full border border-gray-300 inline-flex"
                                  style={{
                                    backgroundColor: item.selectedColorHex || "#000",
                                  }}
                                />
                                <span>{item.selectedColor}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-xs" style={{ color: textMuted }}>
                          {texts.qty}: {toBengaliNumber(item.quantity)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold" style={{ color: primaryColor }}>
                    {isBn ? toBengaliNumber(taka(item.price * item.quantity)) : taka(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2" style={{ borderTopColor: borderColor }}>
              <tr className="border-b" style={{ borderBottomColor: borderColor }}>
                <td className="px-6 py-3 font-semibold" style={{ color: textMuted }}>{texts.subtotalLabel}</td>
                <td className="px-6 py-3 text-right font-bold" style={{ color: primaryColor }}>
                  {isBn ? toBengaliNumber(taka(subtotal)) : taka(subtotal)}
                </td>
              </tr>
              <tr className="border-b" style={{ borderBottomColor: borderColor }}>
                <td className="px-6 py-3 font-semibold" style={{ color: textMuted }}>{texts.shippingLabel}</td>
                <td className="px-6 py-3 text-right font-bold" style={{ color: primaryColor }}>
                  {shipping === 0 ? (
                    <span style={{ color: successColor }}>{texts.free}</span>
                  ) : (
                    `${isBn ? toBengaliNumber(taka(shipping)) : taka(shipping)}`
                  )}
                </td>
              </tr>
              <tr className="border-b" style={{ borderBottomColor: borderColor }}>
                <td className="px-6 py-3 font-semibold" style={{ color: textMuted }}>{texts.paymentMethodLabel}</td>
                <td className="px-6 py-3 text-right font-bold" style={{ color: textColor }}>
                  {getPaymentMethodText()}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-base" style={{ color: textColor }}>{texts.totalLabel}</td>
                <td className="px-6 py-4 text-right font-bold text-lg" style={{ color: primaryColor }}>
                  {isBn ? toBengaliNumber(taka(total)) : taka(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Address */}
        <div className="rounded-lg border p-6" style={{ backgroundColor: backgroundColor, borderColor: borderColor }}>
          <h3 className="font-bold mb-4 text-base" style={{ color: textColor }}>{texts.billingAddress}</h3>
          <div className="border rounded p-4 space-y-1 text-sm" style={{ borderColor: borderColor }}>
            <p className="font-medium" style={{ color: primaryColor }}>{order.customerName}</p>
            <p style={{ color: textMuted }}>{order.customerAddress}</p>
            <p style={{ color: textMuted }}>{order.customerPhone}</p>
            <p style={{ color: primaryColor }}>{order.customerEmail}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-lg border p-6" style={{ backgroundColor: backgroundColor, borderColor: borderColor }}>
          <h3 className="font-bold mb-4 text-base" style={{ color: textColor }}>{texts.shippingAddress}</h3>
          <div className="border rounded p-4 space-y-1 text-sm" style={{ borderColor: borderColor }}>
            <p className="font-medium" style={{ color: textColor }}>{order.customerName}</p>
            <p style={{ color: textMuted }}>{order.customerAddress}</p>
            <p style={{ color: textMuted }}>{order.customerPhone}</p>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-2xl max-h-full">
            <img
              src={selectedImage}
              alt="Product"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
              onClick={() => setShowImageModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPageSet;