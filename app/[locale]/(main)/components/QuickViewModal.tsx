"use client";

import { ArrowLeftIcon, ArrowRightIcon, ZoomIn, ZoomOut, X } from "lucide-react";
import { Stars } from "./Stars";
import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext"; // ✅ যোগ করুন

export const QuickViewModal = ({ onClose, activeProduct, addToCart }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const isBn = language === 'bn';
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(200);
  const imageContainerRef = useRef(null);

  // Early return if no active product
  if (!activeProduct) {
    return null;
  }

  // Helper function to get text based on language
  const getText = (enText, bnText) => {
    return isBn ? bnText : enText;
  };

  // Get product name based on language
  const getProductName = () => {
    return isBn ? (activeProduct.nameBn || activeProduct.name) : activeProduct.name;
  };

  // Get category name based on language
  const getCategoryName = () => {
    if (isBn) {
      return activeProduct.categoryNameBn || activeProduct.categoryName || activeProduct.category || "অশ্রেণীবদ্ধ";
    }
    return activeProduct.categoryName || activeProduct.category || "Uncategorized";
  };

  // Get review text based on language
  const getReviewText = () => {
    if (isBn) {
      return activeProduct.reviewTextBn || activeProduct.reviewText || "কোন রিভিউ নেই";
    }
    return activeProduct.reviewText || "No reviews";
  };

  // Get description based on language
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
    // Reset zoom when changing image
    setZoomLevel(200);
  };

  // Zoom handlers
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

  // Add to cart handler
  const handleAddToCart = () => {
    const cartItem = {
      ...activeProduct,
      quantity: quantity,
    };
    addToCart?.(cartItem);
    onClose?.();
  };

  // Buy now handler
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

  // Translations
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
            className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center border border-[#d9d9d9] bg-white text-[#404040] transition hover:text-[#ea553b]"
            aria-label={translations.close}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image Section with Zoom */}
          <div className="relative flex min-h-[460px] items-center justify-center bg-white px-10 py-10">
            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/80 rounded-full p-1 backdrop-blur-sm">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                title={translations.zoomOut}
                aria-label={translations.zoomOut}
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-xs font-medium text-gray-700 min-w-[45px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
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
                  className="absolute left-4 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2654a] text-white shadow-md transition hover:bg-[#e55337]"
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
                    
                    {/* Zoom lens effect */}
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
                  className="absolute right-4 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2654a] text-white shadow-md transition hover:bg-[#e55337]"
                  aria-label="Next image"
                >
                  <ArrowRightIcon size={18} />
                </button>

                {/* Zoom indicator */}
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
                      className={`h-2.5 w-2.5 rounded-full transition ${index === activeImageIndex ? "bg-[#2f2f2f]" : "bg-[#b8b8b8]"}`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">{translations.noImageAvailable}</div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="px-7 py-6 sm:px-8 sm:py-7">
            <h3 className="max-w-[420px] text-[22px] font-medium leading-[1.35] text-[#3a3a3a]">
              {getProductName()}
            </h3>

            <div className="mt-3 flex items-center gap-2">
              <Stars rating={activeProduct.rating || 0} />
              <span className="text-[15px] text-[#ff613d]">
                {getReviewText()}
              </span>
            </div>

            <div className="mt-5 text-[31px] font-medium text-[#f05a40]">
              ${activeProduct.price || "0.00"}
              {activeProduct.originalPrice && (
                <span className="ml-2 text-lg text-gray-400 line-through">
                  ${activeProduct.originalPrice}
                </span>
              )}
            </div>

            <p className="mt-4 text-[15px] leading-8 text-[#7a7a7a] line-clamp-3">
              {getDescription()}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="mt-5 flex gap-3">
              <div className="flex h-[40px] w-[52px] items-center justify-center border border-[#dadada] bg-white text-[24px] text-[#7a7a7a]">
                {quantity}
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#f0533a] px-5 text-[15px] font-semibold text-white transition hover:bg-[#de452d]"
              >
                {translations.addToCart}
              </button>
            </div>

            <button 
              onClick={handleBuyNow}
              className="mt-5 h-[41px] w-full bg-[#f0533a] text-[15px] font-semibold text-white transition hover:bg-[#de452d]"
            >
              {translations.buyNow}
            </button>

            {/* Quantity Adjuster */}
            <div className="mt-4 flex items-center gap-3 text-sm text-[#7b7b7b]">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e3e3] text-lg transition hover:border-[#f0533a] hover:text-[#f0533a]"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3e3e3] text-lg transition hover:border-[#f0533a] hover:text-[#f0533a]"
                aria-label="Increase quantity"
              >
                +
              </button>
              <span>{translations.adjustQuantity}</span>
            </div>

            {/* Categories */}
            <p className="mt-4 text-[15px] leading-8 text-[#7a7a7a]">
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