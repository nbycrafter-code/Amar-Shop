"use client";

import { useState, useRef } from "react";
import {
  Star,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Eye,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Flame,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { taka } from "@/utils/currency";
import Link from "next/link";

function StarRating({ rating, count }: { rating: number; count?: number }) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-200"
          }
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-blue-500 ml-1">
          ({count} {language === 'bn' ? 'রিভিউ' : 'reviews'})
        </span>
      )}
    </div>
  );
}

interface ProductDetailProps {
  product: any;
  settings?: any; // settings prop যোগ করা হলো
}

export default function ProductDetail({ product, settings = {} }: ProductDetailProps) {
  const { addToCart, addToWishlist } = useApp();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#f97316";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#ea580c";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const successColor = settings?.successColor || "#10B981";
  const warningColor = settings?.warningColor || "#F59E0B";

  // First color and first size selected by default
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizeNames?.[0] || "");
  const [selectedSizeBn, setSelectedSizeBn] = useState(product?.sizeNamesBn?.[0] || "");
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(200);
  const imageContainerRef = useRef(null);

  const productImages = product?.multiImages
    ? [product.image, ...product.multiImages].filter(Boolean)
    : [product.image];

  const goSlide = (direction: "prev" | "next") => {
    setActiveThumb((prev) => {
      if (direction === "prev") {
        return (prev - 1 + productImages.length) % productImages.length;
      }
      return (prev + 1) % productImages.length;
    });
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

  const currentImage = productImages[activeThumb];

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity: qty,
      selectedColor: product?.colorNames?.[selectedColorIndex] || "",
      selectedColorBn: product?.colorNamesBn?.[selectedColorIndex] || "",
      selectedColorHex: product?.colorHexes?.[selectedColorIndex] || "",
      selectedSize: selectedSize,
      selectedSizeBn: selectedSizeBn
    };
    addToCart(cartItem);
  };

  const getSelectedColorName = () => {
    if (isBn) {
      return product?.colorNamesBn?.[selectedColorIndex] || "নির্বাচিত হয়নি";
    }
    return product?.colorNames?.[selectedColorIndex] || "Not selected";
  };

  const getSelectedColorHex = () => {
    if (product?.colorHexes && product.colorHexes[selectedColorIndex]) {
      return product.colorHexes[selectedColorIndex];
    }
    return "#000000";
  };

  const handleSizeSelect = (size: string, sizeBn?: string) => {
    setSelectedSize(size);
    setSelectedSizeBn(sizeBn || size);
  };

  const clearSize = () => {
    setSelectedSize("");
    setSelectedSizeBn("");
  };

  const getBadgeText = (badge: string) => {
    const badges = {
      hot: isBn ? "গরম 🔥" : "HOT 🔥",
      sale: isBn ? "ছাড় 💰" : "SALE 💰",
      new: isBn ? "নতুন 🆕" : "NEW 🆕",
      trending: isBn ? "ট্রেন্ডিং 📈" : "TRENDING 📈",
      limited: isBn ? "সীমিত 🎯" : "LIMITED 🎯",
      exclusive: isBn ? "এক্সক্লুসিভ ✨" : "EXCLUSIVE ✨",
      "best-seller": isBn ? "বেস্ট সেলার 🏆" : "BEST SELLER 🏆",
    };
    return badges[badge] || badge;
  };

  return (
    <div className="flex gap-6 flex-wrap lg:flex-nowrap">
      {/* Image Gallery */}
      <div className="w-full lg:w-[380px] flex-shrink-0">
        {/* Zoom controls */}
        <div className="flex items-center justify-end gap-2 mb-2">
          <div className="flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: hoverBg }}>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-full transition-colors"
              style={{ color: textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = cardBg;
                e.currentTarget.style.color = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textMuted;
              }}
              title={isBn ? "জুম আউট" : "Zoom Out"}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = cardBg;
                e.currentTarget.style.color = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textMuted;
              }}
              title={isBn ? "জুম ইন" : "Zoom In"}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Main image with zoom */}
        <div
          ref={imageContainerRef}
          className="relative border rounded overflow-hidden mb-3 group cursor-crosshair"
          style={{ borderColor: borderColor, backgroundColor: hoverBg }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >
          <div className="relative w-full h-[420px] overflow-hidden">
            <img
              src={currentImage}
              alt={isBn ? (product.nameBn || product.name) : product.name}
              className="w-full h-full object-cover object-top"
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

          {showZoom && zoomLevel > 100 && (
            <div className="absolute bottom-2 right-2 text-white text-xs px-2 py-1 rounded backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
              {zoomLevel}% {isBn ? 'জুম' : 'zoom'}
            </div>
          )}

          {product.badge && product.badge !== "none" && (
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: primaryColor }}>
                {getBadgeText(product.badge)}
              </span>
            </div>
          )}

          <button
            onClick={() => goSlide("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 shadow rounded-full w-7 h-7 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
            style={{ backgroundColor: cardBg, color: textMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = cardBg;
              e.currentTarget.style.color = textMuted;
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => goSlide("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 shadow rounded-full w-7 h-7 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
            style={{ backgroundColor: cardBg, color: textMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = cardBg;
              e.currentTarget.style.color = textMuted;
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Thumbnails */}
        {productImages.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => goSlide("prev")}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: hoverBg, color: textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.color = textMuted;
              }}
            >
              <ChevronLeft size={12} />
            </button>
            <div className="flex gap-1.5 overflow-hidden flex-1">
              {productImages.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`w-12 h-12 flex-shrink-0 border-2 rounded overflow-hidden transition-all`}
                  style={{
                    borderColor: activeThumb === i ? primaryColor : borderColor
                  }}
                >
                  <img
                    src={thumb}
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => goSlide("next")}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: hoverBg, color: textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.color = textMuted;
              }}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3" style={{ borderTopColor: borderColor }}>
          <div className="flex flex-col items-center gap-1 text-center">
            <ShieldCheck size={22} style={{ color: successColor }} />
            <span className="text-[12px] font-medium" style={{ color: textMuted }}>
              {isBn ? "১০০% অরিজিনাল" : "100% Original"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[16px] font-bold" style={{ color: successColor }}>৳</span>
            <span className="text-[12px] font-medium" style={{ color: textMuted }}>
              {isBn ? "সেরা দাম" : "Best Price"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Truck size={22} style={{ color: successColor }} />
            <span className="text-[12px] font-medium" style={{ color: textMuted }}>
              {isBn ? "ফ্রি শিপিং" : "Free Shipping"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Brand & Title */}
        <div className="mb-3">
          <p className="text-xs font-medium mb-1" style={{ color: primaryColor }}>
            {isBn ? "ব্র্যান্ড:" : "Brand:"}{" "}
            <span className="font-semibold" style={{ color: primaryColor }}>{product.brand || "Creative"}</span>
          </p>
          <h1 className="text-xl font-bold leading-tight mb-2" style={{ color: textColor }}>
            {isBn ? (product.nameBn || product.name) : product.name}
          </h1>
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating || 4} count={product.reviewCount || 0} />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-3xl font-black" style={{ color: textColor }}>
            {taka(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-lg line-through" style={{ color: textMuted }}>
              {taka(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Hot sale badge */}
        <div className="flex items-center gap-2 border rounded px-3 py-1.5 mb-4 w-fit" style={{ backgroundColor: `${warningColor}20`, borderColor: `${warningColor}30` }}>
          <Flame size={14} style={{ color: warningColor }} />
          <span className="text-xs font-medium" style={{ color: warningColor }}>
            {product.sales || 0} {isBn ? "পণ্য সম্প্রতি বিক্রি হয়েছে" : "products sold recently"}
          </span>
        </div>

        {/* Color */}
        {product.colorHexes && product.colorHexes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2" style={{ color: textColor }}>
              {isBn ? "রঙ:" : "Color:"} {getSelectedColorName()}
            </p>
            <div className="flex items-center gap-2">
              {product.colorHexes.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColorIndex(i)}
                  title={isBn ? product.colorNamesBn?.[i] : product.colorNames?.[i]}
                  className={`w-8 h-8 rounded-full border-2 transition-all`}
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColorIndex === i ? primaryColor : borderColor,
                    transform: selectedColorIndex === i ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: selectedColorIndex === i ? `0 0 0 2px ${primaryColor}20` : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size */}
        {product.sizeNames && product.sizeNames.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{ color: textColor }}>
                {isBn ? "সাইজ:" : "Size:"} {isBn ? selectedSizeBn : selectedSize}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {product.sizeNames.map((size, i) => {
                const sizeBn = product.sizeNamesBn?.[i] || size;
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size, sizeBn)}
                    className={`px-3 py-1 text-sm border rounded font-medium transition-all`}
                    style={{
                      backgroundColor: selectedSize === size ? primaryColor : 'transparent',
                      color: selectedSize === size ? '#FFFFFF' : textMuted,
                      borderColor: selectedSize === size ? primaryColor : borderColor
                    }}
                    onMouseEnter={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.color = primaryColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.color = textMuted;
                      }
                    }}
                  >
                    {isBn ? sizeBn : size}
                  </button>
                );
              })}
              {selectedSize && (
                <button
                  onClick={clearSize}
                  className="text-xs flex items-center gap-1 transition-colors"
                  style={{ color: textMuted }}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
                >
                  ✕ {isBn ? "সাফ করুন" : "Clear"}
                </button>
              )}
            </div>
            <p className="text-xs font-medium mt-2" style={{ color: primaryColor }}>
              {product.stock || 0} {isBn ? "স্টকে আছে" : "in stock"}
            </p>
          </div>
        )}

        {/* Qty + Add to cart */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center border rounded overflow-hidden" style={{ borderColor: borderColor }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-2.5 transition-colors"
              style={{ backgroundColor: hoverBg, color: textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.color = textMuted;
              }}
            >
              <Minus size={14} />
            </button>
            <span className="px-5 py-2 text-sm font-semibold" style={{ color: textColor }}>{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="px-3 py-2.5 transition-colors"
              style={{ backgroundColor: hoverBg, color: textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
                e.currentTarget.style.color = textMuted;
              }}
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 text-white font-bold py-2.5 rounded transition-colors text-sm"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          >
            {isBn ? "কার্টে যোগ করুন" : "Add To Cart"}
          </button>
        </div>

        {/* Buy Now */}
        <Link
          href={'/checkout'}
          className="w-full block text-center text-white font-bold py-2.5 rounded transition-colors text-sm mb-4"
          style={{ backgroundColor: buttonHoverColor }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
        >
          {isBn ? "এখনই কিনুন" : "Buy Now"}
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-5 mb-4 text-sm">
          <button
            onClick={() => addToWishlist(product)}
            className="flex items-center gap-1.5 transition-colors"
            style={{ color: textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
          >
            <Heart size={15} /> {isBn ? "উইশলিস্ট" : "Wishlist"}
          </button>
          <button className="flex items-center gap-1.5 transition-colors" style={{ color: textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}>
            <MessageCircle size={15} /> {isBn ? "জিজ্ঞাসা করুন" : "Ask Us"}
          </button>
          <button className="flex items-center gap-1.5 transition-colors" style={{ color: textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}>
            <Share2 size={15} /> {isBn ? "শেয়ার করুন" : "Share"}
          </button>
        </div>

        {/* Viewing info */}
        <div className="flex items-center gap-1.5 text-xs mb-3">
          <Eye size={13} style={{ color: primaryColor }} />
          <span style={{ color: textMuted }}>{isBn ? "২১ জন এই পণ্যটি এখন দেখছেন" : "21 people are viewing this right now"}</span>
        </div>

        {/* Delivery info */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
            <Truck size={13} style={{ color: textMuted }} />
            <span>
              <strong style={{ color: textColor }}>{isBn ? "ডেলিভারি সময়:" : "Estimated Delivery:"}</strong> {isBn ? "৪ কার্যদিবস" : "Up to 4 business days"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
            <RotateCcw size={13} style={{ color: textMuted }} />
            <span>
              <strong style={{ color: textColor }}>{isBn ? "ফ্রি শিপিং ও রিটার্ন:" : "Free Shipping & Returns:"}</strong> {isBn ? "৳২০০০ এর উপরে সব অর্ডারে" : "On all orders above ৳2000"}
            </span>
          </div>
        </div>

        {/* Secure checkout */}
        <div className="border rounded p-3" style={{ borderColor: borderColor, backgroundColor: hoverBg }}>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: textColor }}>
            <ShieldCheck size={14} style={{ color: successColor }} />
            {isBn ? "নিরাপদ চেকআউট নিশ্চিত" : "Guaranteed Safe And Secure Checkout"}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {["VISA", "MC", "AMEX", "PAYPAL", "BKASH"].map((card) => (
              <span
                key={card}
                className="border rounded px-2 py-0.5 text-[10px] font-bold"
                style={{ borderColor: borderColor, color: textMuted, backgroundColor: cardBg }}
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Table */}
      <div className="w-full lg:w-[300px]">
        <table className="w-full text-left text-sm border shadow-sm rounded" style={{ borderColor: borderColor }}>
          <tbody>
            <tr style={{ background: `linear-gradient(135deg, ${primaryColor}, ${buttonHoverColor})` }}>
              <th className="py-2 px-3 text-white font-bold">{isBn ? "বৈশিষ্ট্য" : "Attribute"}</th>
              <th className="py-2 px-3 text-white font-bold">{isBn ? "মান" : "Value"}</th>
            </tr>
            <tr className="border-t" style={{ borderTopColor: borderColor }}>
              <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "নাম" : "Name"}</th>
              <td className="py-2 px-3" style={{ color: textMuted }}>{isBn ? (product.nameBn || product.name) : product.name}</td>
            </tr>
            <tr className="border-t" style={{ borderTopColor: borderColor }}>
              <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "ব্র্যান্ড" : "Brand"}</th>
              <td className="py-2 px-3">
                <Link href={`/brands/${product.brandSlug}`} className="transition-colors" style={{ color: primaryColor }} onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor} onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}>
                  {product.brandName || "Creative"}
                </Link>
              </td>
            </tr>
            <tr className="border-t" style={{ borderTopColor: borderColor }}>
              <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "ক্যাটাগরি" : "Category"}</th>
              <td className="py-2 px-3">
                {product.categoryId && product.categoryName && (
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/categories/${product.categorySlug}`}
                      className="transition-colors duration-200 text-sm font-medium"
                      style={{ color: primaryColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
                    >
                      {isBn ? (product.categoryNameBn || product.categoryName) : product.categoryName}
                    </Link>
                    {product.subCategoryId && product.subCategoryName && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: textMuted }}>
                        <span>→</span>
                        <Link
                          href={`/categories/${product.categorySlug}/${product.subCategorySlug}`}
                          className="transition-colors duration-200"
                          style={{ color: primaryColor }}
                          onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
                          onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
                        >
                          {isBn ? (product.subCategoryNameBn || product.subCategoryName) : product.subCategoryName}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                {!product.categoryId && product.subCategoryId && product.subCategoryName && (
                  <Link
                    href={`/subcategories/${product.subCategorySlug}`}
                    className="transition-colors duration-200 text-sm"
                    style={{ color: primaryColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
                  >
                    {isBn ? (product.subCategoryNameBn || product.subCategoryName) : product.subCategoryName}
                  </Link>
                )}
                {!product.categoryId && !product.subCategoryId && (
                  <span className="text-sm" style={{ color: textMuted }}>
                    {isBn ? 'কোন শ্রেণী নেই' : 'Uncategorized'}
                  </span>
                )}
              </td>
            </tr>
            {product.colorNames && product.colorNames[selectedColorIndex] && (
              <tr className="border-t" style={{ borderTopColor: borderColor }}>
                <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "রঙ" : "Color"}</th>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: getSelectedColorHex(), borderColor: borderColor }}
                    />
                    <span style={{ color: textMuted }}>{getSelectedColorName()}</span>
                  </div>
                </td>
              </tr>
            )}
            {selectedSize && (
              <tr className="border-t" style={{ borderTopColor: borderColor }}>
                <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "সাইজ" : "Size"}</th>
                <td className="py-2 px-3" style={{ color: textMuted }}>{selectedSize}</td>
              </tr>
            )}
            <tr className="border-t" style={{ borderTopColor: borderColor }}>
              <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "দাম" : "Price"}</th>
              <td className="py-2 px-3" style={{ color: primaryColor }}>{taka(product.price)}</td>
            </tr>
            <tr className="border-t" style={{ borderTopColor: borderColor }}>
              <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "স্টক" : "Stock"}</th>
              <td className="py-2 px-3" style={{ color: textMuted }}>{product.stock || 0} {isBn ? "আইটেম" : "items"}</td>
            </tr>
            <tr className="border-t" style={{ borderTopColor: borderColor }}>
              <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "রেটিং" : "Rating"}</th>
              <td className="py-2 px-3">
                <StarRating rating={product.rating || 4} />
              </td>
            </tr>
            {product.section && product.section !== "none" && (
              <tr className="border-t" style={{ borderTopColor: borderColor }}>
                <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "সেকশন" : "Section"}</th>
                <td className="py-2 px-3 capitalize" style={{ color: textMuted }}>{product.section.replace("-", " ")}</td>
              </tr>
            )}
            {product.productType && (
              <tr className="border-t" style={{ borderTopColor: borderColor }}>
                <th className="py-2 px-3 font-medium" style={{ color: textColor }}>{isBn ? "টাইপ" : "Type"}</th>
                <td className="py-2 px-3 capitalize" style={{ color: textMuted }}>{product.productType}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}