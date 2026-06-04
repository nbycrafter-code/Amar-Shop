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
}

export const WishlistModal = ({ 
  wishlist, 
  onClose, 
  onRemove, 
  onAddToCart 
}: WishlistModalProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
        <div className="bg-[#1c1c1c] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-sm font-bold tracking-[2px] uppercase">
            {texts.wishlist} ({wishlist.length})
          </h2>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white transition-colors"
            aria-label={texts.close}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-gray-200" />
              </div>
              <p className="text-gray-500 font-medium">{texts.emptyWishlist}</p>
              <button 
                onClick={onClose}
                className="mt-6 text-red-500 text-xs font-black border-b-2 border-red-500 uppercase tracking-widest pb-1 hover:text-red-600 transition-colors"
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
                    index !== wishlist.length - 1 && "border-b border-dashed border-gray-200"
                  )}
                >
                  <button 
                    onClick={() => onRemove(item.id)} 
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    aria-label={texts.remove}
                  >
                    <X size={18} />
                  </button>

                  <div className="w-24 h-24 flex-shrink-0 bg-white border border-gray-50 rounded p-2">
                    <img 
                      src={item.image} 
                      alt={getProductName(item)} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-[#ef5350] text-sm font-bold leading-tight mb-2 hover:underline cursor-pointer">
                      {getProductName(item)}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      {item.originalPrice && (
                        <span className="text-gray-400 text-sm line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                      <span className="text-[#ef5350] font-black text-base">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] font-medium flex items-center justify-center sm:justify-start gap-1">
                      <Clock size={10} /> {getDateAdded(item.dateAdded)}
                    </p>
                  </div>

                  <div className="text-center sm:text-right min-w-[140px]">
                    {item.stockCount && (
                      <p className="text-gray-400 text-[11px] mb-3 font-medium uppercase tracking-wider">
                        {item.stockCount} {texts.inStock}
                      </p>
                    )}
                    <button 
                      onClick={() => onAddToCart?.(item)}
                      className="w-full sm:w-auto px-8 py-3 bg-[#ef5350] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#d32f2f] transition-all shadow-lg shadow-red-100 active:scale-95"
                    >
                      {item.stockCount ? texts.selectOptions : texts.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-6 flex justify-between items-center text-[10px] font-black tracking-[2px] flex-wrap gap-3">
          <Link 
            href="/my-account/wishlist" 
            onClick={onClose}
            className="text-[#ef5350] border-b-2 border-transparent hover:border-[#ef5350] transition-all uppercase"
          >
            {texts.openWishlistPage}
          </Link>
          <button 
            onClick={onClose}
            className="text-[#ef5350] border-b-2 border-transparent hover:border-[#ef5350] transition-all uppercase"
          >
            {texts.continueShopping}
          </button>
        </div>
      </div>
    </div>
  );
};