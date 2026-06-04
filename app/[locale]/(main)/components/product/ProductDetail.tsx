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
              ? "text-orange-400 fill-orange-400"
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

export default function ProductDetail({ product }) {
  const { addToCart, addToWishlist } = useApp();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // First color and first size selected by default
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizeNames?.[0] || ""); // ✅ ফিক্স: = useState
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

  // Handle size selection with Bengali support
  const handleSizeSelect = (size: string, sizeBn?: string) => {
    setSelectedSize(size);
    setSelectedSizeBn(sizeBn || size);
  };

  const clearSize = () => {
    setSelectedSize("");
    setSelectedSizeBn("");
  };

  // Get badge text based on language
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
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded-full transition-colors"
              title={isBn ? "জুম আউট" : "Zoom Out"}
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs font-medium text-gray-700 min-w-[45px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded-full transition-colors"
              title={isBn ? "জুম ইন" : "Zoom In"}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Main image with zoom */}
        <div
          ref={imageContainerRef}
          className="relative border border-gray-200 rounded overflow-hidden bg-gray-50 mb-3 group cursor-crosshair"
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

          {/* Zoom indicator */}
          {showZoom && zoomLevel > 100 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {zoomLevel}% {isBn ? 'জুম' : 'zoom'}
            </div>
          )}

          {/* Badges */}
          {product.badge && product.badge !== "none" && (
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {getBadgeText(product.badge)}
              </span>
            </div>
          )}

          <button
            onClick={() => goSlide("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-7 h-7 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => goSlide("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-7 h-7 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Thumbnails */}
        {productImages.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => goSlide("prev")}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={12} />
            </button>
            <div className="flex gap-1.5 overflow-hidden flex-1">
              {productImages.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`w-12 h-12 flex-shrink-0 border-2 rounded overflow-hidden transition-all ${activeThumb === i
                    ? "border-orange-500"
                    : "border-gray-200 hover:border-orange-300"
                    }`}
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
              className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
          <div className="flex flex-col items-center gap-1 text-center">
            <ShieldCheck size={22} className="text-green-600" />
            <span className="text-[12px] text-gray-600 font-medium">
              {isBn ? "১০০% অরিজিনাল" : "100% Original"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-green-600 text-[16px] font-bold">৳</span>
            <span className="text-[12px] text-gray-600 font-medium">
              {isBn ? "সেরা দাম" : "Best Price"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Truck size={22} className="text-green-600" />
            <span className="text-[12px] text-gray-600 font-medium">
              {isBn ? "ফ্রি শিপিং" : "Free Shipping"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Brand & Title */}
        <div className="mb-3">
          <p className="text-xs text-orange-500 font-medium mb-1">
            {isBn ? "ব্র্যান্ড:" : "Brand:"}{" "}
            <span className="text-orange-600 font-semibold">{product.brand || "Creative"}</span>
          </p>
          <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">
            {isBn ? (product.nameBn || product.name) : product.name}
          </h1>
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating || 4} count={product.reviewCount || 0} />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-3xl font-black text-gray-900">
            {taka(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-lg text-gray-500 line-through">
              {taka(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Hot sale badge */}
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded px-3 py-1.5 mb-4 w-fit">
          <Flame size={14} className="text-orange-500" />
          <span className="text-xs text-orange-600 font-medium">
            {product.sales || 0} {isBn ? "পণ্য সম্প্রতি বিক্রি হয়েছে" : "products sold recently"}
          </span>
        </div>

        {/* Color */}
        {product.colorHexes && product.colorHexes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              {isBn ? "রঙ:" : "Color:"} {getSelectedColorName()}
            </p>
            <div className="flex items-center gap-2">
              {product.colorHexes.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColorIndex(i)}
                  title={isBn ? product.colorNamesBn?.[i] : product.colorNames?.[i]}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColorIndex === i
                    ? "border-orange-500 scale-110 shadow"
                    : "border-gray-300 hover:border-gray-500"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size */}
        {product.sizeNames && product.sizeNames.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800">
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
                    className={`px-3 py-1 text-sm border rounded font-medium transition-all ${selectedSize === size
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500"
                      }`}
                  >
                    {isBn ? sizeBn : size}
                  </button>
                );
              })}
              {selectedSize && (
                <button
                  onClick={clearSize}
                  className="text-xs text-gray-400 hover:text-orange-500 ml-1 flex items-center gap-1"
                >
                  ✕ {isBn ? "সাফ করুন" : "Clear"}
                </button>
              )}
            </div>
            <p className="text-xs text-orange-500 font-medium mt-2">
              {product.stock || 0} {isBn ? "স্টকে আছে" : "in stock"}
            </p>
          </div>
        )}

        {/* Qty + Add to cart */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-2.5 bg-gray-100 hover:bg-orange-500 hover:text-white transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="px-5 py-2 text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="px-3 py-2.5 bg-gray-100 hover:bg-orange-500 hover:text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded transition-colors text-sm"
          >
            {isBn ? "কার্টে যোগ করুন" : "Add To Cart"}
          </button>
        </div>

        {/* Buy Now */}
        <Link
          href={'/checkout'}
          className="w-full block text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded transition-colors text-sm mb-4"
        >
          {isBn ? "এখনই কিনুন" : "Buy Now"}
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-5 mb-4 text-sm text-gray-600">
          <button
            onClick={() => addToWishlist(product)}
            className="flex items-center gap-1.5 hover:text-orange-500 transition-colors"
          >
            <Heart size={15} /> {isBn ? "উইশলিস্ট" : "Wishlist"}
          </button>
          <button className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
            <MessageCircle size={15} /> {isBn ? "জিজ্ঞাসা করুন" : "Ask Us"}
          </button>
          <button className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
            <Share2 size={15} /> {isBn ? "শেয়ার করুন" : "Share"}
          </button>
        </div>

        {/* Viewing info */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <Eye size={13} className="text-orange-500" />
          <span>{isBn ? "২১ জন এই পণ্যটি এখন দেখছেন" : "21 people are viewing this right now"}</span>
        </div>

        {/* Delivery info */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Truck size={13} className="text-gray-500" />
            <span>
              <strong>{isBn ? "ডেলিভারি সময়:" : "Estimated Delivery:"}</strong> {isBn ? "৪ কার্যদিবস" : "Up to 4 business days"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <RotateCcw size={13} className="text-gray-500" />
            <span>
              <strong>{isBn ? "ফ্রি শিপিং ও রিটার্ন:" : "Free Shipping & Returns:"}</strong> {isBn ? "৳২০০০ এর উপরে সব অর্ডারে" : "On all orders above ৳2000"}
            </span>
          </div>
        </div>

        {/* Secure checkout */}
        <div className="border border-gray-200 rounded p-3 bg-gray-50">
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-green-600" />
            {isBn ? "নিরাপদ চেকআউট নিশ্চিত" : "Guaranteed Safe And Secure Checkout"}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {["VISA", "MC", "AMEX", "PAYPAL", "BKASH"].map((card) => (
              <span
                key={card}
                className="border border-gray-300 rounded px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-white"
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Table */}
      <div className="w-full lg:w-[300px]">
        <table className="w-full text-left text-sm text-gray-600 border border-gray-100 shadow-sm rounded">
          <tbody>
            <tr className="bg-gradient-to-r from-orange-500 to-[#d4382c]">
              <th className="py-2 px-3 text-white font-bold">{isBn ? "বৈশিষ্ট্য" : "Attribute"}</th>
              <th className="py-2 px-3 text-white font-bold">{isBn ? "মান" : "Value"}</th>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "নাম" : "Name"}</th>
              <td className="py-2 px-3">{isBn ? (product.nameBn || product.name) : product.name}</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "ব্র্যান্ড" : "Brand"}</th>
              <td className="py-2 px-3">{product.brandName || "Creative"}</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "ক্যাটাগরি" : "Category"}</th>
              <td className="py-2 px-3">{product.categoryName || "Uncategorized"}</td>
            </tr>
            {product.colorNames && product.colorNames[selectedColorIndex] && (
              <tr className="border-t border-gray-100">
                <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "রঙ" : "Color"}</th>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: getSelectedColorHex() }}
                    />
                    {getSelectedColorName()}
                  </div>
                </td>
              </tr>
            )}
            {selectedSize && (
              <tr className="border-t border-gray-100">
                <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "সাইজ" : "Size"}</th>
                <td className="py-2 px-3">{selectedSize}</td>
              </tr>
            )}
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "দাম" : "Price"}</th>
              <td className="py-2 px-3">{taka(product.price)}</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "স্টক" : "Stock"}</th>
              <td className="py-2 px-3">{product.stock || 0} {isBn ? "আইটেম" : "items"}</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "রেটিং" : "Rating"}</th>
              <td className="py-2 px-3">
                <StarRating rating={product.rating || 4} />
              </td>
            </tr>
            {product.section && product.section !== "none" && (
              <tr className="border-t border-gray-100">
                <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "সেকশন" : "Section"}</th>
                <td className="py-2 px-3 capitalize">{product.section.replace("-", " ")}</td>
              </tr>
            )}
            {product.productType && (
              <tr className="border-t border-gray-100">
                <th className="py-2 px-3 font-medium text-gray-800">{isBn ? "টাইপ" : "Type"}</th>
                <td className="py-2 px-3 capitalize">{product.productType}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}