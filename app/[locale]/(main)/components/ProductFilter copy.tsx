// app/products/components/ProductFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { PriceRangeSlider } from "./PriceRangeSlider";

// ========== TYPES ==========
interface Category {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
}

interface Brand {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
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

interface ProductFilterProps {
  categories: Category[];
  brands: Brand[];
  sizes: Size[];
  colors: Color[];
  onFilterChange: (filters: Filters) => void;
  initialFilters?: Filters;
}

// ========== MAIN COMPONENT ==========
export const ProductFilter = ({
  categories,
  brands,
  sizes,
  colors,
  onFilterChange,
  initialFilters
}: ProductFilterProps) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    sizes: true,
    colors: true,
    price: true,
    rating: true
  });

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    categories: initialFilters?.categories || [],
    brands: initialFilters?.brands || [],
    highlight: initialFilters?.highlight || [],
    colors: initialFilters?.colors || [],
    stones: initialFilters?.stones || [],
    fragrances: initialFilters?.fragrances || [],
    sizes: initialFilters?.sizes || [],
    priceRange: initialFilters?.priceRange || { min: 0, max: 10000 },
    rating: initialFilters?.rating || null
  });

  // Notify parent of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle multi-select filters (categories, brands, sizes, colors)
  const handleMultiSelect = (section: keyof Filters, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[section] as string[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];

      return { ...prev, [section]: updated };
    });
  };

  // Handle rating select
  const handleRatingSelect = (rating: number | null) => {
    setSelectedFilters(prev => ({ ...prev, rating }));
  };

  // Handle price change
  const handlePriceChange = (min: number, max: number) => {
    setSelectedFilters(prev => ({ ...prev, priceRange: { min, max } }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      highlight: [],
      colors: [],
      stones: [],
      fragrances: [],
      sizes: [],
      priceRange: { min: 0, max: 10000 },
      rating: null
    });
  };

  // ========== HELPER FUNCTIONS ==========
  // Get unique key for option
  const getOptionKey = (option: any, index: number): string => {
    if (typeof option === 'object') {
      return option._id || option.id || option.name || `option-${index}`;
    }
    return `${option}-${index}`;
  };

  // Get option label
  const getOptionLabel = (option: any): string => {
    if (typeof option === 'object') {
      return option.name || option.nameBn;
    }
    return option;
  };

  // Get option value for filtering
  const getOptionValue = (option: any): string => {
    if (typeof option === 'object') {
      return option.name;
    }
    return option;
  };

  // ========== SUB-COMPONENTS ==========
  // Slide animation wrapper
  const SlideWrapper = ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => {
    return (
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pb-4 pt-2">{children}</div>
      </div>
    );
  };

  // Rating option component
  const RatingOption = ({ rating, selected, onSelect }: { rating: number; selected: number | null; onSelect: (rating: number | null) => void }) => {
    return (
      <button
        onClick={() => onSelect(selected === rating ? null : rating)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full ${selected === rating
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
      >
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`${star <= rating
                  ? selected === rating
                    ? "fill-white text-white"
                    : "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
                }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">& Up</span>
      </button>
    );
  };

  // Filter sections configuration
  const filterSections = [
    {
      id: "categories" as const,
      title: "Shop By Categories",
      options: categories,
      type: "checkbox"
    },
    {
      id: "brands" as const,
      title: "Brands",
      options: brands,
      type: "checkbox"
    },
    {
      id: "sizes" as const,
      title: "Sizes",
      options: sizes,
      type: "checkbox"
    },
    {
      id: "colors" as const,
      title: "Filter by Color",
      options: colors,
      type: "color"
    },
    {
      id: "price" as const,
      title: "Price Filter",
      type: "price"
    },
    {
      id: "rating" as const,
      title: "Average Rating",
      type: "rating"
    }
  ];

  return (
    <aside className="space-y-4">
      {/* Dynamic Filter Sections */}
      {filterSections.map((section) => (
        <div
          key={section.id}
          className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
          >
            <h3 className="font-semibold text-gray-700 group-hover:text-red-500 transition-colors">
              {section.title}
            </h3>
            <div className="text-gray-400 group-hover:text-red-500 transition-colors">
              {openSections[section.id] ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
          </button>

          {/* Section Content */}
          <SlideWrapper isOpen={openSections[section.id]}>
            {/* Checkbox Filters (Categories, Brands, Sizes) */}
            {section.type === "checkbox" && section.options && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {section.options.map((option, index) => {
                  const optionKey = getOptionKey(option, index);
                  const optionLabel = getOptionLabel(option);
                  const optionValue = getOptionValue(option);

                  return (
                    <label
                      key={optionKey}
                      className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={(selectedFilters[section.id] as string[])?.includes(optionValue)}
                        onChange={() => handleMultiSelect(section.id, optionValue)}
                        className="rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                        {optionLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Color Filters */}
            {section.type === "color" && section.options && (
              <div className="grid grid-cols-5 gap-3">
                {section.options.map((color, index) => {
                  const colorKey = getOptionKey(color, index);
                  const colorName = getOptionLabel(color);
                  const colorHex = (color as Color).hex || (color as Color).code || "#000000";

                  return (
                    <button
                      key={colorKey}
                      onClick={() => handleMultiSelect("colors", colorName)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${selectedFilters.colors?.includes(colorName)
                            ? "ring-2 ring-offset-2 ring-red-500 scale-110"
                            : "ring-1 ring-gray-200"
                          } transition-all duration-200 group-hover:scale-110 shadow-md`}
                        style={{ backgroundColor: colorHex }}
                      />
                      <span className="text-xs text-gray-500 group-hover:text-red-500 transition-colors">
                        {colorName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Price Filter */}
            {section.type === "price" && (
              <div className="px-2">
                <PriceRangeSlider
                  minPrice={selectedFilters.priceRange.min}
                  maxPrice={selectedFilters.priceRange.max}
                  onPriceChange={(min, max) => {
                    setSelectedFilters(prev => ({
                      ...prev,
                      priceRange: { min, max }
                    }));
                  }}
                  minLimit={0}
                  maxLimit={50000}
                  minGap={1}
                  currency="৳"
                  isBn={true}
                />
              </div>
            )}

            {/* Rating Filter */}
            {section.type === "rating" && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <RatingOption
                    key={rating}
                    rating={rating}
                    selected={selectedFilters.rating}
                    onSelect={handleRatingSelect}
                  />
                ))}
              </div>
            )}
          </SlideWrapper>
        </div>
      ))}

      {/* Applied Filters Summary */}
      {(selectedFilters.categories.length > 0 ||
        selectedFilters.brands.length > 0 ||
        selectedFilters.sizes.length > 0 ||
        selectedFilters.colors.length > 0 ||
        selectedFilters.rating !== null ||
        selectedFilters.priceRange.min > 0 ||
        selectedFilters.priceRange.max < 10000) && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Applied Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.categories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-sm rounded">
                {cat}
                <button onClick={() => handleMultiSelect("categories", cat)} className="hover:text-red-800">×</button>
              </span>
            ))}
            {selectedFilters.brands.map(brand => (
              <span key={brand} className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-sm rounded">
                {brand}
                <button onClick={() => handleMultiSelect("brands", brand)} className="hover:text-red-800">×</button>
              </span>
            ))}
            {selectedFilters.sizes.map(size => (
              <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-sm rounded">
                {size}
                <button onClick={() => handleMultiSelect("sizes", size)} className="hover:text-red-800">×</button>
              </span>
            ))}
            {selectedFilters.colors.map(color => (
              <span key={color} className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-sm rounded">
                {color}
                <button onClick={() => handleMultiSelect("colors", color)} className="hover:text-red-800">×</button>
              </span>
            ))}
            {selectedFilters.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-sm rounded">
                {selectedFilters.rating}★ & Up
                <button onClick={() => handleRatingSelect(null)} className="hover:text-red-800">×</button>
              </span>
            )}
            {(selectedFilters.priceRange.min > 0 || selectedFilters.priceRange.max < 10000) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-sm rounded">
                ৳{selectedFilters.priceRange.min} - ৳{selectedFilters.priceRange.max}
                <button onClick={() => handlePriceChange(0, 10000)} className="hover:text-red-800">×</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Clear All Button */}
      <button
        onClick={clearAllFilters}
        className="w-full mt-4 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-medium transform hover:scale-[1.02] active:scale-95"
      >
        Clear All Filters
      </button>
    </aside>
  );
};