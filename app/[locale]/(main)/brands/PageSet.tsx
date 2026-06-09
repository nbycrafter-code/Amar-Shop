// app/brands/PageSet.tsx
"use client";

import { Breadcrumb } from "../components/Breadcrumb";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useLanguage } from "@/context/LanguageContext";

// ========== TYPES ==========

interface Brand {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  slug?: string;
  country?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  imageBgColor?: string;
  image?: string;
  bannerImage?: string;
  description?: string;
  itemCount?: number;
}

interface PageSetProps {
  brands: Brand[];
}

// ========== MAIN COMPONENT ==========
export const PageSet = ({ brands = [] }: PageSetProps) => {
  const { language } = useLanguage();

  // Helper function to get brand name based on language
  const getBrandName = (brand: Brand): string => {
    if (language === 'bn') {
      return brand.nameBn || brand.name;
    }
    return brand.name;
  };

  // Get page title based on language
  const getPageTitle = (): string => {
    return language === 'bn' ? 'ব্র্যান্ডসমূহ' : 'Brands';
  };

  // Get empty state message based on language
  const getEmptyMessage = (): string => {
    return language === 'bn' 
      ? 'কোন ব্র্যান্ড পাওয়া যায়নি।' 
      : 'No brands found.';
  };

  // Get page description based on language
  const getPageDescription = (): string => {
    return language === 'bn' 
      ? 'আমাদের বিশ্বস্ত ব্র্যান্ডসমূহের সাথে পরিচিত হোন' 
      : 'Discover our trusted brands';
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb page={getPageTitle()} className="py-2" />

        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-gray-500">
            {getPageDescription()}
          </p>
        </div>

        {brands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 gap-y-8 md:gap-y-10 mt-4 md:mt-6">
            {brands.map((brand) => (
              <div
                key={brand.id || brand._id}
                className="flex flex-col items-center group cursor-pointer"
              >
                <Link
                  href={`/brands/${brand.slug}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 overflow-hidden mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                  style={{ 
                    backgroundColor: brand.iconBgColor || brand.imageBgColor || "#EFF6FF" 
                  }}
                >
                  {brand.image && brand.image.startsWith("/uploads/") ? (
                    <img
                      src={brand.image}
                      alt={getBrandName(brand)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <Icon
                      name={brand.icon || "Building2"}
                      size={40}
                      color={brand.iconColor || "#3B82F6"}
                    />
                  )}
                </Link>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="text-xs sm:text-sm text-gray-700 font-medium hover:text-[#ef553f] transition-all duration-300 text-center px-1 sm:px-2 line-clamp-2"
                >
                  {getBrandName(brand)}
                </Link>
                {brand.country && (
                  <span className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    {brand.country}
                  </span>
                )}
                {brand.itemCount !== undefined && brand.itemCount > 0 && (
                  <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    {brand.itemCount} {language === 'bn' ? 'টি পণ্য' : 'products'}
                  </span>
                )}
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
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