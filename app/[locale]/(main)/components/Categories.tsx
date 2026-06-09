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
  settings?: any;
}

export const Categories = ({ categories, settings }: CategoriesProps) => {
  const { language } = useLanguage();

  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const sectionBg = settings?.gray50 || "#F9FAFB";
  const borderColor = settings?.borderColor || "#E5E7EB";

  const getCategoryName = (category: Category): string => {
    if (language === 'bn') {
      return category.nameBn || category.name;
    }
    return category.name;
  };

  return (
    <section className="py-8" style={{ backgroundColor: sectionBg }}>
      <div className="container mx-auto px-4">
        <div className="relative">
          <button 
            className="swiper-btn-prev2 absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300 z-10 shadow-md"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.buttonPrimaryHover || '#333333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
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
              0: { slidesPerView: 3, spaceBetween: 12 },
              640: { slidesPerView: 4, spaceBetween: 12 },
              768: { slidesPerView: 4, spaceBetween: 16 },
              992: { slidesPerView: 6, spaceBetween: 16 },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <div className="flex flex-col items-center group cursor-pointer">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="w-28 h-28 rounded-full mb-3 mt-2 transition-all duration-300 flex items-center justify-center hover:scale-105 relative"
                    style={{ 
                      backgroundColor: cat.iconBgColor || cat.imageBgColor || hoverBg,
                      boxShadow: `0 0 0 2px ${borderColor}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${borderColor}`;
                    }}
                  >
                    {/* Image/Icon Container - overflow-hidden শুধু এখানে */}
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      {cat.image && cat.image.startsWith("/") ? (
                        <img
                          src={cat.image}
                          alt={getCategoryName(cat)}
                          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <Icon
                          name={cat.icon || "default"}
                          size={40}
                          color={cat.iconColor || primaryColor}
                        />
                      )}
                    </div>
                  </Link>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm font-semibold transition-all duration-300 text-center px-2"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                  >
                    {getCategoryName(cat)}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <button 
            className="swiper-btn-next2 absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300 z-10 shadow-md"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.buttonPrimaryHover || '#333333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};