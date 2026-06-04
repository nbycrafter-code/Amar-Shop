'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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

interface SubcategoriesProps {
  subcategories: Category[];
  title?: string;
  titleBn?: string;
}

export const SubSubcategories = ({ subcategories, title, titleBn }: SubcategoriesProps) => {
  const { language } = useLanguage();
  const uid = useId().replace(/:/g, "");
  const prevClass = `prev-${uid}`;
  const nextClass = `next-${uid}`;

  const getCategoryName = (category: Category): string => {
    if (language === 'bn') return category.nameBn || category.name;
    return category.name;
  };

  if (!subcategories || subcategories.length === 0) return null;

  return (
    <section className="py-8">
      {/* ✅ px-8 → button এর জায়গা থাকবে, scrollbar আসবে না */}
      <div className="max-w-6xl mx-auto px-8 sm:px-10 md:px-12">
        {(title || titleBn) && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {language === 'bn' ? (titleBn || title) : title}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mt-2 rounded-full" />
          </div>
        )}

        <div className="relative">
          <button
            className={`${prevClass} absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center z-10 shadow-md transition-all duration-300 hover:bg-[#333333] hover:scale-110`}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            speed={1500}
            grabCursor={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: `.${prevClass}`,
              nextEl: `.${nextClass}`,
            }}
            breakpoints={{
              0:    { slidesPerView: 2, spaceBetween: 12 },
              480:  { slidesPerView: 3, spaceBetween: 12 },
              640:  { slidesPerView: 4, spaceBetween: 12 },
              768:  { slidesPerView: 5, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
            }}
          >
            {subcategories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <div className="flex flex-col items-center group cursor-pointer">
                  <Link
                    href={`/subcategories/${cat.slug}`}
                    className="w-24 h-24 md:w-28 md:h-28 rounded overflow-hidden mb-3 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                    style={{
                      backgroundColor: cat.iconBgColor || cat.imageBgColor || "#EFF6FF",
                    }}
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={getCategoryName(cat)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                    href={`/subcategories/${cat.slug}`}
                    className="text-xs md:text-sm text-gray-600 font-medium text-center px-2 line-clamp-2 transition-colors duration-300 hover:text-[#ef553f]"
                  >
                    {getCategoryName(cat)}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className={`${nextClass} absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center z-10 shadow-md transition-all duration-300 hover:bg-[#333333] hover:scale-110`}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/categories"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 transition-colors duration-300"
          >
            {language === 'bn' ? 'সব ক্যাটাগরি দেখুন' : 'View All Sub-Categories'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};