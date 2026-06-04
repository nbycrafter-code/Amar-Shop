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
  
  // স্পেসকে হাইফেনে রূপান্তর
  let slug = text.trim();
  slug = slug.replace(/\s+/g, '-');
  
  // URL এনকোডিং (বাংলা ক্যারেক্টার support এর জন্য)
  return encodeURIComponent(slug);
};

// ডিকোডিং ফাংশন
const decodeBengaliText = (encodedText) => {
  if (!encodedText) return '';
  
  try {
    // ডিকোড URL
    let decoded = decodeURIComponent(encodedText);
    // হাইফেন আবার স্পেসে রূপান্তর
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

  const accountRef = useRef(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  // Sync URL params → state (বাংলা support সহ)
  useEffect(() => {
    if (pathname === "/products" || pathname === "/bn/products") {
      const categoryFromUrl = searchParams.get("category");
      const searchFromUrl = searchParams.get("search");
      
      setSelectedCategory(categoryFromUrl || "All");
      
      // বাংলা টেক্সট ডিকোড করা
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
    
    // ক্যাটাগরি অ্যাড করা
    if (selectedCategory !== "All") {
      params.append("category", selectedCategory);
    }
    
    // সার্চ টেক্সট এনকোড করা
    if (searchText.trim()) {
      const slug = getBengaliSlug(searchText.trim());
      params.append("search", slug);
    }
    
    // লোকাল চেক করে রাউট করা
    const isBengali = pathname.split('/')[1] === 'bn';
    if (isBengali) {
      router.push(`/bn/products?${params.toString()}`);
    } else {
      router.push(`/products?${params.toString()}`);
    }
    
    setMobileSearchOpen(false);
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

  return (
    <div className="bg-white shadow-sm">
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
            className="hidden md:flex flex-1 max-w-[560px] items-center overflow-hidden rounded border border-gray-300 bg-white"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-r border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none"
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
              dir={language === 'bn' ? "auto" : "ltr"}
            />
            <button
              type="submit"
              className="bg-[#ef553f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d94535] transition-colors"
            >
              {language === 'bn' ? 'খুঁজুন' : 'Search'}
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-700">
            {/* Mobile: Search toggle */}
            <button
              className="md:hidden text-gray-600 hover:text-[#ef553f] transition-colors"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
            >
              {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Phone — hidden on small screens */}
            <div className="hidden lg:flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{language === 'bn' ? 'প্রয়োজন হলে কল করুন' : 'Need Help?'}</p>
                <p className="font-semibold">{settings?.phone}</p>
              </div>
            </div>

            {/* Account dropdown / Login */}
            {session?.user ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[#ef553f] hover:text-[#ef553f] transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[90px] truncate">
                    {session.user.name?.split(" ")[0] || (language === 'bn' ? 'আমার অ্যাকাউন্ট' : 'My Account')}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                    {/* User info */}
                    <div className="border-b border-gray-100 px-4 pb-3 pt-1">
                      <p className="text-xs text-gray-500">{language === 'bn' ? 'সাইন ইন করেছেন' : 'Signed in as'}</p>
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {session.user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {accountMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={language === 'bn' ? `/bn${item.href}` : item.href}
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ef553f] transition-colors"
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
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
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[#ef553f] hover:text-[#ef553f] transition-all"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'bn' ? 'লগইন / রেজিস্টার' : 'Login / Register'}</span>
              </Link>
            )}

            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="relative text-gray-600 hover:text-red-500 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ef553f] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 hover:border-[#ef553f] hover:text-[#ef553f] transition-all"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4 text-gray-400" />
              <span className="hidden sm:inline text-sm font-medium">
                {taka(total)}
              </span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ef553f] text-[10px] font-bold text-white">
                {cart.length}
              </span>
            </button>
          </div>
        </div>

        {/* ── Mobile Search Bar (expandable) ── */}
        {mobileSearchOpen && (
          <form
            onSubmit={onSearch}
            className="mt-3 flex md:hidden items-center overflow-hidden rounded border border-gray-300 bg-white"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-r border-gray-300 bg-white px-2 py-2.5 text-xs text-gray-600 outline-none max-w-[110px]"
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
              dir={language === 'bn' ? "auto" : "ltr"}
            />
            <button
              type="submit"
              className="bg-[#ef553f] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {language === 'bn' ? 'যাও' : 'Go'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};