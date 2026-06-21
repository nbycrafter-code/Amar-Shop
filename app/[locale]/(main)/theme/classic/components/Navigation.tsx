// app/theme/classic/components/Navigation.tsx
'use client'

import Icon from "@/components/Icon";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string;
  image?: string;
  subCategories?: any[];
}

interface NavigationProps {
  theme?: any;
  settings?: any;
  categories?: Category[];
  session?: any;
}

export function Navigation({
  theme,
  settings,
  categories = [],
  session
}: NavigationProps) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Theme colors
  const primaryColor = settings?.primaryColor || theme?.settings?.primaryColor || "#10B981";
  const textColor = settings?.textColor || "#1F2937";
  const backgroundColor = settings?.headerBackground || settings?.backgroundColor || "#FFFFFF";
  const borderColor = settings?.borderColor || "#E5E7EB";

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCategoryName = (category: Category) => {
    return language === 'bn' ? category.nameBn : category.name;
  };


  // Check if category is special (offer/sale)
  const isSpecialCategory = (slug: string): boolean => {
    const specialSlugs = ['offer', 'sale', 'special', 'discount', 'deal'];
    return specialSlugs.includes(slug.toLowerCase());
  };

  // Get category color based on index
  const getCategoryColor = (index: number, slug: string) => {
    if (isSpecialCategory(slug)) {
      return "text-orange-600 hover:text-orange-700";
    }
    if (index === 0) {
      return "border-emerald-500 text-emerald-700";
    }
    return "border-transparent text-gray-600 hover:text-emerald-600 hover:border-emerald-300";
  };

  // Log categories for debugging
  // console.log("Navigation - Categories from database:", categories);
  // console.log("Navigation - Categories count:", categories.length);

  // Show loading state while mounted
  if (!mounted) {
    return (
      <nav className="border-b" style={{ backgroundColor, borderBottomColor: borderColor }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-3">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  // Use real categories from database
  const displayCategories = categories;

  // If no categories, show default categories
  if (displayCategories.length === 0) {
    return (
      <nav className="border-b" style={{ backgroundColor, borderBottomColor: borderColor }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <Link
              href={`/${language === 'bn' ? 'bn' : 'en'}/categories`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-3 text-white text-sm font-semibold rounded-none transition-colors hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              ☰ {language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}
            </Link>
            <p className="text-sm text-gray-500 px-4 py-3">
              {language === 'bn' ? 'কোন ক্যাটাগরি পাওয়া যায়নি' : 'No categories found'}
            </p>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="border-b"
      style={{
        backgroundColor: backgroundColor,
        borderBottomColor: borderColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <Link
            href={`/${language === 'bn' ? 'bn' : 'en'}/categories`}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-3 text-white text-sm font-semibold rounded-none transition-colors hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            ☰ {language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}
          </Link>

          {displayCategories.slice(0, 10).map((category, index) => {
            const isSpecial = isSpecialCategory(category.slug);
            const name = getCategoryName(category);
            const colorClass = getCategoryColor(index, category.slug);

            return (
              <Link
                key={category._id}
                href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(category.slug)}`}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${colorClass}`}
                style={{
                  borderBottomColor: index === 0 ? primaryColor : 'transparent'
                }}
              >
                <span>{category.image && category.image.startsWith("/") ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-4 h-4 object-contain"
                    style={{ backgroundColor: category.imageBgColor || "transparent" }}
                  />
                ) : (
                  <Icon
                    name={category.icon || "ShoppingBag"}
                    size={18}
                    color={category.iconColor || "#3B82F6"}
                  />
                )}</span>
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}