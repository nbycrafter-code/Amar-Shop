'use client'

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { CountdownTimer } from "./CountdownTimer";
import { useLanguage } from "@/context/LanguageContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface Product {
  _id: string;
  name: string;
  nameBn?: string;
  category?: string;
  categoryBn?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews?: number;
  image: string;
  hoverImage?: string;
  discount?: number;
  isSale?: boolean;
  isNew?: boolean;
  countdown?: { days: number; hours: number; mins: number; secs: number };
}

interface DealOfDayProps {
  products: Product[];
  settings?: any; // settings prop যোগ করা হলো
}

export const DealOfDay = ({ products, settings }: DealOfDayProps) => {
  const { language } = useLanguage();

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d94535";
  const headingColor = settings?.headingColor || "#1F2937";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#F9FAFB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const discountBg = settings?.errorColor || "#FEE2E2";
  const discountText = settings?.errorColor || "#DC2626";

  const getProductName = (product: Product): string => {
    if (language === 'bn') {
      return product.nameBn || product.name;
    }
    return product.name;
  };

  const getCategoryName = (product: Product): string => {
    if (language === 'bn') {
      return product.categoryBn || product.category || '';
    }
    return product.category || '';
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12" style={{ backgroundColor: backgroundColor }}>
      <div className="container mx-auto w-full px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: headingColor }}>
              {language === 'bn' ? 'সীমিত সংস্করণ' : 'Limited Edition'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              className="swiper-btn-prev3 w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300 shadow-md"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="swiper-btn-next3 w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300 shadow-md"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          loop={products.length > 3}
          speed={1500}
          grabCursor={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".swiper-btn-next3",
            prevEl: ".swiper-btn-prev3",
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 1, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <div 
                className="rounded-lg p-4 flex gap-4 items-center hover:shadow-lg transition-all duration-300 h-full"
                style={{ 
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`
                }}
              >
                <Link href={`/product/${product.slug}`} className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={getProductName(product)}
                    className="w-24 h-24 object-contain hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-medium text-sm line-clamp-2 transition-all duration-300 block"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                  >
                    {getProductName(product)}
                  </Link>
                  
                  {product.category && (
                    <p className="text-xs mt-1" style={{ color: textMuted }}>
                      {getCategoryName(product)}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    {product.reviews && (
                      <span className="text-xs ml-1" style={{ color: textMuted }}>
                        ({product.reviews})
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm md:text-base" style={{ color: primaryColor }}>
                      ${product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs line-through" style={{ color: textMuted }}>
                        ${product.originalPrice}
                      </p>
                    )}
                    {product.discount && (
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded text-white"
                        style={{ 
                          backgroundColor: discountBg,
                        }}
                      >
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};