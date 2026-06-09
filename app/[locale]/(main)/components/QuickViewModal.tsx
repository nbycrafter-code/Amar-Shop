"use client";

import { ArrowLeftIcon, ArrowRightIcon, ZoomIn, ZoomOut, X } from "lucide-react";
import { Stars } from "./Stars";
import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface QuickViewModalProps {
  onClose: () => void;
  activeProduct: any;
  addToCart: (item: any) => void;
  settings?: any; // settings prop যোগ করা হলো
}

export const QuickViewModal = ({ onClose, activeProduct, addToCart, settings = {} }: QuickViewModalProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  
  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#f0533a";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#de452d";
  const textColor = settings?.textColor || "#3a3a3a";
  const textMuted = settings?.textMuted || "#7a7a7a";
  const borderColor = settings?.borderColor || "#e3e3e3";
  const priceColor = settings?.primaryColor || "#f05a40";
  const reviewColor = settings?.secondaryColor || "#ff613d";
  const dotActiveColor = settings?.textColor || "#2f2f2f";
  const dotInactiveColor = settings?.borderColor || "#b8b8b8";
  const zoomControlBg = settings?.cardBackground || "#FFFFFF";
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(200);
  const imageContainerRef = useRef(null);

  if (!activeProduct) {
    return null;
  }

  const getText = (enText, bnText) => {
    return isBn ? bnText : enText;
  };

  const getProductName = () => {
    return isBn ? (activeProduct.nameBn || activeProduct.name) : activeProduct.name;
  };

  const getCategoryName = () => {
    if (isBn) {
      return activeProduct.categoryNameBn || activeProduct.categoryName || activeProduct.category || "অশ্রেণীবদ্ধ";
    }
    return activeProduct.categoryName || activeProduct.category || "Uncategorized";
  };

  const getReviewText = () => {
    if (isBn) {
      return activeProduct.reviewTextBn || activeProduct.reviewText || "কোন রিভিউ নেই";
    }
    return activeProduct.reviewText || "No reviews";
  };

  const getDescription = () => {
    if (isBn) {
      return activeProduct.descriptionBn || activeProduct.description || "কোন বিবরণ পাওয়া যায়নি";
    }
    return activeProduct.description || "No description available";
  };

  const goSlide = (direction) => {
    if (!activeProduct.images || activeProduct.images.length === 0) return;
    
    setActiveImageIndex((prev) => {
      if (direction === "prev") {
        return (prev - 1 + activeProduct.images.length) % activeProduct.images.length;
      }
      return (prev + 1) % activeProduct.images.length;
    });
    setZoomLevel(200);
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    x = Math.min(Math.max(x, 0), 100);
    y = Math.min(Math.max(y, 0), 100);

    setZoomPosition({ x, y });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 50, 400));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 50, 100));
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...activeProduct,
      quantity: quantity,
    };
    addToCart?.(cartItem);
    onClose?.();
  };

  const handleBuyNow = () => {
    const cartItem = {
      ...activeProduct,
      quantity: quantity,
    };
    addToCart?.(cartItem);
    onClose?.();
    window.location.href = "/checkout";
  };

  const hasImages = activeProduct.images && activeProduct.images.length > 0;
  const currentImage = hasImages ? activeProduct.images[activeImageIndex] : null;

  const translations = {
    noImageAvailable: getText("No image available", "কোন ছবি নেই"),
    noReviews: getText("No reviews", "কোন রিভিউ নেই"),
    addToCart: getText("Add To Cart", "কার্টে যোগ করুন"),
    buyNow: getText("Buy Now", "এখনই কিনুন"),
    adjustQuantity: getText("Adjust quantity", "পরিমাণ調整 করুন"),
    categories: getText("Categories", "ক্যাটাগরি"),
    zoomIn: getText("Zoom In", "জুম ইন"),
    zoomOut: getText("Zoom Out", "জুম আউট"),
    close: getText("Close", "বন্ধ")
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1280px] items-start justify-center px-4 pt-18 sm:px-6 lg:px-8">
        <div className="relative mt-10 grid w-full max-w-[920px] overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:grid-cols-[1.08fr_0.92fr]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center border transition"
            style={{ borderColor: borderColor, backgroundColor: '#FFFFFF', color: textMuted }}
            onMouseEnter={(e) => { e.currentTarget.style.color = primaryColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; }}
            aria-label={translations.close}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image Section with Zoom */}
          <div className="relative flex min-h-[460px] items-center justify-center bg-white px-10 py-10">
            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-full p-1 backdrop-blur-sm" style={{ backgroundColor: `${zoomControlBg}cc` }}>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-full transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${primaryColor}10`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={translations.zoomOut}
                aria-label={translations.zoomOut}
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-xs font-medium min-w-[45px] text-center" style={{ color: textColor }}>
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-full transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${primaryColor}10`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={translations.zoomIn}
                aria-label={translations.zoomIn}
              >
                <ZoomIn size={14} />
              </button>
            </div>

            {hasImages ? (
              <>
                <button
                  onClick={() => goSlide("prev")}
                  className="absolute left-4 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md transition"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  aria-label="Previous image"
                >
                  <ArrowLeftIcon size={18} />
                </button>

                <div
                  ref={imageContainerRef}
                  className="relative w-full h-full flex items-center justify-center cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                >
                  <div className="relative w-full h-[330px] overflow-hidden">
                    <img
                      src={currentImage}
                      alt={getProductName()}
                      className="w-full h-full object-contain"
                    />
                    
                    {showZoom && zoomLevel > 100 && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `url(${currentImage}) no-repeat`,
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          backgroundSize: `${zoomLevel}%`,
                          opacity: 0.95
                        }}
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => goSlide("next")}
                  className="absolute right-4 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md transition"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  aria-label="Next image"
                >
                  <ArrowRightIcon size={18} />
                </button>

                {showZoom && zoomLevel > 100 && (
                  <div className="absolute bottom-16 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-20">
                    {zoomLevel}% {isBn ? 'জুম' : 'zoom'}
                  </div>
                )}

                {/* Dots navigation */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {activeProduct.images.map((image, index) => (
                    <button
                      key={`${activeProduct.id}-${image}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition`}
                      style={{ 
                        backgroundColor: index === activeImageIndex ? dotActiveColor : dotInactiveColor,
                        opacity: index === activeImageIndex ? 1 : 0.6
                      }}
                      onMouseEnter={(e) => { if (index !== activeImageIndex) e.currentTarget.style.backgroundColor = primaryColor; }}
                      onMouseLeave={(e) => { if (index !== activeImageIndex) e.currentTarget.style.backgroundColor = dotInactiveColor; }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center" style={{ color: textMuted }}>{translations.noImageAvailable}</div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="px-7 py-6 sm:px-8 sm:py-7">
            <h3 className="max-w-[420px] text-[22px] font-medium leading-[1.35]" style={{ color: textColor }}>
              {getProductName()}
            </h3>

            <div className="mt-3 flex items-center gap-2">
              <Stars rating={activeProduct.rating || 0} />
              <span className="text-[15px]" style={{ color: reviewColor }}>
                {getReviewText()}
              </span>
            </div>

            <div className="mt-5 text-[31px] font-medium" style={{ color: priceColor }}>
              ${activeProduct.price || "0.00"}
              {activeProduct.originalPrice && (
                <span className="ml-2 text-lg line-through" style={{ color: textMuted }}>
                  ${activeProduct.originalPrice}
                </span>
              )}
            </div>

            <p className="mt-4 text-[15px] leading-8 line-clamp-3" style={{ color: textMuted }}>
              {getDescription()}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="mt-5 flex gap-3">
              <div className="flex h-[40px] w-[52px] items-center justify-center border bg-white text-[24px]" style={{ borderColor: borderColor, color: textMuted }}>
                {quantity}
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 px-5 text-[15px] font-semibold text-white transition"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              >
                {translations.addToCart}
              </button>
            </div>

            <button 
              onClick={handleBuyNow}
              className="mt-5 h-[41px] w-full text-[15px] font-semibold text-white transition"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            >
              {translations.buyNow}
            </button>

            {/* Quantity Adjuster */}
            <div className="mt-4 flex items-center gap-3 text-sm" style={{ color: textMuted }}>
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-lg transition"
                style={{ borderColor: borderColor }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.color = primaryColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textMuted; }}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-lg transition"
                style={{ borderColor: borderColor }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.color = primaryColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = textMuted; }}
                aria-label="Increase quantity"
              >
                +
              </button>
              <span>{translations.adjustQuantity}</span>
            </div>

            {/* Categories */}
            <p className="mt-4 text-[15px] leading-8" style={{ color: textMuted }}>
              {translations.categories}: {getCategoryName()}
            </p>

            {/* Stock Status */}
            {activeProduct.stock !== undefined && (
              <p className={`mt-2 text-sm ${activeProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {activeProduct.stock > 0 
                  ? (isBn ? `স্টকে আছে: ${activeProduct.stock} টি` : `In stock: ${activeProduct.stock} items`)
                  : (isBn ? 'স্টকে নেই' : 'Out of stock')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};