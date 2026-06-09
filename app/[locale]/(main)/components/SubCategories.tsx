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
  categorySlug?: string;
  title?: string;
  titleBn?: string;
  settings?: any; // settings prop যোগ করা হলো
}

export const SubSubcategories = ({ subcategories, categorySlug, title, titleBn, settings = {} }: SubcategoriesProps) => {
  const { language } = useLanguage();
  const uid = useId().replace(/:/g, "");
  const prevClass = `prev-${uid}`;
  const nextClass = `next-${uid}`;

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#333333";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const iconBgDefault = settings?.gray100 || "#EFF6FF";
  const iconColorDefault = settings?.primaryColor || "#3B82F6";
  const headingColor = settings?.headingColor || "#1F2937";
  const linkHoverColor = settings?.primaryColor || "#ef553f";

  const getCategoryName = (category: Category): string => {
    if (language === 'bn') return category.nameBn || category.name;
    return category.name;
  };

  if (!subcategories || subcategories.length === 0) return null;

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-8 sm:px-10 md:px-12">
        {(title || titleBn) && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: headingColor }}>
              {language === 'bn' ? (titleBn || title) : title}
            </h2>
            <div className="w-20 h-1 mx-auto mt-2 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        )}

        <div className="relative">
          <button
            className={`${prevClass} absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-white flex items-center justify-center z-10 shadow-md transition-all duration-300 hover:scale-110`}
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
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
                    href={`/categories/${categorySlug}/${cat.slug}`}
                    className="w-24 h-24 md:w-28 md:h-28 rounded overflow-hidden mb-3 mt-2 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                    style={{
                      backgroundColor: cat.iconBgColor || cat.imageBgColor || iconBgDefault,
                      boxShadow: `0 0 0 2px ${borderColor}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${borderColor}`;
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
                        name={cat.icon || "ShoppingBag"}
                        size={40}
                        color={cat.iconColor || iconColorDefault}
                      />
                    )}
                  </Link>
                  <Link
                    href={`/categories/${categorySlug}/${cat.slug}`}
                    className="text-xs md:text-sm font-medium text-center px-2 line-clamp-2 transition-colors duration-300"
                    style={{ color: textMuted }}
                    onMouseEnter={(e) => e.currentTarget.style.color = linkHoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
                  >
                    {getCategoryName(cat)}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className={`${nextClass} absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-white flex items-center justify-center z-10 shadow-md transition-all duration-300 hover:scale-110`}
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/categories"
            className="text-sm font-medium inline-flex items-center gap-1 transition-colors duration-300"
            style={{ color: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.color = buttonHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
          >
            {language === 'bn' ? 'সব ক্যাটাগরি দেখুন' : 'View All Sub-Categories'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};