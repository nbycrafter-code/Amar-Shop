"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "../../../components/ProductCard";
import { ProductFilter } from "../../../components/ProductFilter";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PageSetProps {
  products: any[];
  categories?: any[];
  brands?: any[];
  sizes?: any[];
  colors?: any[];
  categoryData?: any;
}

export const PageSet = ({
  categories = [],
  brands = [],
  sizes = [],
  colors = [],
  categoryData,
  products = [],
}: PageSetProps) => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const router = useRouter();
  const { category: categorySlug } = useParams();

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
    priceRange: { min: 0, max: 7000 } as { min: number; max: number },
    rating: null as number | null,
  });

  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Translations
  const texts = {
    products: isBn ? "পণ্য" : "Products",
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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Sidebar category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) => {
        const matchingCategory = categories.find(
          (cat) =>
            filters.categories.includes(cat.name) ||
            filters.categories.includes(cat.nameBn)
        );
        return (
          matchingCategory &&
          String(p.categoryId) === String(matchingCategory._id)
        );
      });
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => {
        const matchingBrand = brands.find(
          (b) =>
            filters.brands.includes(b.name) ||
            filters.brands.includes(b.nameBn)
        );
        return (
          matchingBrand && String(p.brandId) === String(matchingBrand._id)
        );
      });
    }

    // Sizes filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.sizes.includes(p.sizes)
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.colorIds || p.colorIds.length === 0) return false;
        const matchingColorIds = colors
          .filter(
            (c) =>
              filters.colors.includes(c.name) ||
              filters.colors.includes(c.nameBn)
          )
          .map((c) => String(c._id));
        return p.colorIds.some((colorId: string) =>
          matchingColorIds.includes(String(colorId))
        );
      });
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = p.price || p.salePrice || 0;
      return (
        price >= filters.priceRange.min && price <= filters.priceRange.max
      );
    });

    // Rating filter
    if (typeof filters.rating === "number") {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.rating!);
    }

    return filtered;
  }, [products, filters, categories, brands, colors]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-low":
        sorted.sort(
          (a, b) =>
            (a.price || a.salePrice || 0) - (b.price || b.salePrice || 0)
        );
        break;
      case "price-high":
        sorted.sort(
          (a, b) =>
            (b.price || b.salePrice || 0) - (a.price || a.salePrice || 0)
        );
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
      priceRange: { min: 0, max: 7000 },
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
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <Breadcrumb page={formatCategoryName()} className="py-2" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] mt-4">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-4 h-fit">
            <ProductFilter
              categories={categories}
              brands={brands}
              sizes={sizes}
              colors={colors}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div>
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {formatCategoryName()} {texts.products}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  {texts.showing} {currentProducts.length} {texts.of}{" "}
                  {sortedProducts.length} {texts.products}
                  {currentCategory && ` ${texts.in} ${formatCategoryName()} ${texts.category}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">{texts.sortBy}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm bg-white"
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
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500"
                      }`}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }).map(
                      (_, idx) => {
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
                            className={`w-10 h-10 rounded-lg transition-all ${
                              currentPage === pageNum
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-white border border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-24 h-24 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {texts.noProductsFound}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {getEmptyMessage()}
                  </p>
                  {(filters.categories.length > 0 || 
                    filters.brands.length > 0 || 
                    filters.colors.length > 0 || 
                    filters.sizes.length > 0 || 
                    filters.priceRange.min > 0 || 
                    filters.priceRange.max < 7000 || 
                    filters.rating) && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      {texts.clearAllFilters}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};