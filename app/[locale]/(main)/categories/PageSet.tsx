// app/products/PageSet.tsx
"use client";

import { ProductFilter } from "../components/ProductFilter";
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
}

// ========== MAIN COMPONENT ==========
export const PageSet = ({ categories = [] }: PageSetProps) => {
  const { language } = useLanguage();

  // Helper function to get category name based on language
  const getCategoryName = (category: Category): string => {
    if (language === 'bn') {
      return category.nameBn || category.name;
    }
    return category.name;
  };

  // Get page title based on language
  const getPageTitle = (): string => {
    return language === 'bn' ? 'ক্যাটাগরি' : 'Categories';
  };

  // Get empty state message based on language
  const getEmptyMessage = (): string => {
    return language === 'bn' 
      ? 'কোন ক্যাটাগরি পাওয়া যায়নি।' 
      : 'No categories found.';
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb page={getPageTitle()} className="py-2" />

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 gap-y-8 md:gap-y-10 mt-8 md:mt-12">
            {categories.map((cat) => (
              <div
                key={cat.id || cat._id}
                className="flex flex-col items-center group cursor-pointer"
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 overflow-hidden mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center group-hover:scale-105"
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
                  className="text-xs sm:text-sm text-gray-500 font-semibold hover:text-[#ef553f] transition-all duration-300 text-center px-1 sm:px-2 line-clamp-2"
                >
                  {getCategoryName(cat)}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4">
              <svg 
                className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
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
            <p className="text-gray-500 text-sm sm:text-base">
              {getEmptyMessage()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};