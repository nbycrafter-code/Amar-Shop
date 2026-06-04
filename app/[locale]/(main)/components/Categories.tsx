'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import Icon from "@/components/Icon";

interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  image?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  imageBgColor?: string;
}

interface CategoriesProps {
  categories: Category[];
}

export const Categories = ({ categories }: CategoriesProps) => {
  const { language } = useLanguage();

  const getCategoryName = (category: Category): string => {
    if (language === 'bn') {
      return category.nameBn || category.name;
    }
    return category.name;
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          <button 
            className="swiper-btn-prev2 absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center hover:bg-[#333333] transition-colors duration-300 z-10 shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={6}
            spaceBetween={16}
            loop={categories.length > 6}
            speed={1500}
            grabCursor={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".swiper-btn-next2",
              prevEl: ".swiper-btn-prev2",
            }}
            breakpoints={{
              0: { 
                slidesPerView: 3,
                spaceBetween: 12
              },
              640: { 
                slidesPerView: 4,
                spaceBetween: 12
              },
              768: { 
                slidesPerView: 4,
                spaceBetween: 16
              },
              992: { 
                slidesPerView: 6,
                spaceBetween: 16
              },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <div className="flex flex-col items-center group cursor-pointer">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden mb-3 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105"
                    style={{ 
                      backgroundColor: cat.iconBgColor || cat.imageBgColor || "#EFF6FF" 
                    }}
                  >
                    {cat.image && cat.image.startsWith("/") ? (
                      <img
                        src={cat.image}
                        alt={getCategoryName(cat)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <Icon
                        name={cat.icon || "default"}
                        size={40}
                        color={cat.iconColor || "#3B82F6"}
                      />
                    )}
                  </Link>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-gray-500 font-semibold hover:text-[#ef553f] transition-all duration-300 text-center px-2"
                  >
                    {getCategoryName(cat)}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <button 
            className="swiper-btn-next2 absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center hover:bg-[#333333] transition-colors duration-300 z-10 shadow-md"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};