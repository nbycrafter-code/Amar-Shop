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
  Sparkles,
  Tag,
  TrendingUp,
  Clock,
  Gift,
  LayoutDashboard,
  UserCircle,
  GitCompare,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Icon from "@/components/Icon";
import { signOut } from "next-auth/react";
import Image from "next/image";

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
  session?: any;
  categories: Category[];
  openCart: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
  compareCount: number;
  onCompareClick: () => void;
  settings?: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  categories,
  openCart,
  wishlistCount,
  onWishlistClick,
  compareCount,
  onCompareClick,
  settings,
}) => {
  const { cart, wishlist, search, setSearch } = useApp();
  const { language } = useLanguage();
  const accountRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const backgroundColor = settings?.headerBackground || settings?.backgroundColor || "#FFFFFF";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const textMuted = settings?.textMuted || "#6B7280";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const cardBackground = settings?.cardBackground || "#FFFFFF";

  const [isScrolled, setIsScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<Category | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<Category | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mounted && categories && categories.length > 0 && !activeMegaCategory) {
      setActiveMegaCategory(categories[0]);
    }
  }, [categories, activeMegaCategory, mounted]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, mounted]);

  const handleCategoryHover = (category: Category) => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    setActiveMegaCategory(category);
  };

  const handleCategoryLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => setCategoryOpen(false), 200);
  };

  const getCategoryName = (category: Category) => language === 'bn' ? category.nameBn : category.name;
  const getSubCategoryName = (subcategory: SubCategory) => language === 'bn' ? subcategory.nameBn : subcategory.name;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileCategoryOpen(false);
    setMobileActiveCategory(null);
  };

  const handleMobileMainCategoryClick = (category: Category) => {
    if (category.subCategories && category.subCategories.length > 0) {
      setMobileActiveCategory(category);
    } else {
      window.location.href = `/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(category.slug)}`;
      closeMobileMenu();
    }
  };


  const handleLogout = () => signOut({ callbackUrl: "/login" });

  const accountMenuItems = [
    {
      label: language === 'bn' ? "ড্যাশবোর্ড" : "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/my-account/dashboard",
    },
    {
      label: language === 'bn' ? "আমার প্রোফাইল" : "My Profile",
      icon: <UserCircle className="h-4 w-4" />,
      href: "/my-account/account-details",
    },
    {
      label: language === 'bn' ? "উইশলিস্ট" : "Wishlist",
      icon: <Heart className="h-4 w-4" />,
      href: "/my-account/wishlist",
    },
    {
      label: language === 'bn' ? "তুলনা করুন" : "Compare",
      icon: <GitCompare className="h-4 w-4" />,
      href: "/my-account/compare",
    },
    {
      label: language === 'bn' ? "সেটিংস" : "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/my-account/settings",
    },
  ];

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="h-8 w-8 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="hidden lg:block h-10 w-80 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-lg shadow-gray-100/50" : ""}`}
        style={{
          backgroundColor: backgroundColor,
          borderBottom: `1px solid ${borderColor}`
        }}
        suppressHydrationWarning
      >
        <div
          className={`container mx-auto flex items-center justify-between gap-6 px-6 transition-all duration-300 ${isScrolled
            ? "py-3 md:py-3"
            : "py-0 lg:py-5"
            }`}
          suppressHydrationWarning
        >
          <div className="flex items-center gap-6">
            {/* Logo */}
            {isScrolled && (
              <Link href={`/${language === 'bn' ? 'bn' : 'en'}`} className="flex-shrink-0 group">
                <span
                  className="text-2xl font-extrabold bg-clip-text text-transparent"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${settings?.gradientEnd || '#f0886a'})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  <Image
                    src={`${settings.logo}`}
                    height={40}
                    width={120}
                    alt={settings.name}
                    className="h-9 w-auto object-contain md:h-10"
                    priority
                  />
                </span>
              </Link>
            )}

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {/* Categories Mega Menu */}
              <div
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={handleCategoryLeave}
                className="relative"
              >
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium transition-all hover:shadow-md hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${settings?.gradientEnd || '#f06a4a'})`
                  }}
                >
                  <Menu className="h-4 w-4" />
                  <span>{language === 'bn' ? 'বিভাগ' : 'Categories'}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
                </button>

                {categoryOpen && categories && categories.length > 0 && (
                  <div
                    className="absolute left-0 top-full mt-2 z-40 w-[1000px] rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      backgroundColor: backgroundColor,
                      borderColor: borderColor
                    }}
                  >
                    <div className="grid grid-cols-[280px_1fr]">
                      {/* Left Category List - Black text, hover color */}
                      <div
                        className="py-2 border-r"
                        style={{
                          background: `linear-gradient(to bottom, ${hoverBg}, ${backgroundColor})`,
                          borderRightColor: borderColor
                        }}
                      >
                        {categories.map((item) => {
                          const isActive = activeMegaCategory?.id === item.id;
                          const hasSubCategories = item.subCategories && item.subCategories.length > 0;

                          return (
                            <Link
                              key={item._id}
                              href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(item.slug)}`}
                              onMouseEnter={() => handleCategoryHover(item)}
                              className={`flex items-center justify-between px-5 py-3.5 text-[15px] transition-all duration-200`}
                              style={{
                                backgroundColor: isActive ? backgroundColor : 'transparent',
                                borderLeft: isActive ? `4px solid ${primaryColor}` : '4px solid transparent',
                                color: isActive ? primaryColor : textColor
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-xl flex items-center justify-center transition-all`}>
                                  {item.image && item.image.startsWith("/") ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-6 h-6 object-contain"
                                      style={{ backgroundColor: item.imageBgColor || "transparent" }}
                                    />
                                  ) : (
                                    <Icon
                                      name={item.icon || "ShoppingBag"}
                                      size={22}
                                      color={isActive ? primaryColor : (item.iconColor || "#3B82F6")}
                                    />
                                  )}
                                </div>
                                <span className="font-medium">{getCategoryName(item)}</span>
                              </div>
                              {hasSubCategories && (
                                <ChevronRight className={`h-4 w-4 transition-colors`} style={{ color: isActive ? primaryColor : textMuted }} />
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Right Subcategories */}
                      <div className="p-6" style={{ backgroundColor: backgroundColor }}>
                        <div className="mb-4 pb-3 border-b border-gray-100">
                          <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: textColor }}>
                            <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
                            {getCategoryName(activeMegaCategory!)}
                          </h3>
                          <p className="text-xs mt-1" style={{ color: textMuted }}>
                            {activeMegaCategory?.subCategories?.length || 0} subcategories available
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-x-6 gap-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {activeMegaCategory?.subCategories && activeMegaCategory.subCategories.length > 0 ? (
                            activeMegaCategory.subCategories.map((subcat) => (
                              <Link
                                key={subcat._id}
                                href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(
                                  activeMegaCategory.slug
                                )}/${subcat.slug}`}
                                className="group flex items-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200"
                                style={{ color: textColor }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = hoverBg;
                                  e.currentTarget.style.color = primaryColor;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = textColor;
                                }}
                              >
                                <div className="w-4 h-4 rounded-lg bg-gray-100 group-hover:bg-[#ef553f]/10 flex items-center justify-center transition-colors">
                                  {subcat.image && subcat.image.startsWith("/") ? (
                                    <img
                                      src={subcat.image}
                                      alt={subcat.name}
                                      className="w-6 h-6 object-contain"
                                      style={{ backgroundColor: subcat.imageBgColor || "transparent" }}
                                    />
                                  ) : (
                                    <Icon
                                      name={subcat.icon || "ShoppingBag"}
                                      size={22}
                                      color={subcat.iconColor || "#3B82F6"}
                                    />
                                  )}
                                </div>

                                <span className="text-sm transition-colors">
                                  {getSubCategoryName(subcat)}
                                </span>
                              </Link>
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-12" style={{ color: textMuted }}>
                              <Tag className="h-12 w-12 mx-auto mb-3" style={{ color: borderColor }} />
                              <p>{language === 'bn' ? 'কোন সাবক্যাটাগরি নেই' : 'No subcategories available'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links - Black text, hover color */}
              <div className="flex items-center gap-1">
                {[
                  { href: "/", label: language === 'bn' ? 'হোম' : 'Home', icon: null },
                  { href: "/categories", label: language === 'bn' ? 'ক্যাটাগরি' : 'Categories', icon: <Tag className="h-3 w-3" />, badge: { text: language === 'bn' ? 'ছাড়' : 'SALE', color: "emerald" } },
                  { href: "/products", label: language === 'bn' ? 'পণ্য' : 'Products', icon: null, badge: { text: language === 'bn' ? 'হট' : 'HOT', color: "pink" } },
                  { href: "/offers", label: language === 'bn' ? 'সেরা ডিল' : 'Top Deals', icon: <TrendingUp className="h-3 w-3" /> },
                  { href: "/new-arrival", label: language === 'bn' ? 'নতুন আগমন' : 'New Arrival', icon: <Clock className="h-3 w-3" />, badge: { text: language === 'bn' ? 'নতুন' : 'NEW', color: "emerald" } },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={`/${language === 'bn' ? 'bn' : 'en'}${item.href === "/" ? "" : item.href}`}
                    className="group relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                    style={{ color: textColor }}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && (
                      <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-${item.badge.color === "emerald" ? "emerald" : "pink"}-100 text-${item.badge.color === "emerald" ? "emerald" : "pink"}-700`}>
                        {item.badge.text}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Icons */}
          {isScrolled && (
            <>
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  {/* Desktop Search */}
                  <div className="hidden lg:block relative">
                    <input
                      type="text"
                      placeholder={language === 'bn' ? "পণ্য খুঁজুন..." : "Search products..."}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-80 rounded-full px-5 py-2.5 pl-11 text-sm outline-none transition-all duration-200"
                      style={{
                        border: `1px solid ${borderColor}`,
                        backgroundColor: hoverBg,
                        color: textColor
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.backgroundColor = backgroundColor;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.backgroundColor = hoverBg;
                      }}
                    />
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: textMuted }} />
                  </div>

                  {/* Mobile Search Toggle */}
                  <button
                    className="lg:hidden p-2 rounded-full transition-all"
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    aria-label="Search"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.color = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    <Search size={20} />
                  </button>

                  {/* User / Account */}
                  {session?.user ? (
                    <div className="relative" ref={accountRef}>
                      <button
                        onClick={() => setAccountOpen((v) => !v)}
                        className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
                        style={{
                          borderColor: borderColor,
                          backgroundColor: cardBackground,
                          color: textColor
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = primaryColor;
                          e.currentTarget.style.color = primaryColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = borderColor;
                          e.currentTarget.style.color = textColor;
                        }}
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline max-w-[90px] truncate">
                          {session.user.name?.split(" ")[0] || (language === 'bn' ? 'আমার অ্যাকাউন্ট' : 'My Account')}
                        </span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {accountOpen && (
                        <div
                          className="absolute right-0 top-full mt-2 z-60 w-52 rounded-xl border py-2 shadow-xl"
                          style={{
                            borderColor: borderColor,
                            backgroundColor: backgroundColor
                          }}
                        >
                          <div className="border-b px-4 pb-3 pt-1" style={{ borderColor: borderColor }}>
                            <p className="text-xs" style={{ color: textMuted }}>{language === 'bn' ? 'সাইন ইন করেছেন' : 'Signed in as'}</p>
                            <p className="truncate text-sm font-semibold" style={{ color: textColor }}>
                              {session.user.name}
                            </p>
                            <p className="truncate text-xs" style={{ color: textMuted }}>
                              {session.user.email}
                            </p>
                          </div>

                          <div className="py-1">
                            {accountMenuItems.map((item) => (
                              <Link
                                key={item.href}
                                href={language === 'bn' ? `/bn${item.href}` : item.href}
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                                style={{ color: textColor }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                                  e.currentTarget.style.color = primaryColor;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = textColor;
                                }}
                              >
                                <span style={{ color: textMuted }}>{item.icon}</span>
                                {item.label}
                              </Link>
                            ))}
                          </div>

                          <div className="border-t pt-1" style={{ borderColor: borderColor }}>
                            <button
                              onClick={() => {
                                setAccountOpen(false);
                                handleLogout();
                              }}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                              style={{ color: '#EF4444' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <LogOut className="h-4 w-4" />
                              {language === 'bn' ? 'লগআউট' : 'Logout'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={language === 'bn' ? "/bn/login" : "/login"}
                      className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
                      style={{
                        borderColor: borderColor,
                        backgroundColor: cardBackground,
                        color: textColor
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.color = textColor;
                      }}
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{language === 'bn' ? 'লগইন / রেজিস্টার' : 'Login / Register'}</span>
                    </Link>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={onWishlistClick}
                    className="relative p-2 rounded-full transition-all group"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.color = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    <Heart size={20} />
                    {wishlist.length > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    onClick={openCart}
                    className="relative p-2 rounded-full transition-all group"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.color = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    <ShoppingBag size={20} />
                    <span
                      className="absolute -top-1 -right-1 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {cart?.length || 0}
                    </span>
                  </button>

                </div>
                {/* Mobile Menu */}
                <button
                  className="lg:hidden p-2 rounded-full transition-all"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                  style={{ color: textColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverBg;
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-6 pb-4 animate-in slide-in-from-top duration-200">
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder={language === 'bn' ? "পণ্য খুঁজুন..." : "Search products..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full px-5 py-3 pl-11 text-sm outline-none transition-all"
                style={{
                  border: `1px solid ${borderColor}`,
                  backgroundColor: hoverBg,
                  color: textColor
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
                onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: textMuted }} />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={closeMobileMenu}
          />

          <div
            ref={drawerRef}
            className="relative z-10 flex h-full w-[320px] max-w-[85vw] flex-col shadow-2xl animate-in slide-in-from-left duration-300"
            style={{ backgroundColor: backgroundColor }}
          >
            <div className="relative overflow-hidden px-5 py-6" style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${settings?.gradientEnd || '#f06a4a'})`
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              <div className="relative">
                <span className="text-2xl font-bold text-white">AmarShop</span>
                <p className="text-white/80 text-xs mt-1">
                  {language === 'bn' ? 'স্বাগতম!' : 'Welcome!'}
                </p>
              </div>
              <button
                onClick={closeMobileMenu}
                className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {mobileCategoryOpen && mobileActiveCategory ? (
                <div>
                  <button
                    onClick={() => {
                      setMobileCategoryOpen(false);
                      setMobileActiveCategory(null);
                    }}
                    className="flex w-full items-center gap-2 px-5 py-4 text-sm font-medium border-b"
                    style={{ color: primaryColor, borderBottomColor: borderColor }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {language === 'bn' ? 'ক্যাটাগরিতে ফিরুন' : 'Back to Categories'}
                  </button>

                  <div className="px-5 py-4">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>
                      {getCategoryName(mobileActiveCategory)}
                    </p>
                    <div className="space-y-1">
                      {mobileActiveCategory.subCategories &&
                        mobileActiveCategory.subCategories.length > 0 ? (
                        mobileActiveCategory.subCategories.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(
                              mobileActiveCategory.slug
                            )}/${sub.slug}`}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all"
                            style={{ color: textColor }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = hoverBg;
                              e.currentTarget.style.color = primaryColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = textColor;
                            }}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: hoverBg }}>
                              <Gift className="h-4 w-4" style={{ color: textMuted }} />
                            </div>
                            {getSubCategoryName(sub)}
                          </Link>
                        ))
                      ) : (
                        <p className="py-8 text-center text-sm" style={{ color: textMuted }}>
                          {language === 'bn' ? 'কোন সাবক্যাটাগরি নেই' : 'No subcategories'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : mobileCategoryOpen ? (
                <div>
                  <button
                    onClick={() => setMobileCategoryOpen(false)}
                    className="flex w-full items-center gap-2 px-5 py-4 text-sm font-medium border-b"
                    style={{ color: primaryColor, borderBottomColor: borderColor }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {language === 'bn' ? 'পিছনে' : 'Back'}
                  </button>
                  <div className="divide-y" style={{ divideColor: borderColor }}>
                    {categories?.map((cat) => (
                      <div key={cat._id}>
                        {cat.subCategories && cat.subCategories.length > 0 ? (
                          <button
                            onClick={() => setMobileActiveCategory(cat)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm transition-all"
                            style={{ color: textColor }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = hoverBg;
                              e.currentTarget.style.color = primaryColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = textColor;
                            }}
                          >
                            <span className="font-medium">{getCategoryName(cat)}</span>
                            <ChevronRight className="h-4 w-4" style={{ color: textMuted }} />
                          </button>
                        ) : (
                          <Link
                            href={`/${language === 'bn' ? 'bn' : 'en'}/categories/${encodeURIComponent(cat.slug)}`}
                            onClick={closeMobileMenu}
                            className="flex w-full items-center justify-between px-5 py-4 text-sm transition-all"
                            style={{ color: textColor }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = hoverBg;
                              e.currentTarget.style.color = primaryColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = textColor;
                            }}
                          >
                            <span className="font-medium">{getCategoryName(cat)}</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y" style={{ divideColor: borderColor }}>
                  <button
                    onClick={() => setMobileCategoryOpen(true)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition-all group"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.color = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    <span className="flex items-center gap-3 font-medium">
                      <Menu className="h-5 w-5" style={{ color: primaryColor }} />
                      {language === 'bn' ? 'বিভাগ' : 'Categories'}
                    </span>
                    <ChevronRight className="h-4 w-4" style={{ color: textMuted }} />
                  </button>

                  {[
                    { href: "/", label: language === 'bn' ? 'হোম' : 'Home' },
                    { href: "/categories", label: language === 'bn' ? 'ক্যাটাগরি' : 'Categories', badge: { text: language === 'bn' ? 'ছাড়' : 'SALE', color: "emerald" } },
                    { href: "/products", label: language === 'bn' ? 'পণ্য' : 'Products', badge: { text: language === 'bn' ? 'হট' : 'HOT', color: "pink" } },
                    { href: "/offers", label: language === 'bn' ? 'সেরা ডিল' : 'Top Deals' },
                    { href: "/new-arrival", label: language === 'bn' ? 'নতুন আগমন' : 'New Arrival', badge: { text: language === 'bn' ? 'নতুন' : 'NEW', color: "emerald" } },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={`/${language === 'bn' ? 'bn' : 'en'}${item.href === "/" ? "" : item.href}`}
                      onClick={closeMobileMenu}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition-all group"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = hoverBg;
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = textColor;
                      }}
                    >
                      <span className="flex items-center gap-3 font-medium">
                        {item.label}
                        {item.badge && (
                          <span className={`ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-${item.badge.color === "emerald" ? "emerald" : "pink"}-100 text-${item.badge.color === "emerald" ? "emerald" : "pink"}-700`}>
                            {item.badge.text}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t px-5 py-5" style={{ borderTopColor: borderColor, backgroundColor: hoverBg }}>
              <button
                className="flex w-full items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all"
                style={{ color: textColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = backgroundColor;
                  e.currentTarget.style.color = primaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = textColor;
                }}
              >
                <User className="h-5 w-5" />
                {language === 'bn' ? 'আমার অ্যাকাউন্ট' : 'My Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${borderColor};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${primaryColor};
          border-radius: 10px;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-from-left {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out;
        }
        .slide-in-from-top-2 {
          animation: slide-in-from-top 0.2s ease-out;
        }
        .slide-in-from-left {
          animation: slide-in-from-left 0.3s ease-out;
        }
      `}</style>
    </>
  );
};