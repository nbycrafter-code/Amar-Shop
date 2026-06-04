'use client'

import { BarChart2, BarChart3, Eye, Heart } from "lucide-react";
import { taka } from "@/utils/currency";
import { Stars } from "./Stars";
import Link from "next/link";
import { useState } from "react";
import { CountdownTimer } from "./CountdownTimer";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: string;
  slug: string;
  name: string;
  nameBn?: string;
  image: string;
  hoverImage?: string;
  multiImages?: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  discountType?: string;
  rating: number;
  badge?: string;
  countdown?: any;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguage();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist,
    addToCompare, removeFromCompare, isInCompare,
    setActiveProduct, setIsQuickViewOpen } = useApp();

  const isWishlisted = isInWishlist(product?.id);
  const isCompared = isInCompare(product?.id);

  const getProductName = (): string => {
    if (language === 'bn') {
      return product.nameBn || product.name;
    }
    return product.name;
  };

  const getBadgeText = (badgeType: string): string => {
    if (language === 'bn') {
      if (badgeType === 'new') return 'নতুন';
      if (badgeType === 'sale') return 'ছাড়';
      return badgeType;
    }
    if (badgeType === 'new') return 'NEW';
    if (badgeType === 'sale') return 'SALE';
    return badgeType;
  };

  const getBuyNowText = (): string => {
    return language === 'bn' ? 'এখনই কিনুন' : 'Buy Now';
  };

  const getCurrencyText = (): string => {
    return language === 'bn' ? 'টাকা' : '৳';
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    product.images = [product.image, ...(product.multiImages || [])];
    setActiveProduct(product);
    setIsQuickViewOpen(true);
  };

  const hasDiscount = product.discount > 0 || (product.oldPrice && product.oldPrice > product.price);
  const isNew = product.badge === 'new';
  const isSale = product.badge === 'sale';
  const discountFlat = product.discountType == 'flat';

  return (
    <div
      className="relative h-[372px] overflow-visible z-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group absolute inset-x-0 top-0 z-10 h-[372px] rounded border border-gray-200 bg-white transition-all duration-300 hover:z-30 hover:h-[415px] hover:shadow-lg">

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount || Math.round((1 - product.price / product.oldPrice!) * 100)}{discountFlat ? getCurrencyText() : '%'}
            </span>
          )}
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              {getBadgeText('new')}
            </span>
          )}
          {isSale && !hasDiscount && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              {getBadgeText('sale')}
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'} z-20`}>
          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'}`}
            aria-label={language === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleCompareToggle}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${isCompared ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'}`}
            aria-label={language === 'bn' ? 'তুলনা করুন' : 'Compare'}
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleQuickView}
            className="w-9 h-9 rounded-full bg-white text-gray-600 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-md transition-colors"
            aria-label={language === 'bn' ? 'দ্রুত দেখুন' : 'Quick View'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Images */}
        <div className="relative mx-3 mt-3 h-[215px] overflow-hidden bg-[#fafafa]">
          <Link href={`/product/${product.slug}`} className="absolute inset-0 h-full w-full">
            <img
              src={product.image}
              alt={getProductName()}
              className="absolute inset-0 h-full w-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:opacity-0"
              loading="lazy"
            />
            <img
              src={product.hoverImage || product.image}
              alt={`${getProductName()} alt`}
              className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              loading="lazy"
            />
          </Link>

          {product.countdown && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <CountdownTimer {...product.countdown} />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-3 pb-3 pt-3 text-center">
          <Link href={`/product/${product.slug}`} className="mx-auto min-h-[48px] max-w-[182px] text-[13px] hover:text-[#ef553f] transition-all duration-300 leading-5 text-slate-700">
            {getProductName()}
          </Link>
          <div className="mt-1">
            <Stars rating={product.rating} />
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {product.oldPrice &&
              Number(product.oldPrice) !== Number(product.price) && (
                <span className="text-[14px] text-gray-400 line-through">
                  {taka(product.oldPrice)}
                </span>
              )}
            <p className="text-[22px] font-semibold leading-none text-[#ef553f]">
              {taka(product.price)}
            </p>
          </div>

          <div className="mt-0 max-h-0 overflow-hidden transition-all duration-300 group-hover:mt-4 group-hover:max-h-16">
            <Link
              href={`/product/${product.slug}`}
              className="rounded bg-[#ef553f] hover:bg-[#d4382c] transition-all duration-300 px-7 py-2 text-sm font-semibold text-white inline-block"
            >
              {getBuyNowText()}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};