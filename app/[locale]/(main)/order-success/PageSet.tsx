// app/order-success/PageSet.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { toBengaliNumber } from "@/utils/helpers";
import { toast } from "sonner";

interface PageSetProps {
  settings?: any; // settings prop যোগ করা হলো
}

export const PageSet = ({ settings = {} }: PageSetProps) => {
  // ✅ All Hooks (useState, useRef, useApp, useLanguage) MUST be called first, unconditionally
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useApp();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d44a35";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#f7f5f2";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const successColor = settings?.successColor || "#10B981";
  const infoColor = settings?.infoColor || "#3B82F6";

  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  // ✅ useCallback is also a Hook, call it here
  const processOrderSuccess = useCallback(async () => {
    const id = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");
    
    if (!id) {
      router.push("/");
      return;
    }
    
    setOrderId(id);
    
    try {
      clearCart();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem("cart");
        localStorage.removeItem("guest_cart");
        sessionStorage.removeItem("checkoutFormData");
        sessionStorage.removeItem("pendingCheckout");
        sessionStorage.removeItem("pendingStripeCheckout");
      }
      
      if (sessionId) {
        try {
          const verifyResponse = await fetch("/api/stripe/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, orderId: id }),
          });
          const verifyData = await verifyResponse.json();
          if (!verifyData.success) {
            console.warn("Payment verification failed:", verifyData.message);
          }
        } catch (verifyError) {
          console.error("Payment verification error:", verifyError);
        }
      }
      
      toast.success(isBn ? "অর্ডার সফল হয়েছে!" : "Order successful!");
      
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.success(isBn ? "অর্ডার সফল হয়েছে!" : "Order successful!");
    } finally {
      setIsProcessing(false);
    }
  }, [searchParams, router, clearCart, isBn]);

  // ✅ useEffect must also be called at the top level
  useEffect(() => {
    if (!hasProcessed.current) {
      hasProcessed.current = true;
      processOrderSuccess();
    }
  }, [processOrderSuccess]);

  // ============================================================
  // ✅ Conditional returns (JSX) MUST come AFTER all Hooks
  // ============================================================
  
  // Loading State
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: backgroundColor }}>
        <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center" style={{ backgroundColor: cardBg }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${infoColor}20` }}>
            <svg 
              className="animate-spin h-8 w-8" 
              style={{ color: infoColor }}
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
            {isBn ? "প্রক্রিয়াকরণ..." : "Processing..."}
          </h1>
          <p className="text-gray-600" style={{ color: textMuted }}>
            {isBn ? "আপনার অর্ডার কনফার্ম করা হচ্ছে..." : "Confirming your order..."}
          </p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return null;
  }

  // Success State
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: backgroundColor }}>
      <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center" style={{ backgroundColor: cardBg }}>
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${successColor}20` }}>
            <svg className="w-10 h-10" style={{ color: successColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
            {isBn ? 'অর্ডার সফল হয়েছে!' : 'Order Successful!'}
          </h1>
          <p style={{ color: textMuted }}>
            {isBn ? 'আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।' : 'Your order has been successfully completed.'}
          </p>
        </div>

        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: `${backgroundColor}`, border: `1px solid ${borderColor}` }}>
          <p className="text-sm mb-1" style={{ color: textMuted }}>
            {isBn ? 'আপনার অর্ডার নম্বর' : 'Your Order Number'}
          </p>
          <p className="text-xl font-bold break-all" style={{ color: primaryColor }}>
            {isBn && !isNaN(Number(orderId)) ? toBengaliNumber(orderId) : orderId}
          </p>
        </div>

        <div className="space-y-3 mb-6 text-left">
          <p className="text-sm flex items-start gap-2" style={{ color: textMuted }}>
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {isBn ? 'আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে।' : 'Our representative will contact you soon.'}
            </span>
          </p>
          <p className="text-sm flex items-start gap-2" style={{ color: textMuted }}>
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>
              {isBn ? 'যেকোনো সমস্যায় কল করুন' : 'Call for any problems.'}:{' '}
              <strong style={{ color: primaryColor }}>
                {isBn ? toBengaliNumber('01741571104') : '01741571104'}
              </strong>
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full text-white font-semibold py-3 rounded-xl transition text-center"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          >
            <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {isBn ? 'হোম পেজে ফিরে যান' : 'Return to Home'}
          </Link>
          <Link
            href={`/order-tracking?orderId=${orderId}`}
            className="block w-full font-semibold py-3 rounded-xl transition text-center"
            style={{ border: `1px solid ${primaryColor}`, color: primaryColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = primaryColor;
            }}
          >
            <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
          </Link>
        </div>
      </div>
    </div>
  );
};