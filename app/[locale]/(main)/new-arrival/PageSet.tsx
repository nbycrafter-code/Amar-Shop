// app/new-arrival/PageSet.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductFilter } from "../components/ProductFilter";
import { Breadcrumb } from "../components/Breadcrumb";
import { ProductCard } from "../components/ProductCard";
import { ChevronLeft, ChevronRight, Sparkles, Clock } from "lucide-react";
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
  discountType?: string;
  stock: number;
  categoryId?: string;
  categoryName?: string;
  categoryNameBn?: string;
  brandId?: string;
  brandName?: string;
  brandNameBn?: string;
  sizes?: Array<{ id: string; name: string; nameBn?: string; code?: string }>;
  colors?: Array<{ id: string; name: string; nameBn?: string; hex?: string; code?: string }>;
  description?: string;
  descriptionBn?: string;
  image: string;
  multiImages?: string[];
  video?: string;
  slug: string;
  rating?: number;
  badge?: string;
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
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
}

interface Size {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  code?: string;
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
  sizes: string[];
  priceRange: { min: number; max: number };
  rating: number | null;
}

interface PageSetProps {
  type?: "all" | "new-arrivals";
  category?: string | null;
  searchTerm?: string | null;
  categories?: Category[];
  brands?: Brand[];
  sizes?: Size[];
  colors?: Color[];
  products: Product[];
}

// ========== MAIN COMPONENT ==========
export const PageSet = ({
  type = "all",
  category = null,
  searchTerm = null,
  categories = [],
  brands = [],
  sizes = [],
  colors = [],
  products
}: PageSetProps) => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  
  // Filter states
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    brands: [],
    highlight: [],
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 4000 },
    rating: null,
  });

  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Translations
  const texts = {
    // Page Titles
    newArrivals: isBn ? "নতুন আগমন" : "New Arrivals",
    allProducts: isBn ? "সব পণ্য" : "All Products",
    search: isBn ? "অনুসন্ধান" : "Search",
    products: isBn ? "পণ্য" : "Products",
    
    // New Arrivals Section
    discoverLatest: isBn ? "সবচেয়ে নতুন পণ্য আবিষ্কার করুন!" : "Discover the latest products just added!",
    newProducts: isBn ? "নতুন পণ্য" : "New Products",
    freshFromCollection: isBn ? "কলেকশন থেকে নতুন" : "Fresh from the Collection",
    showingNewArrivals: (current, total) => isBn 
      ? `${current}টির মধ্যে ${total}টি নতুন আগমন দেখানো হচ্ছে`
      : `Showing ${current} of ${total} new arrivals`,
    justIn: isBn ? "✨ সবেমাত্র এসেছে!" : "✨ Just In!",
    
    // Common
    showingProducts: (current, total) => isBn
      ? `${current}টির মধ্যে ${total}টি পণ্য দেখানো হচ্ছে`
      : `Showing ${current} of ${total} products`,
    sortBy: isBn ? "সাজান:" : "Sort by:",
    default: isBn ? "ডিফল্ট (সর্বশেষ প্রথমে)" : "Default (Newest First)",
    priceLowToHigh: isBn ? "দাম: কম থেকে বেশি" : "Price: Low to High",
    priceHighToLow: isBn ? "দাম: বেশি থেকে কম" : "Price: High to Low",
    topRated: isBn ? "সর্বোচ্চ রেটেড" : "Top Rated",
    newestFirst: isBn ? "সর্বশেষ প্রথমে" : "Newest First",
    biggestDiscount: isBn ? "সর্বোচ্চ ছাড়" : "Biggest Discount",
    nameAZ: isBn ? "নাম A-Z" : "Name A-Z",
    
    // Empty States
    noNewArrivalsFound: isBn ? "কোন নতুন আগমন পাওয়া যায়নি" : "No New Arrivals Found",
    noProductsFound: isBn ? "কোন পণ্য পাওয়া যায়নি" : "No Products Found",
    noResultsFor: (term) => isBn ? `"${term}" এর জন্য কোন ফলাফল পাওয়া যায়নি` : `No results found for "${term}"`,
    noProductsInCategory: (cat) => isBn ? `${cat} ক্যাটাগরিতে কোন পণ্য নেই` : `No products found in ${cat} category`,
    noProductsAvailable: isBn ? "কোন পণ্য উপলব্ধ নেই" : "No products available",
    clearAllFilters: isBn ? "সব ফিল্টার সরান" : "Clear All Filters",
  };

  // Sort options with translations
  const sortOptions = [
    { value: "default", label: texts.default },
    { value: "price-low", label: texts.priceLowToHigh },
    { value: "price-high", label: texts.priceHighToLow },
    { value: "rating", label: texts.topRated },
    { value: "newest", label: texts.newestFirst },
    { value: "discount", label: texts.biggestDiscount },
    ...(type === "new-arrivals" ? [{ value: "name-asc", label: texts.nameAZ }] : []),
  ];

  // ========== ফিল্টারিং ==========
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.categoryName && filters.categories.includes(p.categoryName)) return true;
        if (isBn && p.categoryNameBn && filters.categories.includes(p.categoryNameBn)) return true;
        return false;
      });
    }

    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.brandName && filters.brands.includes(p.brandName)) return true;
        if (isBn && p.brandNameBn && filters.brands.includes(p.brandNameBn)) return true;
        return false;
      });
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.sizes && p.sizes.length > 0) {
          return p.sizes.some(size => 
            filters.sizes.includes(size.name) || 
            (isBn && size.nameBn && filters.sizes.includes(size.nameBn))
          );
        }
        if (p.sizeNames && p.sizeNames.length > 0) {
          return p.sizeNames.some(size => filters.sizes.includes(size));
        }
        return false;
      });
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter((p) => {
        if (p.colors && p.colors.length > 0) {
          return p.colors.some(color => 
            filters.colors.includes(color.name) || 
            (isBn && color.nameBn && filters.colors.includes(color.nameBn))
          );
        }
        if (p.colorNames && p.colorNames.length > 0) {
          return p.colorNames.some(color => filters.colors.includes(color));
        }
        return false;
      });
    }

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );

    if (filters.rating) {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.rating!);
    }

    return filtered;
  }, [products, filters, isBn]);

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
      case "name-asc":
        sorted.sort((a, b) => {
          const nameA = isBn ? (a.nameBn || a.name) : a.name;
          const nameB = isBn ? (b.nameBn || b.name) : b.name;
          return nameA.localeCompare(nameB);
        });
        break;
      default:
        sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
    }

    return sorted;
  }, [filteredProducts, sortBy, isBn]);

  // ========== পেজিনেশন ==========
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    return sortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageTitle = (): string => {
    if (type === "new-arrivals") return texts.newArrivals;
    if (searchTerm) return `${texts.search} Results for "${searchTerm}"`;
    if (category && category !== "null") return `${category} ${texts.products}`;
    return texts.allProducts;
  };

  const getBreadcrumbPage = (): string => {
    if (type === "new-arrivals") return texts.newArrivals;
    if (searchTerm) return texts.search;
    if (category && category !== "null") return category;
    return texts.products;
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      highlight: [],
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 4000 },
      rating: null,
    });
    setSortBy("default");
  };

  const getEmptyMessage = () => {
    if (type === "new-arrivals") return texts.noNewArrivalsFound;
    if (searchTerm) return texts.noResultsFor(searchTerm);
    if (category && category !== "null") return texts.noProductsInCategory(category);
    return texts.noProductsAvailable;
  };

  const theme = {
    primary: type === "new-arrivals" ? "green" : "red",
    primaryGradient: type === "new-arrivals" ? "from-green-500 to-teal-500" : "from-red-500 to-rose-500",
    badgeBg: type === "new-arrivals" ? "bg-green-50" : "bg-red-50",
    badgeText: type === "new-arrivals" ? "text-green-600" : "text-red-600",
    buttonHover: type === "new-arrivals" ? "hover:bg-green-600" : "hover:bg-red-600",
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <Breadcrumb page={getBreadcrumbPage()} className="py-2" />

        {type === "new-arrivals" && (
          <div className={`bg-gradient-to-r ${theme.primaryGradient} rounded-2xl p-8 mb-8 text-white`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{texts.newArrivals}</h1>
                  <p className="text-white/90 mt-1">{texts.discoverLatest}</p>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{products.length} {texts.newProducts}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] mt-4">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-4 h-fit">
            <ProductFilter
              categories={categories}
              brands={brands}
              sizes={sizes}
              colors={colors}
              onFilterChange={handleFilterChange}
              initialFilters={filters}
              type={type}
              disabled={false}
            />
          </div>

          {/* Main Content */}
          <div>
            {type === "new-arrivals" && (
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {texts.freshFromCollection}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {texts.showingNewArrivals(currentProducts.length, sortedProducts.length)}
                    </p>
                  </div>
                  <div className={`${theme.badgeBg} px-4 py-2 rounded-lg`}>
                    <p className={`${theme.badgeText} font-semibold`}>{texts.justIn}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {getPageTitle()}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  {texts.showingProducts(currentProducts.length, sortedProducts.length)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">{texts.sortBy}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white"
                >
                  {sortOptions.map(option => (
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
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-red-500 hover:text-white"
                        }`}
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
                          className={`w-10 h-10 rounded-lg transition-all ${currentPage === pageNum
                              ? "bg-red-500 text-white shadow-md"
                              : "bg-white border border-gray-300 hover:bg-red-500 hover:text-white"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-red-500 hover:text-white"
                        }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {getEmptyMessage()}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm && texts.noResultsFor(searchTerm)}
                  </p>
                  {(filters.categories.length > 0 || filters.brands.length > 0 || filters.colors.length > 0) && (
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