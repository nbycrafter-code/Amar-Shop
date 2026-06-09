// app/(main)/products/PageSet.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../components/ProductCard";
import { ProductFilter } from "../components/ProductFilter";
import { Breadcrumb } from "../components/Breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ========== TYPES ==========
interface Product {
  _id?: string;
  id?: number | string;
  name: string;
  nameBn?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  category: string;
  categoryName?: string;
  categoryNameBn?: string;
  brand: string;
  brandName?: string;
  brandNameBn?: string;
  color?: string;
  colors?: string[];
  colorNames?: string[];
  image: string;
  slug: string;
  rating?: number;
  badge?: string;
  highlight?: string;
  isNew?: boolean;
  created_at?: string;
}

interface Filters {
  categories: string[];
  brands: string[];
  highlight: string[];
  colors: string[];
  priceRange: { min: number; max: number };
  rating: number | null;
}

interface PageSetProps {
  categories?: any[];
  brands?: any[];
  sizes?: any[];
  colors?: any[];
  products: Product[];
  selectedCategory?: string;
  searchQuery?: string;
  settings?: any; // settings prop যোগ করা হলো
}

export const PageSet = ({
  categories = [],
  brands = [],
  sizes = [],
  colors = [],
  products,
  selectedCategory,
  searchQuery,
  settings = {}
}: PageSetProps) => {
  const { language } = useLanguage();

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d4382c";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#F9FAFB";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    brands: [],
    highlight: [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 4000 },
    rating: null,
  });

  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ========== ফিল্টারিং ==========
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 2. CATEGORY FILTER
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.categoryName && filters.categories.includes(p.categoryName)) return true;
        if (p.category && filters.categories.includes(p.category.name)) return true;
        return false;
      });
    }

    // 3. BRAND FILTER
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.brandName && filters.brands.includes(p.brandName)) return true;
        if (p.brand && filters.brands.includes(p.brand)) return true;
        return false;
      });
    }

    // 4. HIGHLIGHT FILTER
    if (filters.highlight && filters.highlight.length > 0) {
      filtered = filtered.filter((p) =>
        filters.highlight.includes(p.highlight || "")
      );
    }

    // 5. SIZES FILTER
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.color && filters.sizes.includes(p.color)) return true;
        if (p.sizes && p.sizes.length > 0 && p.sizes.some(s => filters.sizes.includes(s.name))) return true;
        if (p.sizeNames && p.sizeNames.length > 0 && p.sizeNames.some(c => filters.sizes.includes(c))) return true;
        return false;
      });
    }

    // 6. COLOR FILTER
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.color && filters.colors.includes(p.color)) return true;
        if (p.colors && p.colors.length > 0 && p.colors.some(c => filters.colors.includes(c.name || c.nameBn))) return true;
        if (p.colorNames && p.colorNames.length > 0 && p.colorNames.some(c => filters.colors.includes(c))) return true;
        return false;
      });
    }

    // 7. PRICE FILTER
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );

    // 8. RATING FILTER
    if (filters.rating) {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.rating!);
    }

    return filtered;
  }, [products, searchQuery, filters]);

  // ========== সোর্টিং ==========
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "discount":
        sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // ========== পেজিনেশন ==========
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ফিল্টার পরিবর্তনে পেজ রিসেট
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  // ফিল্টার পরিবর্তন হ্যান্ডলার
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // পেজ চেঞ্জ হ্যান্ডলার
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // পেজ টাইটেল (ল্যাঙ্গুয়েজ সাপোর্ট সহ)
  const getPageTitle = () => {
    if (searchQuery) {
      return language === 'bn' 
        ? `"${searchQuery}" এর জন্য অনুসন্ধান ফলাফল`
        : `Search Results for "${searchQuery}"`;
    }
    if (filters.categories.length === 1) return filters.categories[0];
    if (filters.categories.length > 1) {
      return language === 'bn' 
        ? `${filters.categories.length} টি ক্যাটাগরি`
        : `${filters.categories.length} Categories`;
    }
    return language === 'bn' ? 'সব পণ্য' : 'All Products';
  };

  // সোর্ট অপশন (ল্যাঙ্গুয়েজ সাপোর্ট সহ)
  const getSortOptions = () => {
    return [
      { value: "default", label: language === 'bn' ? 'ডিফল্ট (সর্বশেষ প্রথমে)' : 'Default (Newest First)' },
      { value: "price-low", label: language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High' },
      { value: "price-high", label: language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low' },
      { value: "rating", label: language === 'bn' ? 'সর্বোচ্চ রেটেড' : 'Top Rated' },
      { value: "newest", label: language === 'bn' ? 'সর্বশেষ প্রথমে' : 'Newest First' },
      { value: "discount", label: language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Biggest Discount' },
    ];
  };

  // ক্লিয়ার ফিল্টার
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      highlight: [],
      colors: [],
      priceRange: { min: 0, max: 4000 },
      rating: null,
    });
    setSortBy("default");
  };

  // ব্রেডক্রাম্ব পেজ নাম
  const getBreadcrumbPage = () => {
    return searchQuery ? (language === 'bn' ? 'অনুসন্ধান' : 'Search') : (language === 'bn' ? 'পণ্য' : 'Products');
  };

  return (
    <div className="py-8 min-h-screen" style={{ backgroundColor: backgroundColor }}>
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb
          page={getBreadcrumbPage()}
          className="py-2"
          settings={settings}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] mt-4">
          {/* Sidebar with Filters */}
          <div className="lg:sticky lg:top-4 h-fit">
            <ProductFilter
              categories={categories}
              brands={brands}
              sizes={sizes}
              colors={colors}
              onFilterChange={handleFilterChange}
              initialFilters={filters}
              type="all"
              settings={settings}
            />
          </div>

          {/* Main Content */}
          <div>
            {/* Toolbar */}
            <div className="rounded-lg p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4" style={{ backgroundColor: cardBg }}>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold" style={{ color: textColor }}>
                  {getPageTitle()}
                </h1>
                <p className="mt-1 text-sm" style={{ color: textMuted }}>
                  {language === 'bn' 
                    ? `${currentProducts.length} টি পণ্য দেখানো হচ্ছে (মোট ${sortedProducts.length} টি)`
                    : `Showing ${currentProducts.length} of ${sortedProducts.length} products`}
                  {searchQuery && ` "${searchQuery}"`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm" style={{ color: textMuted }}>
                  {language === 'bn' ? 'সাজান:' : 'Sort by:'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none text-sm bg-white cursor-pointer"
                  style={{ borderColor: borderColor }}
                  onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
                  onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
                >
                  {getSortOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard 
                      key={product._id || product.id} 
                      product={product} 
                      settings={settings}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all`}
                      style={{
                        backgroundColor: currentPage === 1 ? hoverBg : cardBg,
                        border: currentPage === 1 ? 'none' : `1px solid ${borderColor}`,
                        color: currentPage === 1 ? textMuted : textColor,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== 1) {
                          e.currentTarget.style.backgroundColor = primaryColor;
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = primaryColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== 1) {
                          e.currentTarget.style.backgroundColor = cardBg;
                          e.currentTarget.style.color = textColor;
                          e.currentTarget.style.borderColor = borderColor;
                        }
                      }}
                      aria-label={language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className="w-10 h-10 rounded-lg transition-all"
                          style={{
                            backgroundColor: currentPage === pageNum ? primaryColor : cardBg,
                            color: currentPage === pageNum ? '#FFFFFF' : textColor,
                            border: currentPage === pageNum ? 'none' : `1px solid ${borderColor}`,
                            boxShadow: currentPage === pageNum ? `0 2px 8px ${primaryColor}40` : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== pageNum) {
                              e.currentTarget.style.backgroundColor = primaryColor;
                              e.currentTarget.style.color = '#FFFFFF';
                              e.currentTarget.style.borderColor = primaryColor;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== pageNum) {
                              e.currentTarget.style.backgroundColor = cardBg;
                              e.currentTarget.style.color = textColor;
                              e.currentTarget.style.borderColor = borderColor;
                            }
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all`}
                      style={{
                        backgroundColor: currentPage === totalPages ? hoverBg : cardBg,
                        border: currentPage === totalPages ? 'none' : `1px solid ${borderColor}`,
                        color: currentPage === totalPages ? textMuted : textColor,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== totalPages) {
                          e.currentTarget.style.backgroundColor = primaryColor;
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = primaryColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== totalPages) {
                          e.currentTarget.style.backgroundColor = cardBg;
                          e.currentTarget.style.color = textColor;
                          e.currentTarget.style.borderColor = borderColor;
                        }
                      }}
                      aria-label={language === 'bn' ? 'পরবর্তী' : 'Next'}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="rounded-lg p-12 text-center" style={{ backgroundColor: cardBg }}>
                <div className="flex flex-col items-center">
                  <svg
                    className="w-24 h-24 mb-4"
                    fill="none"
                    stroke={textMuted}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>
                    {language === 'bn' ? 'কোন পণ্য পাওয়া যায়নি' : 'No Products Found'}
                  </h3>
                  <p className="mb-4" style={{ color: textMuted }}>
                    {searchQuery
                      ? (language === 'bn' 
                        ? `"${searchQuery}" এর জন্য কোন ফলাফল পাওয়া যায়নি`
                        : `No results found for "${searchQuery}"`)
                      : (language === 'bn' 
                        ? 'আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোন পণ্য নেই'
                        : 'No products match your selected filters')}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                  >
                    {language === 'bn' ? 'সব ফিল্টার সরান' : 'Clear All Filters'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};