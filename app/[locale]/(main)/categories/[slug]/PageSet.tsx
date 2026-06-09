"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "../../components/ProductCard";
import { ProductFilter } from "../../components/ProductFilter";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SubSubcategories } from "../../components/SubCategories";
import Image from "next/image";
import { CategoryContent } from "./components/CategoryContent";

interface PageSetProps {
  products: any[];
  categories?: any[];
  brands?: any[];
  sizes?: any[];
  colors?: any[];
  categoryData?: any;
  subcategories?: any[];
  settings?: any;
}

export const PageSet = ({
  categories = [],
  brands = [],
  sizes = [],
  colors = [],
  categoryData,
  products = [],
  subcategories = [],
  settings = {},
}: PageSetProps) => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const router = useRouter();
  const { category: categorySlug } = useParams();

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d4382c";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#F9FAFB";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";

  const currentCategory = useMemo(() => {
    if (categoryData) return categoryData;
    if (!categorySlug || !categories.length) return null;
    return categories.find(
      (cat) =>
        cat.slug?.toLowerCase() === String(categorySlug).toLowerCase()
    );
  }, [categorySlug, categories, categoryData]);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    stones: [] as string[],
    fragrances: [] as string[],
    priceRange: { min: 0, max: 10000 } as { min: number; max: number },
    rating: null as number | null,
  });

  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Translations
  const texts = {
    products: isBn ? "পণ্য" : "Products",
    subcategory: isBn ? "উপশ্রেণী" : "Subcategory",
    showing: isBn ? "দেখানো হচ্ছে" : "Showing",
    of: isBn ? "এর" : "of",
    in: isBn ? "ক্যাটাগরিতে" : "in",
    category: isBn ? "ক্যাটাগরি" : "category",
    sortBy: isBn ? "সাজান:" : "Sort by:",
    default: isBn ? "ডিফল্ট" : "Default",
    priceLowToHigh: isBn ? "দাম: কম থেকে বেশি" : "Price: Low to High",
    priceHighToLow: isBn ? "দাম: বেশি থেকে কম" : "Price: High to Low",
    topRated: isBn ? "সর্বোচ্চ রেটেড" : "Top Rated",
    newestFirst: isBn ? "সর্বশেষ প্রথমে" : "Newest First",
    noProductsFound: isBn ? "কোন পণ্য পাওয়া যায়নি" : "No Products Found",
    noProductsInCategory: (name: string) => isBn
      ? `${name} ক্যাটাগরিতে কোন পণ্য নেই`
      : `No products found in ${name} category`,
    noMatchFilters: isBn
      ? "আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোন পণ্য নেই"
      : "No products match your selected filters",
    clearAllFilters: isBn ? "সব ফিল্টার সরান" : "Clear All Filters",
  };

  // Sort options with translations
  const sortOptions = [
    { value: "default", label: texts.default },
    { value: "price-low", label: texts.priceLowToHigh },
    { value: "price-high", label: texts.priceHighToLow },
    { value: "rating", label: texts.topRated },
    { value: "newest", label: texts.newestFirst },
  ];

  // Normalize products data
  const normalizedProducts = useMemo(() => {
    return products.map(product => ({
      ...product,
      categoryId: product.categoryId || product.category?._id || product.category,
      brandId: product.brandId || product.brand?._id || product.brand,
      price: product.price || product.salePrice || 0,
      sizes: Array.isArray(product.sizes) 
        ? product.sizes.map(s => typeof s === 'object' ? s.name : s)
        : (product.sizes ? [product.sizes] : []),
    }));
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...normalizedProducts];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => {
        const productCatId = String(product.categoryId || '');
        const matchingCategory = categories.find(
          (cat) => String(cat._id) === productCatId || String(cat.id) === productCatId
        );
        
        if (matchingCategory) {
          return filters.categories.some(filterCat => 
            filterCat === matchingCategory.name || 
            filterCat === matchingCategory.nameBn
          );
        }
        return false;
      });
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) => {
        const productBrandId = String(product.brandId || '');
        const matchingBrand = brands.find(
          (b) => String(b._id) === productBrandId
        );
        
        if (matchingBrand) {
          return filters.brands.some(filterBrand =>
            filterBrand === matchingBrand.name ||
            filterBrand === matchingBrand.nameBn
          );
        }
        return false;
      });
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.sizes || product.sizes.length === 0) return false;
        
        return product.sizes.some((productSize: string) =>
          filters.sizes.some(filterSize =>
            productSize === filterSize
          )
        );
      });
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.colorIds || product.colorIds.length === 0) return false;
        
        const matchingColorIds = colors
          .filter((c) => 
            filters.colors.includes(c.name) ||
            filters.colors.includes(c.nameBn)
          )
          .map((c) => String(c._id));
        
        return product.colorIds.some((colorId: string) =>
          matchingColorIds.includes(String(colorId))
        );
      });
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = product.price || 0;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // Rating filter
    if (typeof filters.rating === "number") {
      filtered = filtered.filter((product) => 
        (product.rating || 0) >= filters.rating!
      );
    }
    
    return filtered;
  }, [normalizedProducts, filters, categories, brands, colors]);

  // Sort products
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
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
      default:
        break;
    }
    
    return sorted;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug, filters, sortBy]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCategoryName = (): string => {
    if (currentCategory) {
      return isBn
        ? (currentCategory.nameBn || currentCategory.name)
        : (currentCategory.name || currentCategory.nameBn);
    }
    if (categorySlug && categorySlug !== "null") {
      return String(categorySlug).charAt(0).toUpperCase() + String(categorySlug).slice(1);
    }
    return isBn ? "পণ্য" : "Products";
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      stones: [],
      fragrances: [],
      priceRange: { min: 0, max: 10000 },
      rating: null,
    });
    setSortBy("default");
  };

  const getEmptyMessage = (): string => {
    if (currentCategory) {
      return texts.noProductsInCategory(formatCategoryName());
    }
    return texts.noMatchFilters;
  };

  return (
    <div className="py-8 min-h-screen" style={{ backgroundColor: backgroundColor }}>
      <div className="container mx-auto px-4">
        <Breadcrumb page={formatCategoryName()} className="py-2" settings={settings} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] mt-4">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-4 h-fit">
            <ProductFilter
              categories={categories}
              brands={brands}
              sizes={sizes}
              colors={colors}
              onFilterChange={handleFilterChange}
              settings={settings}
            />
          </div>

          {/* Main Content */}
          <div>
            {/* Banner */}
            {categoryData?.bannerImage && (
              <div className="rounded-lg p-2 mb-6 shadow-sm" style={{ backgroundColor: cardBg }}>
                <div className="w-full overflow-hidden rounded-lg">
                  <Image
                    src={categoryData.bannerImage}
                    alt={language === 'bn' ? "ক্যাটাগরি ব্যানার" : "Category Banner"}
                    width={1200}
                    height={400}
                    className="w-full h-auto object-contain"
                    priority={false}
                    unoptimized={categoryData.bannerImage?.startsWith('/uploads/')}
                  />
                </div>
              </div>
            )}

            {/* Category wise SubCategory */}
            {subcategories && subcategories.length > 0 && (
              <div className="rounded-lg p-4 mb-6 shadow-sm flex flex-col gap-4" style={{ backgroundColor: cardBg }}>
                <div className="w-full">
                  <SubSubcategories 
                    subcategories={subcategories} 
                    categorySlug={categoryData?.slug} 
                    settings={settings} 
                  />
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className="rounded-lg p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4" style={{ backgroundColor: cardBg }}>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold" style={{ color: textColor }}>
                  {formatCategoryName()} {texts.products}
                </h1>
                <p className="mt-2 text-sm" style={{ color: textMuted }}>
                  {texts.showing} {currentProducts.length} {texts.of}{" "}
                  {sortedProducts.length} {texts.products}
                  {currentCategory && ` ${texts.in} ${formatCategoryName()} ${texts.category}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm" style={{ color: textMuted }}>{texts.sortBy}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none text-sm bg-white"
                  style={{ borderColor: borderColor }}
                  onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
                  onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
                >
                  {sortOptions.map((option) => (
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id || product._id}
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
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
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
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
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
                    {texts.noProductsFound}
                  </h3>
                  <p className="mb-4" style={{ color: textMuted }}>
                    {getEmptyMessage()}
                  </p>
                  {(filters.categories.length > 0 ||
                    filters.brands.length > 0 ||
                    filters.colors.length > 0 ||
                    filters.sizes.length > 0 ||
                    filters.priceRange.min > 0 ||
                    filters.priceRange.max < 10000 ||
                    filters.rating) && (
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-2 text-white rounded-lg transition-colors"
                        style={{ backgroundColor: primaryColor }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                      >
                        {texts.clearAllFilters}
                      </button>
                    )}
                </div>
              </div>
            )}

            {/* Category Content */}
            <div className="rounded-lg p-4 mb-6 shadow-sm mt-16" style={{ backgroundColor: cardBg }}>
              <CategoryContent category={categoryData} settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};