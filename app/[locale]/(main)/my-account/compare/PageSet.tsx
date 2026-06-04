"use client";
import { BarChart2, Heart, Scale, X, ShoppingCart, Trash2, Star, CheckCircle, AlertCircle, TrendingDown, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

export const PageSet = () => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  
  const {
    compareList,
    removeFromCompare,
    isCompareOpen,
    setIsCompareOpen,
    clearAllCompare,
    addToCart,
  } = useApp();

  // Translations
  const texts = {
    compareProducts: isBn ? "পণ্য তুলনা করুন" : "Compare Products",
    compareDesc: isBn ? "আপনার জন্য সেরা পণ্য তুলনা করুন এবং বেছে নিন" : "Compare and choose the best product for you",
    clearAll: isBn ? "সব মুছুন" : "Clear All",
    noProducts: isBn ? "তুলনা করার জন্য কোন পণ্য নেই" : "No products to compare",
    noProductsDesc: isBn ? "তাদের বৈশিষ্ট্য তুলনা করতে এবং সঠিক সিদ্ধান্ত নিতে বিভিন্ন ক্যাটাগরি থেকে পণ্য যোগ করুন।" : "Add products from different categories to compare their features and make informed decisions.",
    browseProducts: isBn ? "পণ্য ব্রাউজ করুন" : "Browse Products",
    products: isBn ? "পণ্য" : "Products",
    image: isBn ? "ছবি" : "Image",
    price: isBn ? "দাম" : "Price",
    rating: isBn ? "রেটিং" : "Rating",
    availability: isBn ? "প্রাপ্যতা" : "Availability",
    category: isBn ? "ক্যাটাগরি" : "Category",
    brand: isBn ? "ব্র্যান্ড" : "Brand",
    description: isBn ? "বিবরণ" : "Description",
    actions: isBn ? "অ্যাকশন" : "Actions",
    addToCart: isBn ? "কার্টে যোগ করুন" : "Add to Cart",
    remove: isBn ? "সরান" : "Remove",
    inStock: isBn ? "স্টকে আছে" : "In Stock",
    outOfStock: isBn ? "স্টকে নেই" : "Out of Stock",
    new: isBn ? "নতুন" : "New",
    sale: isBn ? "ছাড়" : "Sale",
    noDescription: isBn ? "কোন বিবরণ পাওয়া যায়নি" : "No description available",
    uncategorized: isBn ? "অশ্রেণীবদ্ধ" : "Uncategorized",
    generic: isBn ? "জেনেরিক" : "Generic",
    wantToCompareMore: isBn ? "আরও তুলনা করতে চান?" : "Want to compare more?",
    youCanCompare: isBn => `আপনি সর্বোচ্চ ৪টি পণ্য তুলনা করতে পারেন। আরও ${4 - compareList.length}টি পণ্য যোগ করুন যাতে ভালো সিদ্ধান্ত নিতে পারেন।`,
    youCanCompareEn: (remaining) => `You can compare up to 4 products. Add ${remaining} more product${remaining !== 1 ? 's' : ''} to make better decision.`,
    browseMore: isBn ? "আরও পণ্য ব্রাউজ করুন →" : "Browse more products →",
    bestValuePick: isBn ? "সেরা মূল্যের পছন্দ" : "Best Value Pick",
    bestValueDesc: (name) => isBn 
      ? `দাম এবং ফিচারের ভিত্তিতে, ${name} সেরা মূল্য প্রদান করে।`
      : `Based on price and features, ${name} offers the best value for money.`,
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(isBn ? `${product.name} কার্টে যোগ করা হয়েছে` : `${product.name} added to cart`);
  };

  const handleRemoveFromCompare = (productId: string, productName: string) => {
    removeFromCompare(productId);
    toast.info(isBn ? `${productName} তুলনা থেকে সরানো হয়েছে` : `${productName} removed from compare`);
  };

  const handleClearAll = () => {
    clearAllCompare();
    toast.warning(isBn ? "সব পণ্য তুলনা থেকে সরানো হয়েছে" : "All products removed from compare");
  };

  // Get unique specifications from all products
  const getAllSpecs = () => {
    const specs = new Set<string>();
    compareList.forEach((product) => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach((key) => specs.add(key));
      }
    });
    return Array.from(specs);
  };

  const specifications = getAllSpecs();

  // Helper function to get product name based on language
  const getProductName = (product: any) => {
    return isBn ? (product.nameBn || product.name) : product.name;
  };

  // Helper function to get category name based on language
  const getCategoryName = (product: any) => {
    if (isBn) {
      return product.categoryNameBn || product.categoryName || texts.uncategorized;
    }
    return product.categoryName || texts.uncategorized;
  };

  // Helper function to get brand name based on language
  const getBrandName = (product: any) => {
    if (isBn) {
      return product.brandNameBn || product.brandName || texts.generic;
    }
    return product.brandName || texts.generic;
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-7 h-7 text-red-500" />
              {texts.compareProducts}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {texts.compareDesc}
            </p>
          </div>
          
          {compareList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {texts.clearAll}
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {compareList.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 md:py-24">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Scale className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {texts.noProducts}
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                {texts.noProductsDesc}
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCompareOpen(false)}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                {texts.browseProducts}
              </Link>
            </div>
          ) : (
            // Comparison Table
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {/* Header with Product Names */}
                  <tr className="bg-gradient-to-r from-gray-50 to-white">
                    <td className="w-36 p-4 border-b border-gray-200 bg-gray-50/50">
                      <div className="font-semibold text-gray-700">{texts.products}</div>
                    </td>
                    {compareList.map((product) => {
                      const hasDiscount = product.discount > 0 || (product.oldPrice && product.oldPrice > product.price);
                      const isNew = product.badge === 'new';
                      const isSale = product.badge === 'sale';
                      
                      return (
                        <td
                          key={product.id}
                          className="p-4 border-b border-gray-200 min-w-[260px] align-top"
                        >
                          <div className="relative">
                            {/* Badges */}
                            <div className="absolute top-0 left-0 flex gap-1">
                              {isNew && (
                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {texts.new}
                                </span>
                              )}
                              {isSale && hasDiscount && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {texts.sale}
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleRemoveFromCompare(product.id, getProductName(product))}
                              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all z-10"
                              aria-label={texts.remove}
                            >
                              <X className="w-4 h-4" />
                            </button>
                            
                            <Link href={`/product/${product.slug}`}>
                              <h3 className="text-base font-semibold text-gray-900 hover:text-red-500 transition-colors line-clamp-2 pr-6 mt-6">
                                {getProductName(product)}
                              </h3>
                            </Link>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Product Images */}
                  <tr>
                    <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.image}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200">
                        <Link href={`/product/${product.id}`}>
                          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden max-w-[200px] mx-auto hover:shadow-md transition-shadow">
                            <img
                              src={product.image}
                              alt={getProductName(product)}
                              className="w-full h-full object-cover p-4 hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr>
                    <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.price}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200">
                        <div>
                          <span className="text-xl font-bold text-red-500">
                            ${product.price}
                          </span>
                          {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${product.oldPrice}
                            </span>
                          )}
                          {product.discount != 0 && (
                            <span className="ml-2 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.rating}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < Math.floor(product.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr>
                    <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.availability}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          {product.stock ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-600">
                                {texts.inStock}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-red-500">
                                {texts.outOfStock}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.category}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200">
                        <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {getCategoryName(product)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr>
                    <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.brand}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200">
                        <span className="text-sm text-gray-900">
                          {getBrandName(product)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Specifications */}
                  {specifications.map((spec) => (
                    <tr key={spec}>
                      <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600 capitalize">
                        {isBn ? spec : spec}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 border-b border-gray-200">
                          <span className="text-sm text-gray-700">
                            {product.specifications?.[spec] || "—"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Description */}
                  <tr>
                    <td className="p-4 border-b border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.description}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {isBn ? (product.descriptionBn || product.description || texts.noDescription) : (product.description || texts.noDescription)}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-4 bg-gray-50/50 text-sm font-medium text-gray-600">
                      {texts.actions}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="space-y-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.stock}
                            className={cn(
                              "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors",
                              product.stock
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {texts.addToCart}
                          </button>
                          
                          <button
                            onClick={() => handleRemoveFromCompare(product.id, getProductName(product))}
                            className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
                          >
                            {texts.remove}
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recommendation Section */}
        {compareList.length > 0 && compareList.length < 4 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {texts.wantToCompareMore}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {isBn 
                ? texts.youCanCompare(compareList.length)
                : texts.youCanCompareEn(4 - compareList.length)}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-red-500 font-medium hover:text-red-600"
            >
              {texts.browseMore}
            </Link>
          </div>
        )}

        {/* Best Value Highlight */}
        {compareList.length >= 2 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">{texts.bestValuePick}</h4>
                <p className="text-sm text-green-700">
                  {texts.bestValueDesc(
                    compareList.reduce((best, current) => 
                      (current.price / (current.rating || 1)) < (best.price / (best.rating || 1)) ? current : best
                    ).name
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSet;