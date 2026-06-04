"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

interface Category {
  _id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
}

interface NavbarProps {
  categories: Category[];
  openCart: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
  compareCount: number;
  onCompareClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  openCart,
  wishlistCount,
  onWishlistClick,
  compareCount,
  onCompareClick,
}) => {
  const { cart, wishlist, search, setSearch } = useApp();
  const { language } = useLanguage();
  
  // All states with initial values
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<Category | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Mobile states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<Category | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set mounted and setup scroll listener
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    
    handleScroll(); // Call immediately
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set initial active category
  useEffect(() => {
    if (mounted && categories && categories.length > 0 && !activeMegaCategory) {
      setActiveMegaCategory(categories[0]);
    }
  }, [categories, activeMegaCategory, mounted]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen && mounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, mounted]);

  // Handle category hover with delay
  const handleCategoryHover = (category: Category) => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setActiveMegaCategory(category);
  };

  const handleCategoryLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setCategoryOpen(false);
    }, 200);
  };

  // Helper functions
  const getCategoryName = (category: Category) => {
    return language === 'bn' ? category.nameBn : category.name;
  };

  const getSubCategoryName = (subcategory: SubCategory) => {
    return language === 'bn' ? subcategory.nameBn : subcategory.name;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCategoryOpen(false);
    setMobileActiveCategory(null);
  };

  // Don't render anything until mounted (prevents hydration error)
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 border-y border-gray-200 bg-[#f3f3f3]">
        <div className="container mx-auto flex w-full items-center justify-between gap-4 px-4 py-3">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-y border-gray-200 bg-[#f3f3f3] transition-all ${
          isScrolled ? "shadow-md" : ""
        }`}
        suppressHydrationWarning
      >
        <div
          className={`container mx-auto flex w-full items-center justify-between gap-4 px-4 text-sm text-gray-700 transition-all ${
            isScrolled ? "py-2" : "py-3"
          }`}
          suppressHydrationWarning
        >
          {/* ── MOBILE: Left — Hamburger ── */}
          <button
            className="flex lg:hidden items-center text-gray-700 hover:text-[#ef553f] transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* ── DESKTOP: Left — Categories + Nav Links ── */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Categories Dropdown */}
            <div
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={handleCategoryLeave}
              className="relative"
            >
              <button className="flex items-center gap-2 text-base font-medium text-gray-800">
                <Menu className="h-4 w-4" /> 
                {language === 'bn' ? 'বিভাগ অনুসারে কেনাকাটা করুন' : 'Shop By Categories'}{" "}
                <ChevronDown className="h-4 w-4" />
              </button>

              {categoryOpen && categories && categories.length > 0 && (
                <div className="absolute left-0 top-full z-40 w-[980px] border border-gray-300 bg-white shadow-lg">
                  <div className="grid grid-cols-[240px_1fr]">
                    {/* Left — Category List */}
                    <div className="border-r border-gray-200 bg-[#fafafa] py-1">
                      {categories.map((item, index) => {
                        const isActive = activeMegaCategory?._id === item._id;
                        const hasSubCategories = item.subCategories && item.subCategories.length > 0;

                        return (
                          <div key={item._id}>
                            <Link
                              href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(item.slug)}`}
                              onMouseEnter={() => handleCategoryHover(item)}
                              className={`flex w-full items-center justify-between ${
                                categories.length - 1 === index ? "" : "border-b border-gray-200"
                              } px-4 py-3 text-left text-[16px] transition ${
                                isActive
                                  ? "bg-white font-medium text-[#ef553f]"
                                  : "text-gray-700 hover:bg-white"
                              }`}
                            >
                              <span>{getCategoryName(item)}</span>
                              {hasSubCategories && (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                              )}
                            </Link>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right — Subcategories */}
                    <div className="grid grid-cols-3 gap-x-10 gap-y-6 p-7">
                      {activeMegaCategory?.subCategories &&
                      activeMegaCategory.subCategories.length > 0 ? (
                        activeMegaCategory.subCategories.map((subcat) => (
                          <div key={subcat._id} className="flex flex-col">
                            <Link
                              href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(
                                activeMegaCategory.slug
                              )}/${subcat.slug}`}
                              className="mb-2 text-[13px] font-medium text-gray-800 hover:text-[#ef553f] transition-colors"
                            >
                              {getSubCategoryName(subcat)}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          {language === 'bn' ? 'কোন সাবক্যাটাগরি নেই' : 'No subcategories available'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <Link href={`/${language === 'bn' ? 'bn' : 'en'}`} className="hover:text-[#ef553f] transition-colors">
              {language === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <Link
              href={`/${language === 'bn' ? 'bn' : 'en'}/categories`}
              className="flex items-center gap-1 hover:text-[#ef553f] transition-colors"
            >
              {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}{" "}
              <span className="rounded bg-emerald-100 px-1 text-[10px] text-emerald-700">
                {language === 'bn' ? 'ছাড়' : 'SALE'}
              </span>
            </Link>
            <Link
              href={`/${language === 'bn' ? 'bn' : 'en'}/products`}
              className="flex items-center gap-1 hover:text-[#ef553f] transition-colors"
            >
              {language === 'bn' ? 'পণ্য' : 'Products'}{" "}
              <span className="rounded bg-pink-100 px-1 text-[10px] text-pink-600">
                {language === 'bn' ? 'হট' : 'HOT'}
              </span>
            </Link>
            <Link
              href={`/${language === 'bn' ? 'bn' : 'en'}/offers`}
              className="hover:text-[#ef553f] transition-colors"
            >
              {language === 'bn' ? 'সেরা ডিল' : 'Top deals'}
            </Link>
            <Link
              href={`/${language === 'bn' ? 'bn' : 'en'}/new-arrival`}
              className="flex items-center gap-1 hover:text-[#ef553f] transition-colors"
            >
              {language === 'bn' ? 'নতুন আগমন' : 'New Arrival'}{" "}
              <span className="rounded bg-emerald-100 px-1 text-[10px] text-emerald-700">
                {language === 'bn' ? 'নতুন' : 'NEW'}
              </span>
            </Link>
          </div>

          {/* ── MOBILE: Center — Brand or Search bar ── */}
          {mobileSearchOpen ? (
            <div className="flex lg:hidden flex-1 items-center gap-2 mx-2">
              <input
                type="text"
                autoFocus
                placeholder={language === 'bn' ? "পণ্য খুঁজুন..." : "Search products..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-800 outline-none focus:border-[#ef553f]"
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-gray-500 hover:text-[#ef553f]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <span className="flex lg:hidden text-base font-semibold text-gray-800 tracking-tight">
              AmarShop
            </span>
          )}

          {/* ── Right Icons ── */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search toggle for mobile */}
            <button
              className="lg:hidden text-gray-600 hover:text-red-500 transition-colors"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Desktop search (always visible on desktop) */}
            <div className="hidden lg:block relative">
              <input
                type="text"
                placeholder={language === 'bn' ? "সার্চ..." : "Search..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 rounded-full border border-gray-300 bg-white px-4 py-1.5 pl-10 text-sm outline-none focus:border-[#ef553f]"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* User icon (desktop only when scrolled) */}
            {isScrolled && (
              <button className="hidden lg:block text-gray-600 hover:text-red-500 transition-colors">
                <User size={22} />
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="relative text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ef553f] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-gray-600 hover:text-red-500 transition-colors"
            >
              <ShoppingBag size={22} />
              <span className="absolute -top-2 -right-2 bg-[#ef553f] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER OVERLAY
      ══════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="relative z-10 flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#ef553f] px-4 py-4">
              <span className="text-lg font-bold text-white">
                {language === 'bn' ? 'মেনু' : 'Menu'}
              </span>
              <button
                onClick={closeMobileMenu}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto">
              {/* Sub-level: Category → Subcategories */}
              {mobileCategoryOpen && mobileActiveCategory ? (
                <div>
                  <button
                    onClick={() => {
                      setMobileCategoryOpen(false);
                      setMobileActiveCategory(null);
                    }}
                    className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-3 text-sm font-medium text-[#ef553f]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {language === 'bn' ? 'ক্যাটাগরিতে ফিরুন' : 'Back to Categories'}
                  </button>

                  <div className="px-4 py-2">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                      {getCategoryName(mobileActiveCategory)}
                    </p>
                    {mobileActiveCategory.subCategories &&
                    mobileActiveCategory.subCategories.length > 0 ? (
                      mobileActiveCategory.subCategories.map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(
                            mobileActiveCategory.slug
                          )}/${sub.slug}`}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-2 border-b border-gray-100 py-3 text-sm text-gray-700 hover:text-[#ef553f] transition-colors"
                        >
                          {getSubCategoryName(sub)}
                        </Link>
                      ))
                    ) : (
                      <p className="py-6 text-center text-sm text-gray-400">
                        {language === 'bn' ? 'কোন সাবক্যাটাগরি নেই' : 'No subcategories'}
                      </p>
                    )}
                  </div>
                </div>
              ) : mobileCategoryOpen ? (
                /* All Categories list */
                <div>
                  <button
                    onClick={() => setMobileCategoryOpen(false)}
                    className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-3 text-sm font-medium text-[#ef553f]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {language === 'bn' ? 'পিছনে' : 'Back'}
                  </button>
                  {categories?.map((cat) => (
                    <div key={cat._id}>
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        <button
                          onClick={() => setMobileActiveCategory(cat)}
                          className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f]"
                        >
                          <span>{getCategoryName(cat)}</span>
                          <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        </button>
                      ) : (
                        <Link
                          href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(cat.slug)}`}
                          onClick={closeMobileMenu}
                          className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f]"
                        >
                          {getCategoryName(cat)}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Top-level nav */
                <nav className="py-2">
                  <button
                    onClick={() => setMobileCategoryOpen(true)}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <Menu className="h-4 w-4 text-[#ef553f]" />
                      {language === 'bn' ? 'বিভাগ অনুসারে কেনাকাটা করুন' : 'Shop By Categories'}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>

                  <Link
                    href={`/${language === 'bn' ? 'bn' : 'en'}`}
                    onClick={closeMobileMenu}
                    className="flex w-full items-center border-b border-gray-100 px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f]"
                  >
                    {language === 'bn' ? 'হোম' : 'Home'}
                  </Link>
                  <Link
                    href={`/${language === 'bn' ? 'bn' : 'en'}/categories`}
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f]"
                  >
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700">
                      {language === 'bn' ? 'ছাড়' : 'SALE'}
                    </span>
                  </Link>
                  <Link
                    href={`/${language === 'bn' ? 'bn' : 'en'}/products`}
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f]"
                  >
                    {language === 'bn' ? 'পণ্য' : 'Products'}
                    <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[10px] text-pink-600">
                      {language === 'bn' ? 'হট' : 'HOT'}
                    </span>
                  </Link>
                  <Link
                    href={`/${language === 'bn' ? 'bn' : 'en'}/offers`}
                    onClick={closeMobileMenu}
                    className="flex w-full items-center border-b border-gray-100 px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f]"
                  >
                    {language === 'bn' ? 'সেরা ডিল' : 'Top Deals'}
                  </Link>
                  <Link
                    href={`/${language === 'bn' ? 'bn' : 'en'}/new-arrival`}
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f]"
                  >
                    {language === 'bn' ? 'নতুন আগমন' : 'New Arrival'}
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700">
                      {language === 'bn' ? 'নতুন' : 'NEW'}
                    </span>
                  </Link>
                </nav>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-200 px-4 py-4">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ef553f] transition-colors">
                  <User className="h-5 w-5" /> 
                  {language === 'bn' ? 'অ্যাকাউন্ট' : 'Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};