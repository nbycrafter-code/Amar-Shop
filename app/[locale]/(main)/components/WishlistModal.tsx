'use client'

import { Clock, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface WishlistItem {
  id: string;
  name: string;
  nameBn?: string;
  image: string;
  price: number;
  originalPrice?: number;
  stockCount?: number;
  dateAdded?: string;
}

interface WishlistModalProps {
  wishlist: WishlistItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onAddToCart?: (item: WishlistItem) => void;
  settings?: any; // settings prop যোগ করা হলো
}

export const WishlistModal = ({ 
  wishlist, 
  onClose, 
  onRemove, 
  onAddToCart,
  settings = {}
}: WishlistModalProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef5350";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d32f2f";
  const headerBg = settings?.primaryColor || "#1c1c1c";
  const headerTextColor = settings?.textColor || "#1F2937";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const priceColor = settings?.primaryColor || "#ef5350";
  const productLinkColor = settings?.primaryColor || "#ef5350";
  const shadowColor = settings?.primaryColor || "#ef5350";

  const getProductName = (product: WishlistItem): string => {
    return isBn ? (product.nameBn || product.name) : product.name;
  };

  const getDateAdded = (dateAdded?: string): string => {
    if (isBn) {
      return dateAdded || "সম্প্রতি যুক্ত হয়েছে";
    }
    return dateAdded || 'Recently added';
  };

  const texts = {
    wishlist: isBn ? "উইশলিস্ট" : "Wishlist",
    emptyWishlist: isBn ? "আপনার উইশলিস্ট খালি" : "Your wishlist is currently empty.",
    goShopNow: isBn ? "শপিং করুন" : "Go Shop Now",
    inStock: isBn ? "স্টকে আছে" : "in stock",
    selectOptions: isBn ? "বিকল্প নির্বাচন করুন" : "Select Options",
    addToCart: isBn ? "কার্টে যোগ করুন" : "Add To Cart",
    openWishlistPage: isBn ? "উইশলিস্ট পেজ খুলুন" : "OPEN WISHLIST PAGE",
    continueShopping: isBn ? "শপিং চালিয়ে যান" : "CONTINUE SHOPPING",
    close: isBn ? "বন্ধ" : "Close",
    remove: isBn ? "সরান" : "Remove"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
      />
      
      <div className="bg-white w-full max-w-2xl rounded-sm overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 flex justify-between items-center" style={{ backgroundColor: headerBg }}>
          <h2 className="text-sm font-bold tracking-[2px] uppercase" style={{ color: headerTextColor }}>
            {texts.wishlist} ({wishlist.length})
          </h2>
          <button 
            onClick={onClose} 
            className="transition-colors"
            style={{ backgroundColor: `${headerBg}`,color: `${headerTextColor}` }}
            onMouseEnter={(e) => e.currentTarget.style.color = headerTextColor}
            onMouseLeave={(e) => e.currentTarget.style.color = `${headerTextColor}b3`}
            aria-label={texts.close}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${borderColor}30` }}>
                <Heart size={40} style={{ color: borderColor }} />
              </div>
              <p className="font-medium" style={{ color: textMuted }}>{texts.emptyWishlist}</p>
              <button 
                onClick={onClose}
                className="mt-6 text-xs font-black border-b-2 uppercase tracking-widest pb-1 transition-colors"
                style={{ color: primaryColor, borderBottomColor: primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
              >
                {texts.goShopNow}
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {wishlist.map((item, index) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex flex-col sm:flex-row items-center gap-6 py-6 group",
                    index !== wishlist.length - 1 && "border-b border-dashed"
                  )}
                  style={index !== wishlist.length - 1 ? { borderBottomColor: borderColor } : {}}
                >
                  <button 
                    onClick={() => onRemove(item.id)} 
                    className="transition-colors"
                    style={{ color: textMuted }}
                    onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
                    aria-label={texts.remove}
                  >
                    <X size={18} />
                  </button>

                  <div className="w-24 h-24 flex-shrink-0 bg-white border rounded p-2" style={{ borderColor: borderColor }}>
                    <img 
                      src={item.image} 
                      alt={getProductName(item)} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-sm font-bold leading-tight mb-2 hover:underline cursor-pointer transition-colors" 
                        style={{ color: productLinkColor }}
                        onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = productLinkColor}>
                      {getProductName(item)}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      {item.originalPrice && (
                        <span className="text-sm line-through" style={{ color: textMuted }}>
                          ${item.originalPrice}
                        </span>
                      )}
                      <span className="font-black text-base" style={{ color: priceColor }}>
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium flex items-center justify-center sm:justify-start gap-1" style={{ color: textMuted }}>
                      <Clock size={10} /> {getDateAdded(item.dateAdded)}
                    </p>
                  </div>

                  <div className="text-center sm:text-right min-w-[140px]">
                    {item.stockCount && (
                      <p className="text-[11px] mb-3 font-medium uppercase tracking-wider" style={{ color: textMuted }}>
                        {item.stockCount} {texts.inStock}
                      </p>
                    )}
                    <button 
                      onClick={() => onAddToCart?.(item)}
                      className="w-full sm:w-auto px-8 py-3 text-white rounded-sm text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                      style={{ 
                        backgroundColor: primaryColor,
                        boxShadow: `0 4px 14px 0 ${shadowColor}40`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = buttonHoverColor;
                        e.currentTarget.style.boxShadow = `0 6px 20px 0 ${shadowColor}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = primaryColor;
                        e.currentTarget.style.boxShadow = `0 4px 14px 0 ${shadowColor}40`;
                      }}
                    >
                      {item.stockCount ? texts.selectOptions : texts.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-6 flex justify-between items-center text-[10px] font-black tracking-[2px] flex-wrap gap-3" style={{ borderTopColor: borderColor }}>
          <Link 
            href="/my-account/wishlist" 
            onClick={onClose}
            className="border-b-2 transition-all uppercase"
            style={{ color: primaryColor, borderBottomColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
          >
            {texts.openWishlistPage}
          </Link>
          <button 
            onClick={onClose}
            className="border-b-2 transition-all uppercase"
            style={{ color: primaryColor, borderBottomColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
          >
            {texts.continueShopping}
          </button>
        </div>
      </div>
    </div>
  );
};