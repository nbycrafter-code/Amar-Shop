// app/checkout/PageSet.tsx
"use client";

import { taka } from "@/utils/currency";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { toBengaliNumber } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useLanguage } from "@/context/LanguageContext";

interface PageSetProps {
  settings?: any; // settings prop যোগ করা হলো
}

export const PageSet = ({ settings = {} }: PageSetProps) => {
  // ✅ সব Hooks প্রথমে
  const { cart, clearCart } = useApp();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const pathname = usePathname();

  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirected, setRedirected] = useState(false);
  const [isCartEmpty, setIsCartEmpty] = useState(false);


  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d44a35";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#f7f5f2";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const successColor = settings?.successColor || "#10B981";
  const warningColor = settings?.warningColor || "#F59E0B";
  const errorColor = settings?.errorColor || "#EF4444";
  const infoColor = settings?.infoColor || "#3B82F6";
  const gradientStart = settings?.gradientStart || "#ef553f";
  const gradientEnd = settings?.gradientEnd || "#d44a35";

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash_on_delivery",
    specialInstructions: "",
  });

  // ✅ Check empty cart using useEffect (no redirect in render)
  useEffect(() => {
    if (!cart || cart.length > 0) {
      setIsCartEmpty(true);
    }
  }, [cart]);

  // Redirect to cart if not user
  useEffect(() => {
    if (!session?.user) {
      router.push('/cart');
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if user is logged in before showing checkout page
  useEffect(() => {
    if (status === "unauthenticated" && !redirected && cart.length > 0) {
      setRedirected(true);

      sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));
      sessionStorage.setItem("pendingCheckout", "true");
      sessionStorage.setItem("pendingPaymentMethod", formData.paymentMethod);

      toast.info(
        isBn ? "অর্ডার করতে লগইন প্রয়োজন" : "Login required to place order",
      );
      router.push(
        `/login?callbackUrl=${encodeURIComponent("/checkout")}`,
      );
    }
  }, [status, redirected, cart.length, formData, router, isBn]);

  // Restore saved form data after login
  useEffect(() => {
    if (status === "authenticated") {
      const savedFormData = sessionStorage.getItem("checkoutFormData");
      const pendingCheckout = sessionStorage.getItem("pendingCheckout");
      const savedPaymentMethod = sessionStorage.getItem("pendingPaymentMethod");

      if (pendingCheckout === "true" && savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);

        if (savedPaymentMethod) {
          setFormData((prev) => ({
            ...prev,
            paymentMethod: savedPaymentMethod,
          }));
        }

        sessionStorage.removeItem("checkoutFormData");
        sessionStorage.removeItem("pendingCheckout");
        sessionStorage.removeItem("pendingPaymentMethod");

        toast.success(
          isBn
            ? "স্বাগতম! এখন অর্ডার সম্পন্ন করুন"
            : "Welcome back! Complete your order",
        );
      }
    }
  }, [status, isBn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication first
    if (status !== "authenticated") {
      sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));
      sessionStorage.setItem("pendingCheckout", "true");
      sessionStorage.setItem("pendingPaymentMethod", formData.paymentMethod);

      toast.error(
        isBn ? "অর্ডার করতে লগইন প্রয়োজন" : "Login required to place order",
      );
      router.push(
        `/login?callbackUrl=${encodeURIComponent("/checkout")}`,
      );
      return;
    }

    setLoading(true);
    setError("");

    // Validate form
    if (!formData.name || !formData.address || !formData.phone) {
      setError(
        isBn
          ? "দয়া করে নাম, ঠিকানা এবং মোবাইল নম্বর দিন"
          : "Please provide name, address and mobile number",
      );
      setLoading(false);
      return;
    }

    // Prepare common order data
    const orderData = {
      session,
      customerName: formData.name,
      customerAddress: formData.address,
      customerPhone: formData.phone,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        slug: item.slug,
        nameBn: item.nameBn || item.name,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        selectedColorBn: item.selectedColorBn,
        selectedColorHex: item.selectedColorHex,
        image: item.image,
      })),
      subtotal: subtotal,
      deliveryCharge: 0,
      total: subtotal,
      specialInstructions: formData.specialInstructions || null,
    };

    // Route to appropriate payment method
    if (formData.paymentMethod === "online") {
      await handleStripeCheckout(orderData);
    } else {
      await handleCashOnDelivery(orderData);
    }
  };

  const handleCashOnDelivery = async (orderData: any) => {
    try {
      const finalOrderData = {
        ...orderData,
        paymentMethod: "cash_on_delivery",
        paymentStatus: "pending",
        orderStatus: "pending",
        userId: session?.user?.id,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalOrderData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isBn ? "অর্ডার সফল হয়েছে!" : "Order placed successfully!",
        );
        
        const isBengali = pathname.split('/')[1] === 'bn';
        if (isBengali) {
          router.push(`/bn/order-success?orderId=${data.order.orderId}`);
        } else {
          router.push(`/order-success?orderId=${data.order.orderId}`);
        }
        clearCart();
      } else {
        setError(
          data.error ||
          (isBn ? "অর্ডার করতে ব্যর্থ হয়েছে" : "Failed to place order"),
        );
        toast.error(
          data.error ||
          (isBn ? "অর্ডার করতে ব্যর্থ হয়েছে" : "Failed to place order"),
        );
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setError(
        isBn
          ? "নেটওয়ার্ক সমস্যা। দয়া করে আবার চেষ্টা করুন।"
          : "Network error. Please try again.",
      );
      toast.error(isBn ? "নেটওয়ার্ক সমস্যা" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async (orderData: any) => {
    setLoading(true);
    setError("");

    try {
      const finalOrderData = {
        ...orderData,
        paymentMethod: "stripe",
      };

      console.log("Calling createCheckoutSession...");

      const result = await createCheckoutSession(finalOrderData);

      console.log("Stripe result:", result);

      if (result.error === "unauthorized") {
        sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));
        sessionStorage.setItem("pendingCheckout", "true");
        router.push(
          `/login?callbackUrl=${encodeURIComponent("/checkout")}`,
        );
        toast.info(
          isBn
            ? "অনলাইন পেমেন্টের জন্য লগইন প্রয়োজন"
            : "Login required for online payment",
        );
        setLoading(false);
      } else if (result.success && result.url) {
        try {
          const url = new URL(result.url);
          console.log("Valid URL:", url.toString());

          toast.success(
            isBn
              ? "পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে..."
              : "Redirecting to payment page...",
          );

          setTimeout(() => {
            window.location.href = result.url;
          }, 500);
        } catch (urlError) {
          console.error("Invalid URL:", result.url);
          setError(isBn ? "পেমেন্ট লিংকটি সঠিক নয়" : "Invalid payment link");
          toast.error(
            isBn ? "পেমেন্ট লিংকটি সঠিক নয়" : "Invalid payment link",
          );
          setLoading(false);
        }
      } else {
        const errorMsg =
          result.message ||
          (isBn
            ? "পেমেন্ট প্রক্রিয়া করতে ব্যর্থ হয়েছে"
            : "Failed to process payment");
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      const errorMsg = isBn
        ? "পেমেন্ট গেটওয়েতে সমস্যা হয়েছে"
        : "Payment gateway error";
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  // ============================================
  // ✅ সব conditional returns Hooks এর পরে
  // ============================================

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: backgroundColor }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: primaryColor }}></div>
          <p className="text-gray-600">
            {isBn ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Show login required message (will auto-redirect)
  if (status === "unauthenticated" && cart.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: backgroundColor }}>
        <div className="rounded-2xl shadow-xl p-8 max-w-md text-center" style={{ backgroundColor: cardBg }}>
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
            {isBn ? "লগইন প্রয়োজন" : "Login Required"}
          </h1>
          <p className="mb-6" style={{ color: textMuted }}>
            {isBn
              ? "অর্ডার করতে অনুগ্রহ করে লগইন করুন"
              : "Please login to place your order"}
          </p>
          <div className="animate-pulse">
            <p className="text-sm" style={{ color: textMuted }}>
              {isBn ? "রিডাইরেক্ট হচ্ছে..." : "Redirecting..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart message
  if (cart.length === 0 || isCartEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: backgroundColor }}>
        <div className="rounded-2xl shadow-xl p-8 max-w-md text-center" style={{ backgroundColor: cardBg }}>
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
            {isBn ? "কার্ট খালি" : "Cart is Empty"}
          </h1>
          <p className="mb-6" style={{ color: textMuted }}>
            {isBn
              ? "দয়া করে কিছু পণ্য যোগ করুন"
              : "Please add some products to your cart"}
          </p>
          <Link
            href="/"
            className="text-white px-6 py-2 rounded-lg inline-block transition-colors"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          >
            {isBn ? "শপিং শুরু করুন" : "Start Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen py-6 md:py-10" style={{ backgroundColor: backgroundColor }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome message for logged in user */}
        {session && (
          <div className="mb-4 border-l-4 p-4 rounded" style={{ backgroundColor: `${successColor}10`, borderLeftColor: successColor }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: successColor }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium" style={{ color: successColor }}>
                    {isBn ? "আপনি লগইন করেছেন" : "You are logged in"}
                  </p>
                  <p className="text-sm" style={{ color: successColor }}>{session.user.email}</p>
                </div>
              </div>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${successColor}20`, color: successColor }}>
                {isBn ? "অর্ডার করতে প্রস্তুত" : "Ready to order"}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Billing Information */}
            <div className="space-y-6">
              {/* Customer Support Info */}
              <div className="rounded-2xl shadow-sm p-4 border flex items-center gap-3 text-sm" style={{ backgroundColor: cardBg, borderColor: borderColor, color: textMuted }}>
                <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  {isBn
                    ? "অর্ডার সংক্রান্ত যেকোনো সাহায্যে কল করুন"
                    : "Call for any help with your order."}{" "}
                  <strong style={{ color: primaryColor }}>
                    {isBn ? toBengaliNumber("01741571104") : "01741571104"}
                  </strong>{" "}
                  {isBn ? "(সকাল ১০টা - রাত ৯টা)" : "(10am - 9pm)"}
                </div>
              </div>

              {/* Billing Form Card */}
              <div className="rounded-2xl shadow-md p-5 md:p-6 border" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
                <div className="flex items-center gap-2 border-b pb-3 mb-5" style={{ borderBottomColor: `${warningColor}30` }}>
                  <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: textColor }}>
                    {isBn
                      ? "ঠিকানা ও ডেলিভারি তথ্য"
                      : "Address and delivery information"}
                  </h2>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-lg text-sm" style={{ backgroundColor: `${errorColor}10`, border: `1px solid ${errorColor}30`, color: errorColor }}>
                    <svg className="inline w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <p className="text-sm mb-5 p-3 rounded-lg border-l-4" style={{ backgroundColor: `${warningColor}10`, borderLeftColor: warningColor, color: textMuted }}>
                  <svg className="inline w-4 h-4 mr-2" style={{ color: warningColor }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {isBn
                    ? "অর্ডার করার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন। সঠিক ঠিকানা ও মোবাইল নম্বর দিন।"
                    : "After placing your order, our representative will contact you. Please provide your correct address and mobile number."}
                </p>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-sm" style={{ color: textColor }}>
                      {isBn ? "আপনার নাম" : "Your name"}:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={
                        isBn
                          ? "আপনার সম্পূর্ণ নাম লিখুন"
                          : "Enter your full name."
                      }
                      className="w-full border rounded-xl px-4 py-2.5 transition outline-none"
                      style={{ borderColor: borderColor }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `0 0 0 1px ${primaryColor}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Complete Address */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-sm" style={{ color: textColor }}>
                      {isBn ? "আপনার ঠিকানা" : "Your address"}:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder={
                        isBn
                          ? "বাড়ির নম্বর, রাস্তা, এলাকা, জেলা"
                          : "House number, street, area, district"
                      }
                      className="w-full border rounded-xl px-4 py-2.5 transition outline-none"
                      style={{ borderColor: borderColor }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `0 0 0 1px ${primaryColor}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs mt-1" style={{ color: textMuted }}>
                      {isBn
                        ? "ডেলিভারি ঠিকানা সঠিকভাবে দিন"
                        : "Enter the delivery address correctly."}
                    </p>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-sm" style={{ color: textColor }}>
                      {isBn ? "মোবাইল নম্বর" : "Mobile number"}:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                      className="w-full border rounded-xl px-4 py-2.5 transition outline-none"
                      style={{ borderColor: borderColor }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `0 0 0 1px ${primaryColor}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs mt-1" style={{ color: textMuted }}>
                      {isBn
                        ? "অর্ডার আপডেটের জন্য সক্রিয় নম্বর দিন"
                        : "Provide active number for order updates"}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-sm" style={{ color: textColor }}>
                      {isBn ? "পেমেন্ট পদ্ধতি" : "Payment methods"}:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-2.5 transition outline-none"
                      style={{ borderColor: borderColor, backgroundColor: cardBg }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `0 0 0 1px ${primaryColor}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      disabled={loading}
                    >
                      <option value="cash_on_delivery">
                        {isBn
                          ? "ক্যাশ অন ডেলিভারি (নগদ)"
                          : "Cash on Delivery (Cash)"}
                      </option>
                      <option value="online">
                        {isBn
                          ? "অনলাইন পেমেন্ট (Stripe)"
                          : "Online payment (Stripe)"}
                      </option>
                    </select>

                    {session && (
                      <p className="text-xs mt-1" style={{ color: successColor }}>
                        <svg className="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {isBn
                          ? "আপনি লগইন করেছেন। অর্ডার করতে প্রস্তুত।"
                          : "You are logged in. Ready to place order."}
                      </p>
                    )}
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-sm" style={{ color: textColor }}>
                      {isBn
                        ? "বিশেষ নির্দেশনা (ঐচ্ছিক)"
                        : "Special instructions (optional)"}
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder={
                        isBn
                          ? "যেমন: গেট নম্বর, ফ্ল্যাট নম্বর ইত্যাদি"
                          : "For example: Gate number, flat number etc."
                      }
                      className="w-full border rounded-xl px-4 py-2.5 transition outline-none"
                      style={{ borderColor: borderColor }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `0 0 0 1px ${primaryColor}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl shadow-md border sticky top-6 overflow-hidden" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
                <div className="px-5 py-4" style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}>
                  <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {isBn ? "অর্ডার সামারি" : "Order Summary"}
                  </h3>
                </div>

                <div className="p-5 space-y-5">
                  {/* Product List */}
                  <div>
                    <div className="flex justify-between text-sm font-semibold border-b pb-2 mb-2" style={{ borderBottomColor: borderColor, color: textMuted }}>
                      <span>{isBn ? "পণ্য" : "Product"}</span>
                      <span>{isBn ? "সাবটোটাল" : "Subtotal"}</span>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between border-b pb-2" style={{ borderBottomColor: borderColor }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                <Link
                                  href={`/product/${product.id || product._id}`}
                                  className="transition-colors"
                                  style={{ color: textColor }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                                >
                                  {isBn ? (product.nameBn || product.name) : product.name}
                                </Link>
                              </div>
                              <div className="text-xs" style={{ color: textMuted }}>
                                x{" "}
                                {isBn
                                  ? toBengaliNumber(product.quantity.toString())
                                  : product.quantity}
                              </div>
                              {(product.selectedSize ||
                                product.selectedColor) && (
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    {product.selectedSize && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs" style={{ color: textMuted }}>
                                          {isBn ? "সাইজ" : "Size"}:
                                        </span>
                                        <span className="text-xs" style={{ color: textMuted }}>
                                          {isBn ? product.selectedSizeBn : product.selectedSize}
                                        </span>
                                      </div>
                                    )}
                                    {product.selectedColor && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs" style={{ color: textMuted }}>
                                          {isBn ? "রং" : "Color"}:
                                        </span>
                                        <span
                                          className="w-3 h-3 rounded-full border"
                                          style={{
                                            backgroundColor: product.selectedColorHex || "#000",
                                            borderColor: borderColor
                                          }}
                                        />
                                        <span className="text-xs" style={{ color: textMuted }}>
                                          {isBn
                                            ? (product.selectedColorBn || product.selectedColor)
                                            : (product.selectedColor || product.selectedColorBn)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                          <span className="font-semibold ml-2" style={{ color: primaryColor }}>
                            {isBn
                              ? toBengaliNumber(
                                taka(
                                  product.price * product.quantity,
                                ).toString(),
                              )
                              : taka(product.price * product.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtotal and Shipment */}
                  <div className="border-t pt-3 space-y-2" style={{ borderTopColor: borderColor }}>
                    <div className="flex justify-between font-medium" style={{ color: textColor }}>
                      <span>
                        {isBn ? "সব পণ্যের মোট" : "Total of all products"}
                      </span>
                      <span>
                        {isBn
                          ? toBengaliNumber(taka(subtotal).toString())
                          : taka(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between" style={{ color: textMuted }}>
                      <span>
                        {isBn ? "ডেলিভারি চার্জ" : "Delivery charges"}
                      </span>
                      <span>৳ 0</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-dashed mt-1" style={{ borderTopColor: borderColor, color: primaryColor }}>
                      <span>{isBn ? "মোট পরিশোধ্য" : "Total payable"}</span>
                      <span>
                        {isBn
                          ? toBengaliNumber(taka(subtotal).toString())
                          : taka(subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Terms Note */}
                  <div className="text-[10px] border-t pt-3 text-center" style={{ borderTopColor: borderColor, color: textMuted }}>
                    <svg className="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {isBn
                      ? "অর্ডার কনফার্ম করার আগে দয়া করে ঠিকানা ও পণ্যের বিবরণ চেক করুন।"
                      : "Please check the address and product details before confirming the order."}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full text-white font-bold py-3 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isBn ? "প্রক্রিয়াকরণ..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formData.paymentMethod === "online"
                          ? isBn
                            ? "অনলাইন পেমেন্ট করুন"
                            : "Pay Online"
                          : isBn
                            ? "অর্ডার কনফার্ম করুন"
                            : "Confirm order"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};