"use client";
import { Heart, X, ShoppingCart, Trash2, Sparkles, Clock, ChevronRight, Star, TrendingUp, ShieldCheck, Truck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

interface PageSetProps {
  settings?: any; // settings prop যোগ করা হলো
}

export const PageSet = ({ settings = {} }: PageSetProps) => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const { wishlist, removeFromWishlist, addToCart } = useApp();
  const [isMoving, setIsMoving] = useState<string | null>(null);

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d4382c";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const successColor = settings?.successColor || "#10B981";
  const warningColor = settings?.warningColor || "#F59E0B";
  const errorColor = settings?.errorColor || "#EF4444";
  const infoColor = settings?.infoColor || "#3B82F6";
  const purpleColor = settings?.secondaryColor || "#8B5CF6";
  const orangeColor = settings?.accentColor || "#F97316";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";

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
    <div className="flex-1 min-h-screen" style={{ background: `linear-gradient(135deg, ${hoverBg}, #FFFFFF, ${hoverBg})` }}>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section with Gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl blur-3xl" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${orangeColor}10)` }}></div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${primaryColor}20` }}>
                  <Heart className="w-6 h-6" style={{ color: primaryColor, fill: primaryColor }} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ background: `linear-gradient(135deg, ${textColor}, ${textMuted})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  {texts.myWishlist}
                </h1>
              </div>
              <p className="text-sm ml-12" style={{ color: textMuted }}>
                {texts.itemsSaved(wishlist.length)}
              </p>
            </div>
            
            {wishlist.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor})` }}
                onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(135deg, ${buttonHoverColor}, ${buttonHoverColor})`}
                onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${primaryColor})`}
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
          <div className="bg-white rounded-2xl shadow-xl border py-16 md:py-20 text-center animate-in fade-in zoom-in duration-500" style={{ borderColor: borderColor }}>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: `${primaryColor}20` }}></div>
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${hoverBg})` }}>
                <Heart size={56} style={{ color: primaryColor }} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: textColor }}>{texts.emptyWishlist}</h2>
            <p className="mb-8 max-w-md mx-auto px-4" style={{ color: textMuted }}>
              {texts.emptyDesc}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor})` }}
              onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(135deg, ${buttonHoverColor}, ${buttonHoverColor})`}
              onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${primaryColor})`}
            >
              {texts.startShopping}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Cards with Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all group" style={{ borderColor: borderColor }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: textMuted }}>{texts.totalItems}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${infoColor}20` }}>
                    <Heart className="w-4 h-4" style={{ color: infoColor }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{wishlist.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all group" style={{ borderColor: borderColor }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: textMuted }}>{texts.totalValue}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${successColor}20` }}>
                    <TrendingUp className="w-4 h-4" style={{ color: successColor }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: primaryColor }}>${totalValue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all group" style={{ borderColor: borderColor }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: textMuted }}>{texts.savedItems}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${purpleColor}20` }}>
                    <Sparkles className="w-4 h-4" style={{ color: purpleColor }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: successColor }}>{wishlist.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all group" style={{ borderColor: borderColor }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ color: textMuted }}>{texts.readyToBuy}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${orangeColor}20` }}>
                    <ShoppingCart className="w-4 h-4" style={{ color: orangeColor }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: infoColor }}>{readyToBuyCount}</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border" style={{ borderColor: borderColor }}>
                <ShieldCheck className="w-4 h-4" style={{ color: successColor }} />
                <span className="text-xs" style={{ color: textMuted }}>{texts.genuineProduct}</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border" style={{ borderColor: borderColor }}>
                <Truck className="w-4 h-4" style={{ color: infoColor }} />
                <span className="text-xs" style={{ color: textMuted }}>{texts.freeShipping}</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border" style={{ borderColor: borderColor }}>
                <TrendingUp className="w-4 h-4" style={{ color: orangeColor }} />
                <span className="text-xs" style={{ color: textMuted }}>{texts.bestPrice}</span>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="bg-white rounded-2xl shadow-xl border overflow-hidden" style={{ borderColor: borderColor }}>
              <div className="divide-y" style={{ divideColor: borderColor }}>
                {wishlist.map((item, index) => {
                  const productName = getProductName(item);
                  const discount = item.originalPrice && item.originalPrice > item.price 
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0;
                  
                  return (
                    <div
                      key={item.id}
                      className="group relative transition-all duration-300"
                      onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(90deg, ${primaryColor}05, transparent)`}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-6">
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id, productName)}
                          className="absolute md:relative top-4 right-4 md:top-auto md:right-auto p-1.5 rounded-full transition-all"
                          style={{ color: textMuted }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = errorColor;
                            e.currentTarget.style.backgroundColor = `${errorColor}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = textMuted;
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          aria-label={texts.viewDetails}
                        >
                          <Trash2 size={16} />
                        </button>

                        {/* Product Image */}
                        <Link href={`/product/${item.id}`} className="flex-shrink-0">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden hover:shadow-lg transition-all group-hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${hoverBg}, ${borderColor}30)` }}>
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
                            <h3 className="text-base md:text-lg font-semibold transition-colors line-clamp-2" style={{ color: textColor }}
                              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                              onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                            >
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
                              <span className="text-xs ml-1" style={{ color: textMuted }}>
                                ({item.reviewCount || 0})
                              </span>
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xl md:text-2xl font-bold" style={{ color: primaryColor }}>
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <>
                                <span className="text-sm line-through" style={{ color: textMuted }}>
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}20`, color: successColor }}>
                                  -{discount}%
                                </span>
                              </>
                            )}
                          </div>

                          {/* Stock Status & Date */}
                          <div className="flex items-center gap-3 mt-2">
                            {item.stock ? (
                              <span className="text-xs flex items-center gap-1" style={{ color: successColor }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: successColor }}></span>
                                {texts.inStock}
                              </span>
                            ) : (
                              <span className="text-xs flex items-center gap-1" style={{ color: errorColor }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: errorColor }}></span>
                                {texts.outOfStock}
                              </span>
                            )}
                            
                            <span className="text-xs flex items-center gap-1" style={{ color: textMuted }}>
                              <Clock className="w-3 h-3" />
                              {formatDate(item.dateAdded)}
                            </span>
                          </div>

                          {/* Category/Brand */}
                          {getCategoryName(item) && (
                            <p className="text-xs mt-1" style={{ color: textMuted }}>
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
                                ? "text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                : "cursor-not-allowed"
                            )}
                            style={item.stock ? { background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor})` } : { backgroundColor: borderColor, color: textMuted }}
                            onMouseEnter={(e) => {
                              if (item.stock) e.currentTarget.style.background = `linear-gradient(135deg, ${buttonHoverColor}, ${buttonHoverColor})`;
                            }}
                            onMouseLeave={(e) => {
                              if (item.stock) e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${primaryColor})`;
                            }}
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
                            className="text-center text-sm transition-colors"
                            style={{ color: textMuted }}
                            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
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
            <div className="mt-8 p-6 rounded-2xl shadow-lg overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${orangeColor})` }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
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
                  className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  style={{ backgroundColor: '#FFFFFF', color: primaryColor }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
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