// app/products/PageSet.tsx
"use client";

import { Breadcrumb } from "../components/Breadcrumb";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useLanguage } from "@/context/LanguageContext";

// ========== TYPES ==========

interface Category {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  slug?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  imageBgColor?: string;
  image?: string;
}

interface PageSetProps {
  categories: Category[];
  settings?: any;
}

// ========== MAIN COMPONENT ==========
export const PageSet = ({ categories = [], settings = {} }: PageSetProps) => {
  const { language } = useLanguage();

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#F9FAFB";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const iconBgDefault = settings?.gray100 || "#EFF6FF";
  const iconColorDefault = settings?.primaryColor || "#3B82F6";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const sectionBg = settings?.gray50 || backgroundColor;

  // Helper function to get category name based on language
  const getCategoryName = (category: Category): string => {
    if (language === 'bn') {
      return category.nameBn || category.name;
    }
    return category.name;
  };

  // Get page title based on language
  const getPageTitle = (): string => {
    return language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories';
  };

  // Get empty state message based on language
  const getEmptyMessage = (): string => {
    return language === 'bn' 
      ? 'কোন ক্যাটাগরি পাওয়া যায়নি।' 
      : 'No categories found.';
  };

  return (
    <div className="py-8 min-h-screen" style={{ backgroundColor: sectionBg }}>
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb page={getPageTitle()} className="mb-6" settings={settings} />

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: textColor }}>
            {getPageTitle()}
          </h1>
          <p className="text-sm" style={{ color: textMuted }}>
            {language === 'bn' 
              ? `মোট ${categories.length}টি ক্যাটাগরি পাওয়া গেছে` 
              : `Total ${categories.length} categories found`}
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 gap-y-8 md:gap-y-10">
            {categories.map((cat) => (
              <div
                key={cat.id || cat._id}
                className="flex flex-col items-center group cursor-pointer"
              >
                <Link
                  href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${cat.slug}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-2 sm:mb-3 transition-all duration-300 flex items-center justify-center group-hover:scale-105"
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
                  {cat.image && cat.image.startsWith("/") ? (
                    <img
                      src={cat.image}
                      alt={getCategoryName(cat)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                  href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${cat.slug}`}
                  className="text-xs sm:text-sm font-medium transition-all duration-300 text-center px-1 sm:px-2 line-clamp-2"
                  style={{ color: textMuted }}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
                >
                  {getCategoryName(cat)}
                </Link>
                
                {/* Optional: Show subcategory count if available */}
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <span className="text-[10px] mt-1" style={{ color: textMuted }}>
                    {cat.subCategories.length} {language === 'bn' ? 'টি উপক্যাটাগরি' : 'subcategories'}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4"
              style={{ backgroundColor: hoverBg }}
            >
              <svg 
                className="w-8 h-8 sm:w-10 sm:h-10" 
                fill="none" 
                stroke={textMuted} 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </div>
            <p className="text-sm sm:text-base" style={{ color: textMuted }}>
              {getEmptyMessage()}
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-6 py-2 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.buttonPrimaryHover || '#d4382c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            >
              {language === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};