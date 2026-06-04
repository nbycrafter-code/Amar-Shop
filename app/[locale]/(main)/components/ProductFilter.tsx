// app/products/components/ProductFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, SlidersHorizontal, X } from "lucide-react";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { useLanguage } from "@/context/LanguageContext"; // ✅ যোগ করুন

// ========== TYPES ==========
interface Category { _id?: string; id?: string; name: string; nameBn?: string; }
interface Brand    { _id?: string; id?: string; name: string; nameBn?: string; }
interface Size     { _id?: string; id?: string; name: string; nameBn?: string; }
interface Color    { _id?: string; id?: string; name: string; nameBn?: string; hex: string; }

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
  initialFilters,
}: ProductFilterProps) => {
  const { language } = useLanguage(); // ✅ যোগ করুন

  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    sizes: true,
    colors: true,
    price: true,
    rating: true,
  });

  const defaultFilters: Filters = {
    categories: [],
    brands: [],
    highlight: [],
    colors: [],
    stones: [],
    fragrances: [],
    sizes: [],
    priceRange: { min: 0, max: 10000 },
    rating: null,
  };

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    if (onFilterChange) onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const toggleSection = (section: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleMultiSelect = (section: keyof Filters, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[section] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  const handleRatingSelect = (rating: number | null) =>
    setSelectedFilters((prev) => ({ ...prev, rating }));

  const clearAllFilters = () => setSelectedFilters(defaultFilters);

  // helpers
  const getOptionKey   = (o: any, i: number) => o?._id || o?.id || o?.name || `opt-${i}`;
  const getOptionLabel = (o: any) => {
    if (typeof o === "object") {
      if (language === 'bn') {
        return o.nameBn || o.name;
      }
      return o.name || o.nameBn;
    }
    return o;
  };
  const getOptionValue = (o: any) => (typeof o === "object" ? o.name : o);

  const activeCount =
    selectedFilters.categories.length +
    selectedFilters.brands.length +
    selectedFilters.sizes.length +
    selectedFilters.colors.length +
    (selectedFilters.rating !== null ? 1 : 0) +
    (selectedFilters.priceRange.min > 0 || selectedFilters.priceRange.max < 10000 ? 1 : 0);

  // Section titles with language support
  const getSectionTitle = (sectionId: string) => {
    const titles: Record<string, { en: string; bn: string }> = {
      categories: { en: "Shop By Categories", bn: "বিভাগ অনুসারে কেনাকাটা করুন" },
      brands: { en: "Brands", bn: "ব্র্যান্ড" },
      sizes: { en: "Sizes", bn: "সাইজ" },
      colors: { en: "Filter by Color", bn: "রং অনুসারে ফিল্টার" },
      price: { en: "Price Filter", bn: "দাম ফিল্টার" },
      rating: { en: "Average Rating", bn: "গড় রেটিং" },
    };
    return titles[sectionId]?.[language === 'bn' ? 'bn' : 'en'] || sectionId;
  };

  // Get "& Up" text for rating
  const getRatingUpText = () => {
    return language === 'bn' ? 'এবং তার উপরে' : '& Up';
  };

  // Get "Applied Filters" text
  const getAppliedFiltersText = () => {
    return language === 'bn' ? 'প্রয়োগকৃত ফিল্টার' : 'Applied Filters';
  };

  // Get "Clear All Filters" text
  const getClearAllText = () => {
    return language === 'bn' ? 'সব ফিল্টার মুছুন' : 'Clear All Filters';
  };

  // Get "Filters" text for mobile button
  const getFiltersText = () => {
    return language === 'bn' ? 'ফিল্টার' : 'Filters';
  };

  // Get "Show Results" text
  const getShowResultsText = () => {
    return language === 'bn' ? 'ফলাফল দেখান' : 'Show Results';
  };

  // ========== SUB-COMPONENTS ==========
  const SlideWrapper = ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-4 pb-4 pt-2">{children}</div>
    </div>
  );

  const RatingOption = ({
    rating,
    selected,
    onSelect,
  }: {
    rating: number;
    selected: number | null;
    onSelect: (r: number | null) => void;
  }) => (
    <button
      onClick={() => onSelect(selected === rating ? null : rating)}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-all ${
        selected === rating
          ? "bg-red-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? selected === rating
                  ? "fill-white text-white"
                  : "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
      <span className="text-sm font-medium">{getRatingUpText()}</span>
    </button>
  );

  const filterSections = [
    { id: "categories" as const, title: getSectionTitle("categories"), options: categories, type: "checkbox" },
    { id: "brands" as const, title: getSectionTitle("brands"), options: brands, type: "checkbox" },
    { id: "sizes" as const, title: getSectionTitle("sizes"), options: sizes, type: "checkbox" },
    { id: "colors" as const, title: getSectionTitle("colors"), options: colors, type: "color" },
    { id: "price" as const, title: getSectionTitle("price"), type: "price" },
    { id: "rating" as const, title: getSectionTitle("rating"), type: "rating" },
  ];

  // ========== FILTER PANEL (shared by sidebar & drawer) ==========
  const FilterPanel = () => (
    <aside className="space-y-3">
      {filterSections.map((section) => (
        <div
          key={section.id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
        >
          <button
            onClick={() => toggleSection(section.id)}
            className="group flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-700 group-hover:text-red-500 transition-colors text-sm">
              {section.title}
            </h3>
            <span className="text-gray-400 group-hover:text-red-500 transition-colors">
              {openSections[section.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          <SlideWrapper isOpen={openSections[section.id]}>
            {/* Checkbox */}
            {section.type === "checkbox" && section.options && (
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {section.options.map((option, i) => (
                  <label
                    key={getOptionKey(option, i)}
                    className="group flex cursor-pointer items-center gap-2 hover:text-red-500 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(selectedFilters[section.id] as string[])?.includes(getOptionValue(option))}
                      onChange={() => handleMultiSelect(section.id, getOptionValue(option))}
                      className="cursor-pointer rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                      {getOptionLabel(option)}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Color */}
            {section.type === "color" && section.options && (
              <div className="grid grid-cols-5 gap-3">
                {section.options.map((color, i) => {
                  const colorName = getOptionLabel(color);
                  const colorHex  = (color as Color).hex || "#000";
                  return (
                    <button
                      key={getOptionKey(color, i)}
                      onClick={() => handleMultiSelect("colors", getOptionValue(color))}
                      className="group flex flex-col items-center gap-1"
                    >
                      <div
                        className={`h-6 w-6 rounded-full shadow-md transition-all duration-200 group-hover:scale-110 ${
                          selectedFilters.colors?.includes(getOptionValue(color))
                            ? "scale-110 ring-2 ring-red-500 ring-offset-2"
                            : "ring-1 ring-gray-200"
                        }`}
                        style={{ backgroundColor: colorHex }}
                      />
                      <span className="text-[10px] text-gray-500 group-hover:text-red-500 transition-colors">
                        {colorName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Price */}
            {section.type === "price" && (
              <div className="px-2">
                <PriceRangeSlider
                  minPrice={selectedFilters.priceRange.min}
                  maxPrice={selectedFilters.priceRange.max}
                  onPriceChange={(min, max) =>
                    setSelectedFilters((prev) => ({ ...prev, priceRange: { min, max } }))
                  }
                  minLimit={0}
                  maxLimit={50000}
                  minGap={1}
                  currency="৳"
                  isBn={language === 'bn'}
                />
              </div>
            )}

            {/* Rating */}
            {section.type === "rating" && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((r) => (
                  <RatingOption
                    key={r}
                    rating={r}
                    selected={selectedFilters.rating}
                    onSelect={handleRatingSelect}
                  />
                ))}
              </div>
            )}
          </SlideWrapper>
        </div>
      ))}

      {/* Applied Filters */}
      {activeCount > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-700 text-sm">{getAppliedFiltersText()}</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.categories.map((cat) => (
              <Tag key={cat} label={cat} onRemove={() => handleMultiSelect("categories", cat)} />
            ))}
            {selectedFilters.brands.map((b) => (
              <Tag key={b} label={b} onRemove={() => handleMultiSelect("brands", b)} />
            ))}
            {selectedFilters.sizes.map((s) => (
              <Tag key={s} label={s} onRemove={() => handleMultiSelect("sizes", s)} />
            ))}
            {selectedFilters.colors.map((c) => (
              <Tag key={c} label={c} onRemove={() => handleMultiSelect("colors", c)} />
            ))}
            {selectedFilters.rating !== null && (
              <Tag label={`${selectedFilters.rating}★ ${getRatingUpText()}`} onRemove={() => handleRatingSelect(null)} />
            )}
            {(selectedFilters.priceRange.min > 0 || selectedFilters.priceRange.max < 10000) && (
              <Tag
                label={`৳${selectedFilters.priceRange.min}–৳${selectedFilters.priceRange.max}`}
                onRemove={() =>
                  setSelectedFilters((prev) => ({ ...prev, priceRange: { min: 0, max: 10000 } }))
                }
              />
            )}
          </div>
        </div>
      )}

      {/* Clear All */}
      <button
        onClick={clearAllFilters}
        className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-[1.02] hover:bg-red-500 hover:text-white active:scale-95"
      >
        {getClearAllText()}
      </button>
    </aside>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <div className="hidden lg:block">
        <FilterPanel />
      </div>

      {/* ── MOBILE: Floating Filter Button ── */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-red-500 hover:text-red-500 transition-all"
        >
          <SlidersHorizontal size={16} />
          {getFiltersText()}
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel — slides up from bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 flex max-h-[90dvh] flex-col rounded-t-2xl bg-gray-50 shadow-2xl"
            style={{ animation: "slideUp 0.28s ease-out" }}
          >
            {/* Handle + Header */}
            <div className="flex-shrink-0 rounded-t-2xl bg-white px-4 pb-3 pt-3 shadow-sm">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800">
                  {getFiltersText()}
                  {activeCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {activeCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterPanel />
            </div>

            {/* Sticky footer */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-xl bg-[#ef553f] py-3 text-sm font-semibold text-white shadow hover:bg-[#d94535] transition-colors active:scale-[0.98]"
              >
                {getShowResultsText()}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

// ── Tiny tag component ──
const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs text-red-600">
    {label}
    <button onClick={onRemove} className="hover:text-red-800 font-bold">×</button>
  </span>
);