"use client";

import { Plus, Printer, Scale, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { toBengaliNumber } from "@/utils/helpers";
import { taka } from "@/utils/currency";

interface CompareModalProps {
  compareList: any[];
  onClose: () => void;
  onRemove: (id: string) => void;
  clearAll: () => void;
  addToCart: (product: any) => void;
  settings?: any;
}

export const CompareModal = ({
  compareList,
  onClose,
  onRemove,
  clearAll,
  addToCart,
  settings = {}
}: CompareModalProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [showCompareSettings, setShowCompareSettings] = useState(false);

  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d32f2f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const bgGray = settings?.gray100 || "#F3F4F6";
  const priceColor = settings?.primaryColor || "#ef553f";
  const productLinkColor = settings?.primaryColor || "#ef553f";
  const headerBg = settings?.headerBackground || "#1F2937";
  const headerTextColor = "#FFFFFF";

  const getProductName = (product: any) => {
    return isBn ? (product.nameBn || product.name) : product.name;
  };

  const texts = {
    settings: isBn ? "সেটিংস" : "Settings",
    noProductsToCompare: isBn ? "তুলনা করার জন্য কোন পণ্য নেই" : "No products to compare",
    continueShopping: isBn ? "শপিং চালিয়ে যান" : "Continue Shopping",
    image: isBn ? "ছবি" : "Image",
    rating: isBn ? "রেটিং" : "Rating",
    price: isBn ? "দাম" : "Price",
    category: isBn ? "ক্যাটাগরি" : "Category",
    availability: isBn ? "স্টক অবস্থা" : "Availability",
    addToCart: isBn ? "কার্টে যোগ করুন" : "Add to Cart",
    remove: isBn ? "সরান" : "remove",
    inStock: isBn ? "স্টকে আছে" : "In Stock",
    outOfStock: isBn ? "স্টকে নেই" : "Out of Stock",
    clearAll: isBn ? "সব সরান" : "Clear All",
    compare: isBn ? "তুলনা করুন" : "COMPARE"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0" style={{ backgroundColor: bgGray, borderBottomColor: borderColor }}>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded focus:ring-2"
                style={{ borderColor: borderColor, color: primaryColor }}
                checked={showCompareSettings}
                onChange={(e) => setShowCompareSettings(e.target.checked)}
              />
              <span className="text-sm font-medium" style={{ color: textMuted }}>
                {texts.settings}
              </span>
            </label>
          </div>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = textColor}
            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Compare Content */}
        <div className="flex-1 overflow-auto bg-white">
          {compareList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Scale className="w-16 h-16 mb-4" style={{ color: borderColor }} />
              <p className="text-sm" style={{ color: textMuted }}>{texts.noProductsToCompare}</p>
              <button
                onClick={onClose}
                className="mt-4 font-medium transition-colors"
                style={{ color: primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
              >
                {texts.continueShopping}
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Product Names Row */}
                    <tr>
                      <td className="p-4 border-b w-32" style={{ borderBottomColor: borderColor }} />
                      {compareList.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 border-b min-w-[200px] align-top"
                          style={{ borderBottomColor: borderColor }}
                        >
                          <div className="relative pr-6">
                            <h3 className="text-sm font-medium line-clamp-2" style={{ color: productLinkColor }}>
                              {getProductName(product)}
                            </h3>
                            <button
                              onClick={() => onRemove(product.id)}
                              className="absolute top-0 right-0 transition-colors"
                              style={{ color: textMuted }}
                              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                              onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemove(product.id)}
                              className="text-xs underline mt-1 block transition-colors"
                              style={{ color: primaryColor }}
                              onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
                              onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
                            >
                              {texts.remove}
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Product Images Row */}
                    <tr>
                      <td className="p-4 border-b text-sm font-medium" style={{ borderBottomColor: borderColor, backgroundColor: bgGray, color: textMuted }}>
                        {texts.image}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 border-b" style={{ borderBottomColor: borderColor }}>
                          <div className="aspect-square rounded-lg overflow-hidden max-w-[180px]" style={{ backgroundColor: bgGray }}>
                            <img
                              src={product.image}
                              alt={getProductName(product)}
                              className="w-full h-full object-contain p-4"
                            />
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Rating Row */}
                    <tr>
                      <td className="p-4 border-b text-sm font-medium" style={{ borderBottomColor: borderColor, backgroundColor: bgGray, color: textMuted }}>
                        {texts.rating}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 border-b" style={{ borderBottomColor: borderColor }}>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < (product.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 fill-gray-200"
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            {product.reviewCount && (
                              <span className="text-xs ml-1" style={{ color: textMuted }}>
                                ({product.reviewCount})
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Price Row */}
                    <tr>
                      <td className="p-4 border-b text-sm font-medium" style={{ borderBottomColor: borderColor, backgroundColor: bgGray, color: textMuted }}>
                        {texts.price}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 border-b" style={{ borderBottomColor: borderColor }}>
                          <div>
                            <span className="text-sm font-semibold" style={{ color: priceColor }}>
                              {isBn ? toBengaliNumber(taka(product.price).toString()) : `$${product.price}`}
                            </span>
                            {product.oldPrice && (
                              <span className="text-xs line-through ml-2" style={{ color: textMuted }}>
                                {isBn ? toBengaliNumber(taka(product.oldPrice).toString()) : `$${product.oldPrice}`}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Category Row */}
                    <tr>
                      <td className="p-4 border-b text-sm font-medium" style={{ borderBottomColor: borderColor, backgroundColor: bgGray, color: textMuted }}>
                        {texts.category}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 border-b" style={{ borderBottomColor: borderColor }}>
                          <span className="text-sm" style={{ color: textColor }}>
                            {isBn ? (product.categoryNameBn || product.categoryName) : product.categoryName}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Availability Row */}
                    <tr>
                      <td className="p-4 border-b text-sm font-medium" style={{ borderBottomColor: borderColor, backgroundColor: bgGray, color: textMuted }}>
                        {texts.availability}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 border-b" style={{ borderBottomColor: borderColor }}>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              product.stock > 0 ? "text-green-600" : "text-red-500"
                            )}
                          >
                            {product.stock > 0 ? texts.inStock : texts.outOfStock}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Add to Cart Row */}
                    <tr>
                      <td className="p-4 text-sm font-medium" style={{ backgroundColor: bgGray, color: textMuted }}>
                        {texts.addToCart}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4">
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full text-white font-medium py-2 rounded transition-colors text-sm"
                            style={{ backgroundColor: primaryColor }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                          >
                            {texts.addToCart}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 flex-wrap gap-2" style={{ backgroundColor: headerBg }}>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center gap-2 text-white font-medium px-4 py-2.5 rounded transition-colors text-sm"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              aria-label={isBn ? "প্রিন্ট" : "Print"}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? "প্রিন্ট" : "Print"}</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 text-white font-medium px-4 py-2.5 rounded transition-colors text-sm"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              aria-label={isBn ? "শেয়ার" : "Share"}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? "শেয়ার" : "Share"}</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 text-white font-medium px-4 py-2.5 rounded transition-colors text-sm"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              aria-label={isBn ? "যোগ করুন" : "Add"}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{isBn ? "যোগ করুন" : "Add"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {compareList.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onRemove(product.id)}
                  className="relative w-10 h-10 bg-white rounded overflow-hidden border group flex-shrink-0"
                  style={{ borderColor: `${headerTextColor}33` }}
                  title={isBn ? `${getProductName(product)} সরান` : `Remove ${getProductName(product)}`}
                >
                  <img
                    src={product.image}
                    alt={getProductName(product)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${primaryColor}cc` }}>
                    <X className="w-4 h-4 text-white" />
                  </div>
                </button>
              ))}

              {compareList.length > 0 && (
                <button
                  onClick={clearAll}
                  className="ml-2 px-4 py-2 text-white text-xs font-medium rounded transition-colors"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  aria-label={isBn ? "সব সরান" : "Clear All"}
                >
                  {texts.clearAll}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded flex items-center justify-center transition-colors"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <Link
              href="/my-account/compare"
              onClick={onClose}
              className="text-white font-medium px-6 py-2.5 rounded transition-colors text-sm"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            >
              {texts.compare}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};