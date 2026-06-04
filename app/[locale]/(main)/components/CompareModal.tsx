"use client";

import { Clock, Heart, Plus, Printer, Scale, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext"; // ✅ যোগ করুন
import { toBengaliNumber } from "@/utils/helpers";
import { taka } from "@/utils/currency";

export const CompareModal = ({ compareList, onClose, onRemove, clearAll, addToCart }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const isBn = language === 'bn';
  const [showCompareSettings, setShowCompareSettings] = useState(false);
  console.log(compareList);
  
  // Helper function to get product name based on language
  const getProductName = (product) => {
    return isBn ? (product.nameBn || product.name) : product.name;
  };

  // Translations
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
      <div className="relative w-full max-w-5xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-100 px-6 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                checked={showCompareSettings}
                onChange={(e) => setShowCompareSettings(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-700">
                {texts.settings}
              </span>
            </label>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Compare Content */}
        <div className="flex-1 overflow-auto bg-white">
          {compareList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Scale className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">{texts.noProductsToCompare}</p>
              <button
                onClick={onClose}
                className="mt-4 text-red-500 hover:text-red-600 font-medium"
              >
                {texts.continueShopping}
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Product Names Row */}
                    <tr>
                      <td className="p-4 border-b border-gray-200 w-32"></td>
                      {compareList.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 border-b border-gray-200 min-w-[200px] align-top"
                        >
                          <div className="relative pr-6">
                            <h3 className="text-sm text-red-500 font-medium line-clamp-2">
                              {getProductName(product)}
                            </h3>
                            <button
                              onClick={() => onRemove(product.id)}
                              className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemove(product.id)}
                              className="text-xs text-red-500 hover:text-red-600 underline mt-1 block"
                            >
                              {texts.remove}
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Product Images Row */}
                    <tr>
                      <td className="p-4 border-b border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                        {texts.image}
                       </td>
                      {compareList.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 border-b border-gray-200"
                        >
                          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden max-w-[180px]">
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
                      <td className="p-4 border-b border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                        {texts.rating}
                       </td>
                      {compareList.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 border-b border-gray-200"
                        >
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (product.rating || 0)
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
                              <span className="text-xs text-gray-500 ml-1">
                                ({product.reviewCount})
                              </span>
                            )}
                          </div>
                         </td>
                      ))}
                    </tr>

                    {/* Price Row */}
                    <tr>
                      <td className="p-4 border-b border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                        {texts.price}
                       </td>
                      {compareList.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 border-b border-gray-200"
                        >
                          <div>
                            <span className="text-sm font-semibold text-red-500">
                              {isBn ? toBengaliNumber(taka(product.price).toString()) : product.price }
                            </span>
                            {product.oldPrice && (
                              <span className="text-xs text-gray-400 line-through ml-2">
                                {isBn ? toBengaliNumber(taka(product.oldPrice).toString()) : product.oldPrice }
                              </span>
                            )}
                          </div>
                         </td>
                      ))}
                    </tr>

                    {/* Category Row */}
                    <tr>
                      <td className="p-4 border-b border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                        {texts.category}
                       </td>
                      {compareList.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 border-b border-gray-200"
                        >
                          <span className="text-sm text-gray-900">
                            {isBn ? (product.categoryNameBn || product.categoryName) : product.categoryName}
                          </span>
                         </td>
                      ))}
                    </tr>

                    {/* Availability Row */}
                    <tr>
                      <td className="p-4 border-b border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
                        {texts.availability}
                       </td>
                      {compareList.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 border-b border-gray-200"
                        >
                          <span
                            className={cn(
                              "text-sm font-medium",
                              product.stock > 0
                                ? "text-green-600"
                                : "text-red-500",
                            )}
                          >
                            {product.stock > 0 ? texts.inStock : texts.outOfStock}
                          </span>
                         </td>
                      ))}
                    </tr>

                    {/* Add to Cart Row */}
                    <tr>
                      <td className="p-4 bg-gray-50 text-sm text-gray-600 font-medium">
                        {texts.addToCart}
                       </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4">
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-[#ef553f] hover:bg-red-600 text-white font-medium py-2 rounded transition-colors text-sm"
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
        <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
              aria-label={isBn ? "প্রিন্ট" : "Print"}
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
              aria-label={isBn ? "শেয়ার" : "Share"}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
              aria-label={isBn ? "যোগ করুন" : "Add"}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {compareList.map((product) => (
              <button
                key={product.id}
                onClick={() => onRemove(product.id)}
                className="relative w-10 h-10 bg-white rounded overflow-hidden border border-gray-600 hover:border-red-500 group"
                title={isBn ? `${getProductName(product)} সরান` : `Remove ${getProductName(product)}`}
              >
                <img
                  src={product.image}
                  alt={getProductName(product)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
            {compareList.length > 0 && (
              <button
                onClick={clearAll}
                className="ml-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors"
                title={isBn ? "সব আইটেম সরান" : "Clear all items"}
              >
                {texts.clearAll}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
              aria-label={isBn ? "বন্ধ" : "Close"}
            >
              <X className="w-4 h-4" />
            </button>
            <Link 
              href="/my-account/compare" 
              onClick={onClose} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded transition-colors text-sm"
            >
              {texts.compare}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};