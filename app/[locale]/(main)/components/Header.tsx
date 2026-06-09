"use client";

import { taka } from "@/utils/currency";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Phone,
  Settings,
  ShoppingCart,
  User,
  UserCircle,
  ChevronDown,
  Search,
  X,
  GitCompare,
  Menu,
  ChevronRight,
  ChevronLeft,
  Gift,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";



// বাংলা জন্য slug ফাংশন
const getBengaliSlug = (text) => {
  if (!text) return '';

  let slug = text.trim();
  slug = slug.replace(/\s+/g, '-');
  return encodeURIComponent(slug);
};

// ডিকোডিং ফাংশন
const decodeBengaliText = (encodedText) => {
  if (!encodedText) return '';

  try {
    let decoded = decodeURIComponent(encodedText);
    decoded = decoded.replace(/-/g, ' ');
    return decoded;
  } catch (error) {
    console.error("Decoding error:", error);
    return '';
  }
};

export const Header = ({
  session,
  settings,
  categories,
  openCart,
  wishlistCount,
  onWishlistClick,
}) => {
  const { cart, setSearch } = useApp();
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accountRef = useRef(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const backgroundColor = settings?.headerBackground || settings?.backgroundColor || "#FFFFFF";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBackground = settings?.cardBackground || "#FFFFFF";
  const textMuted = settings?.textMuted || "#6B7280";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Sync URL params → state (বাংলা support সহ)
  useEffect(() => {
    if (pathname === "/products" || pathname === "/bn/products") {
      const categoryFromUrl = searchParams.get("category");
      const searchFromUrl = searchParams.get("search");

      setSelectedCategory(categoryFromUrl || "All");

      if (searchFromUrl) {
        const decodedText = decodeBengaliText(searchFromUrl);
        setSearchText(decodedText);
      } else {
        setSearchText("");
      }
    }
  }, [pathname, searchParams]);

  // সার্চ ফাংশন (বাংলা support সহ)
  const onSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }

    if (searchText.trim()) {
      const slug = getBengaliSlug(searchText.trim());
      params.append("search", slug);
    }

    const isBengali = pathname.split('/')[1] === 'bn';
    if (isBengali) {
      router.push(`/bn/products?${params.toString()}`);
    } else {
      router.push(`/products?${params.toString()}`);
    }

    setMobileSearchOpen(false);
  };

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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

  const drawerRef = useRef<HTMLDivElement>(null);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const getCategoryName = (category) => language === 'bn' ? category.nameBn : category.name;
  const getSubCategoryName = (subcategory) => language === 'bn' ? subcategory.nameBn : subcategory.name;

  return (
    <>
      <div
        className="shadow-sm"
        style={{
          backgroundColor: backgroundColor,
          borderBottom: `1px solid ${borderColor}`
        }}
      >
        <div className="container mx-auto w-full px-4 py-3 md:py-5">
          {/* ── Main Row ── */}
          <div className="flex w-full items-center justify-between gap-3 md:gap-6">
            {/* Logo */}
            <Link href={language === 'bn' ? "/bn" : "/"} className="flex-shrink-0">
              <Image
                src={`${settings.logo}`}
                height={40}
                width={120}
                alt={settings.name}
                className="h-9 w-auto object-contain md:h-10"
                priority
              />
            </Link>

            {/* Search bar — hidden on mobile, visible md+ */}
            <form
              onSubmit={onSearch}
              className="hidden md:flex flex-1 max-w-[560px] items-center overflow-hidden rounded border bg-white"
              style={{ borderColor: borderColor }}
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-r bg-white px-3 py-2.5 text-sm outline-none"
                style={{
                  borderRightColor: borderColor,
                  color: textColor
                }}
              >
                <option value="All">{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {language === 'bn' ? c.nameBn : c.name}
                  </option>
                ))}
              </select>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={language === 'bn' ? "পণ্য খুঁজুন (যেমন: শার্ট, প্যান্ট)..." : "Search products (e.g: shirt, pant)..."}
                className="min-w-0 flex-1 px-4 py-2.5 text-sm outline-none"
                style={{ color: textColor }}
                dir={language === 'bn' ? "auto" : "ltr"}
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.buttonPrimaryHover || primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              >
                {language === 'bn' ? 'খুঁজুন' : 'Search'}
              </button>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-3 sm:gap-4 text-sm" style={{ color: textColor }}>
              {/* Mobile: Search toggle */}
              <button
                className="md:hidden transition-colors"
                onClick={() => setMobileSearchOpen((v) => !v)}
                aria-label="Search"
                style={{ color: textColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = textColor}
              >
                {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {/* Phone — hidden on small screens */}
              <div className="hidden lg:flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: borderColor }} />
                <div>
                  <p className="text-xs" style={{ color: textMuted }}>{language === 'bn' ? 'প্রয়োজন হলে কল করুন' : 'Need Help?'}</p>
                  <p className="font-semibold" style={{ color: textColor }}>{settings?.phone}</p>
                </div>
              </div>

              {/* Account dropdown / Login */}
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
                className="relative transition-colors"
                aria-label="Wishlist"
                style={{ color: textColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = textColor}
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              {/* <button
                onClick={openCart}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all"
                aria-label="Cart"
                style={{
                  borderColor: borderColor,
                  backgroundColor: cardBackground
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
                <ShoppingCart className="h-4 w-4" style={{ color: borderColor }} />
                <span className="hidden sm:inline text-sm font-medium" style={{ color: textColor }}>
                  {taka(total)}
                </span>
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {cart.length}
                </span>
              </button> */}
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


              {/* Mobile Menu Button */}
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
          </div>

          {/* ── Mobile Search Bar (expandable) ── */}
          {mobileSearchOpen && (
            <form
              onSubmit={onSearch}
              className="mt-3 flex md:hidden items-center overflow-hidden rounded border bg-white"
              style={{ borderColor: borderColor }}
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-r bg-white px-2 py-2.5 text-xs outline-none max-w-[110px]"
                style={{
                  borderRightColor: borderColor,
                  color: textColor
                }}
              >
                <option value="All">{language === 'bn' ? 'সব' : 'All'}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {language === 'bn' ? c.nameBn : c.name}
                  </option>
                ))}
              </select>
              <input
                autoFocus
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={language === 'bn' ? "পণ্য খুঁজুন..." : "Search products..."}
                className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none"
                style={{ color: textColor }}
                dir={language === 'bn' ? "auto" : "ltr"}
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {language === 'bn' ? 'যাও' : 'Go'}
              </button>
            </form>
          )}
        </div>
      </div>

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
    </>
  );
};