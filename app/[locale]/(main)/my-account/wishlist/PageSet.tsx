"use client";
import { Heart, X, ShoppingCart, Trash2, Sparkles, Clock, ChevronRight, Star, TrendingUp, ShieldCheck, Truck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export const PageSet = () => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const { wishlist, removeFromWishlist, addToCart } = useApp();
  const [isMoving, setIsMoving] = useState<string | null>(null);

  // Translations
  const texts = {
    myWishlist: isBn ? "আমার উইশলিস্ট" : "My Wishlist",
    itemsSaved: (count) => isBn ? `${count}টি আইটেম সংরক্ষিত আছে` : `${count} ${count === 1 ? "item" : "items"} saved for later`,
    moveAllToCart: isBn ? "সব কার্টে সরান" : "Move All to Cart",
    emptyWishlist: isBn ? "আপনার উইশলিস্ট খালি" : "Your Wishlist is Empty",
    emptyDesc: isBn 
      ? "মনে হচ্ছে আপনি এখনও আপনার উইশলিস্টে কিছু যোগ করেননি। আমাদের পণ্য explore করুন এবং আপনার প্রিয় জিনিস সংরক্ষণ করুন!"
      : "Looks like you haven't added anything to your wishlist yet. Explore our products and save your favorites!",
    startShopping: isBn ? "শপিং শুরু করুন" : "Start Shopping",
    totalItems: isBn ? "মোট আইটেম" : "Total Items",
    totalValue: isBn ? "মোট মূল্য" : "Total Value",
    savedItems: isBn ? "সংরক্ষিত আইটেম" : "Saved Items",
    readyToBuy: isBn ? "কেনার জন্য প্রস্তুত" : "Ready to Buy",
    inStock: isBn ? "স্টকে আছে" : "In Stock",
    outOfStock: isBn ? "স্টকে নেই" : "Out of Stock",
    addToCart: isBn ? "কার্টে যোগ করুন" : "Add to Cart",
    adding: isBn ? "যোগ করা হচ্ছে..." : "Adding...",
    viewDetails: isBn ? "বিস্তারিত দেখুন" : "View Details",
    dontMissOut: isBn ? "মিস করবেন না!" : "Don't miss out!",
    dontMissDesc: isBn 
      ? "আপনার উইশলিস্টের আইটেমগুলি শীঘ্রই স্টকে শেষ হতে পারে। আপনার প্রিয় জিনিস সুরক্ষিত করতে এখনই অর্ডার করুন!"
      : "Items in your wishlist might go out of stock soon. Checkout now to secure your favorites!",
    browseMore: isBn ? "আরও ব্রাউজ করুন" : "Browse More",
    save: isBn ? "সেভ করুন" : "Save",
    addedToday: isBn ? "আজ যোগ করা হয়েছে" : "Added today",
    addedYesterday: isBn ? "গতকাল যোগ করা হয়েছে" : "Added yesterday",
    addedDaysAgo: (days) => isBn ? `${days} দিন আগে যোগ করা হয়েছে` : `Added ${days} days ago`,
    recentlyAdded: isBn ? "সম্প্রতি যোগ করা হয়েছে" : "Recently added",
    freeShipping: isBn ? "ফ্রি শিপিং" : "Free Shipping",
    bestPrice: isBn ? "সেরা দাম" : "Best Price",
    genuineProduct: isBn ? "১০০% জেনুইন" : "100% Genuine",
  };

  const handleAddToCart = async (item: any) => {
    setIsMoving(item.id);
    
    setTimeout(() => {
      addToCart(item);
      toast.success(isBn ? `${item.name} কার্টে যোগ করা হয়েছে!` : `${item.name} added to cart!`);
      setIsMoving(null);
    }, 500);
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    removeFromWishlist(id);
    toast.info(isBn ? `${name} উইশলিস্ট থেকে সরানো হয়েছে` : `${name} removed from wishlist`);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item);
    });
    toast.success(isBn ? `${wishlist.length}টি আইটেম কার্টে সরানো হয়েছে!` : `${wishlist.length} items moved to cart!`);
  };

  const getProductName = (item: any) => {
    return isBn ? (item.nameBn || item.name) : item.name;
  };

  const getCategoryName = (item: any) => {
    if (isBn) {
      return item.categoryNameBn || item.categoryName;
    }
    return item.categoryName;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return texts.recentlyAdded;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return texts.addedToday;
    if (diffDays === 1) return texts.addedYesterday;
    if (diffDays < 7) return texts.addedDaysAgo(diffDays);
    return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);
  const readyToBuyCount = wishlist.filter(item => item.stock).length;

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section with Gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-xl">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {texts.myWishlist}
                </h1>
              </div>
              <p className="text-gray-500 text-sm ml-12">
                {texts.itemsSaved(wishlist.length)}
              </p>
            </div>
            
            {wishlist.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4" />
                {texts.moveAllToCart}
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {wishlist.length === 0 ? (
          // Empty State with Animation
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-16 md:py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
                <Heart size={56} className="text-red-400" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{texts.emptyWishlist}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto px-4">
              {texts.emptyDesc}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {texts.startShopping}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Cards with Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm">{texts.totalItems}</p>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm">{texts.totalValue}</p>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-500">${totalValue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm">{texts.savedItems}</p>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-500">{wishlist.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm">{texts.readyToBuy}</p>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-500">{readyToBuyCount}</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-600">{texts.genuineProduct}</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100">
                <Truck className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600">{texts.freeShipping}</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-gray-600">{texts.bestPrice}</span>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {wishlist.map((item, index) => {
                  const productName = getProductName(item);
                  const discount = item.originalPrice && item.originalPrice > item.price 
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0;
                  
                  return (
                    <div
                      key={item.id}
                      className="group relative hover:bg-gradient-to-r hover:from-red-50/50 hover:to-transparent transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-6">
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id, productName)}
                          className="absolute md:relative top-4 right-4 md:top-auto md:right-auto p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          aria-label={texts.viewDetails}
                        >
                          <Trash2 size={16} />
                        </button>

                        {/* Product Image */}
                        <Link href={`/product/${item.id}`} className="flex-shrink-0">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all group-hover:scale-[1.02]">
                            <img
                              src={item.image}
                              alt={productName}
                              className="w-full h-full object-cover p-2 group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 hover:text-red-500 transition-colors line-clamp-2">
                              {productName}
                            </h3>
                          </Link>
                          
                          {/* Rating */}
                          {item.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-3.5 h-3.5",
                                    i < Math.floor(item.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                              <span className="text-xs text-gray-400 ml-1">
                                ({item.reviewCount || 0})
                              </span>
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xl md:text-2xl font-bold text-red-500">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">
                                  -{discount}%
                                </span>
                              </>
                            )}
                          </div>

                          {/* Stock Status & Date */}
                          <div className="flex items-center gap-3 mt-2">
                            {item.stock ? (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                {texts.inStock}
                              </span>
                            ) : (
                              <span className="text-xs text-red-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {texts.outOfStock}
                              </span>
                            )}
                            
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(item.dateAdded)}
                            </span>
                          </div>

                          {/* Category/Brand */}
                          {getCategoryName(item) && (
                            <p className="text-xs text-gray-400 mt-1">
                              {getCategoryName(item)}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 min-w-[140px] w-full md:w-auto">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.stock || isMoving === item.id}
                            className={cn(
                              "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all",
                              item.stock
                                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                          >
                            {isMoving === item.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {texts.adding}
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                {texts.addToCart}
                              </>
                            )}
                          </button>
                          
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-center text-sm text-gray-500 hover:text-red-500 transition-colors"
                          >
                            {texts.viewDetails} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation Section - Enhanced */}
            <div className="mt-8 p-6 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 rounded-2xl shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg mb-1">{texts.dontMissOut}</h4>
                  <p className="text-white/90 text-sm">
                    {texts.dontMissDesc}
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="flex items-center gap-2 bg-white text-red-500 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  {texts.browseMore}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PageSet;