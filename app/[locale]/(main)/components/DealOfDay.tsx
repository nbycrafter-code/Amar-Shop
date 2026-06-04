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
}

export const DealOfDay = ({ products }: DealOfDayProps) => {
  const { language } = useLanguage();

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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto w-full px-4">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {language === 'bn' ? 'সীমিত সংস্করণ' : 'Limited Edition'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              className="swiper-btn-prev3 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center hover:bg-[#d94535] transition-colors duration-300 shadow-md"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="swiper-btn-next3 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center hover:bg-[#d94535] transition-colors duration-300 shadow-md"
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
              <div className="bg-white rounded-lg p-4 flex gap-4 items-center hover:shadow-lg transition-all duration-300 h-full">
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
                    className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-[#ef553f] transition-all duration-300 block"
                  >
                    {getProductName(product)}
                  </Link>
                  
                  {product.category && (
                    <p className="text-xs text-gray-400 mt-1">
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
                      <span className="text-xs text-gray-400 ml-1">
                        ({product.reviews})
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[#ef553f] font-bold text-sm md:text-base">
                      ${product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        ${product.originalPrice}
                      </p>
                    )}
                    {product.discount && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
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