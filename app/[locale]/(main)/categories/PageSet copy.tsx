// app/products/PageSet.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductFilter } from "../components/ProductFilter";
import { Breadcrumb } from "../components/Breadcrumb";
import { ProductCard } from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ========== TYPES ==========
interface Product {
  _id?: string;
  id?: number | string;
  name: string;
  nameBn?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  discountType?: string;
  stock: number;
  category: string;
  categoryName?: string;
  categoryNameBn?: string;      // ✅ ADDED - Bangla category name
  brand: string;
  brandName?: string;
  brandNameBn?: string;          // ✅ ADDED - Bangla brand name
  size?: string;                 // Single size
  sizes?: string[];              // Sizes array (English)
  sizeNames?: string[];          // Size names (English)
  sizeNamesBn?: string[];        // ✅ ADDED - Bangla size names
  color?: string;                // Single color
  colors?: string[];             // Colors array (English)
  colorNames?: string[];         // Color names (English)
  colorNamesBn?: string[];       // ✅ ADDED - Bangla color names
  colorHexes?: string[];
  description?: string;
  descriptionBn?: string;
  image: string;
  multiImages?: string[];
  video?: string;
  slug: string;
  rating?: number;
  isNew?: boolean;
  highlight?: string;
  active?: boolean;
  sales?: number;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  slug?: string;
}

interface Brand {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  slug?: string;
}

interface Size {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
}

interface Color {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  hex: string;
  code?: string;
}

interface Filters {
  categories: string[];
  brands: string[];
  highlight: string[];
  colors: string[];
  stones: string[];
  fragrances: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
  rating: number | null;
}

interface PageSetProps {
  category: string | null;
  searchTerm: string | null;
  categories: Category[];
  brands: Brand[];
  sizes: Size[];
  colors: Color[];
  products: Product[];
}

// ========== MAIN COMPONENT ==========
export const PageSet = ({
  category,
  searchTerm,
  categories,
  brands,
  sizes,
  colors,
  products
}: PageSetProps) => {
  const router = useRouter();

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    brands: [],
    highlight: [],
    colors: [],
    stones: [],
    fragrances: [],
    sizes: [],
    priceRange: { min: 0, max: 4000 },
    rating: null,
  });

  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 12;

  // ========== FILTERING LOGIC ==========
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 1. CATEGORY FILTER (from URL)
    // Matches with product.categoryName or product.categoryNameBn
    if (category && category !== "null") {
      const categoryLower = category.toLowerCase();
      filtered = filtered.filter(
        (p) => 
          p.categoryName?.toLowerCase() === categoryLower ||
          p.categoryNameBn?.toLowerCase() === categoryLower ||
          p.category?.toLowerCase() === categoryLower
      );
    }

    // 2. SEARCH TERM FILTER (from URL)
    // Searches in name, nameBn, category, brand
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.nameBn?.toLowerCase().includes(searchLower) ||
          p.categoryName?.toLowerCase().includes(searchLower) ||
          p.categoryNameBn?.toLowerCase().includes(searchLower) ||
          p.brandName?.toLowerCase().includes(searchLower) ||
          p.brandNameBn?.toLowerCase().includes(searchLower) ||
          p.category?.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower)
      );
    }

    // 3. CATEGORY FILTER (from sidebar)
    // Filters by categoryName (English) or categoryNameBn (Bangla)
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((p) => {
        // Check English category name
        if (p.categoryName && filters.categories.includes(p.categoryName)) {
          return true;
        }
        // Check Bangla category name
        if (p.categoryNameBn && filters.categories.includes(p.categoryNameBn)) {
          return true;
        }
        // Check fallback category field
        if (p.category && filters.categories.includes(p.category)) {
          return true;
        }
        return false;
      });
    }

    // 4. BRAND FILTER
    // Filters by brandName (English) or brandNameBn (Bangla)
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((p) => {
        // Check English brand name
        if (p.brandName && filters.brands.includes(p.brandName)) {
          return true;
        }
        // Check Bangla brand name
        if (p.brandNameBn && filters.brands.includes(p.brandNameBn)) {
          return true;
        }
        // Check fallback brand field
        if (p.brand && filters.brands.includes(p.brand)) {
          return true;
        }
        return false;
      });
    }

    // 5. HIGHLIGHT FILTER
    if (filters.highlight && filters.highlight.length > 0) {
      filtered = filtered.filter((p) =>
        filters.highlight.includes(p.highlight || ""),
      );
    }

    // 6. SIZE FILTER
    // Supports: size (single), sizeNames (English), sizeNamesBn (Bangla)
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter((p) => {
        // Check single size field
        if (p.size && filters.sizes.includes(p.size)) {
          return true;
        }
        // Check English size names array
        if (p.sizeNames && p.sizeNames.length > 0) {
          const hasEnglishMatch = p.sizeNames.some(size => filters.sizes.includes(size));
          if (hasEnglishMatch) return true;
        }
        // Check Bangla size names array
        if (p.sizeNamesBn && p.sizeNamesBn.length > 0) {
          const hasBanglaMatch = p.sizeNamesBn.some(sizeBn => filters.sizes.includes(sizeBn));
          if (hasBanglaMatch) return true;
        }
        // Check legacy sizes array
        if (p.sizes && p.sizes.length > 0) {
          return p.sizes.some(size => filters.sizes.includes(size));
        }
        return false;
      });
    }

    // 7. COLOR FILTER
    // Supports: color (single), colorNames (English), colorNamesBn (Bangla)
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter((p) => {
        // Check single color field
        if (p.color && filters.colors.includes(p.color)) {
          return true;
        }
        // Check English color names array
        if (p.colorNames && p.colorNames.length > 0) {
          const hasEnglishMatch = p.colorNames.some(color => filters.colors.includes(color));
          if (hasEnglishMatch) return true;
        }
        // Check Bangla color names array
        if (p.colorNamesBn && p.colorNamesBn.length > 0) {
          const hasBanglaMatch = p.colorNamesBn.some(colorBn => filters.colors.includes(colorBn));
          if (hasBanglaMatch) return true;
        }
        // Check legacy colors array
        if (p.colors && p.colors.length > 0) {
          return p.colors.some(color => filters.colors.includes(color));
        }
        return false;
      });
    }

    // 8. PRICE FILTER
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange.min && p.price <= filters.priceRange.max,
    );

    // 9. RATING FILTER
    if (filters.rating) {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.rating!);
    }

    return filtered;
  }, [products, category, searchTerm, filters]);

  // ========== SORTING LOGIC ==========
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
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
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

  // ========== PAGINATION ==========
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchTerm, filters, sortBy]);

  // Handle filter changes from ProductFilter component
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get page title (supports Bangla)
  const getPageTitle = (): string => {
    if (searchTerm) return `Search Results for "${searchTerm}"`;
    if (category && category !== "null") return `${category} Products`;
    return "All Categories Products";
  };

  // Get breadcrumb page name
  const getBreadcrumbPage = (): string => {
    if (searchTerm) return "Search";
    if (category && category !== "null") return category;
    return "Products";
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      highlight: [],
      colors: [],
      stones: [],
      fragrances: [],
      sizes: [],
      priceRange: { min: 0, max: 2000 },
      rating: null,
    });
    setSortBy("default");
    router.push("/products");
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb page={getBreadcrumbPage()} className="py-2" />

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
            />
          </div>

          {/* Main Content */}
          <div>
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {getPageTitle()}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Showing {currentProducts.length} of {sortedProducts.length}{" "}
                  products
                  {searchTerm && ` for "${searchTerm}"`}
                  {category && !searchTerm && ` in ${category}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm bg-white"
                >
                  <option value="default">Default (Newest First)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentPage === 1
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
                            className={`w-10 h-10 rounded-lg transition-all ${currentPage === pageNum
                              ? "bg-red-500 text-white shadow-md"
                              : "bg-white border border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentPage === totalPages
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
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? `No results found for "${searchTerm}"`
                      : category && category !== "null"
                        ? `No products found in ${category} category`
                        : "No products match your selected filters"}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear All Filters
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