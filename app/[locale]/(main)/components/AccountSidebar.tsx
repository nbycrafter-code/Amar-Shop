"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Download,
  MapPin,
  UserCog,
  GitCompareArrows,
  Heart,
  LogOut,
  ChevronDown,
  ChevronUp,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface MenuItem {
  key: string;
  labelEn: string;
  labelBn: string;
  icon: LucideIcon;
}

interface MenuItemWithLang extends MenuItem {
  label: string;
}

interface User {
  name?: string;
  image?: string;
  email?: string;
}

interface AccountSidebarProps {
  user?: User;
}

const menuItems: MenuItem[] = [
  { key: "dashboard", labelEn: "Dashboard", labelBn: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { key: "orders", labelEn: "Orders", labelBn: "অর্ডার", icon: ShoppingBag },
  { key: "downloads", labelEn: "Downloads", labelBn: "ডাউনলোড", icon: Download },
  { key: "addresses", labelEn: "Addresses", labelBn: "ঠিকানা", icon: MapPin },
  { key: "account-details", labelEn: "Account Details", labelBn: "অ্যাকাউন্ট বিবরণ", icon: UserCog },
  { key: "compare", labelEn: "Compare", labelBn: "তুলনা করুন", icon: GitCompareArrows },
  { key: "wishlist", labelEn: "Wishlist", labelBn: "উইশলিস্ট", icon: Heart },
];

export default function AccountSidebar({ user = {} }: AccountSidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [mobileOpen, setMobileOpen] = useState(false);

  const activePage = pathname?.split("/").pop() || "dashboard";
  
  const getMenuItem = (item: MenuItem): MenuItemWithLang => {
    return {
      ...item,
      label: isBn ? item.labelBn : item.labelEn
    };
  };

  const menuItemsWithLang: MenuItemWithLang[] = menuItems.map(getMenuItem);
  const activeItem = menuItemsWithLang.find((m) => m.key === activePage) ?? menuItemsWithLang[0];
  const ActiveIcon = activeItem.icon;

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  const getUserInitial = (): string => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return isBn ? "ই" : "U";
  };

  const getUserName = (): string => {
    if (user?.name) {
      return user.name;
    }
    return isBn ? "ব্যবহারকারী" : "User";
  };

  const getMyAccountText = (): string => {
    return isBn ? "আমার অ্যাকাউন্ট" : "My Account";
  };

  const getLogoutText = (): string => {
    return isBn ? "লগআউট" : "Logout";
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-60 lg:w-64 flex-shrink-0 flex-col gap-0">
        {/* Avatar card */}
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          {user?.image ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md">
              <Image
                src={user.image}
                alt="Profile"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ef553f] to-[#f97316] text-white font-bold text-lg shadow">
              {getUserInitial()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{getUserName()}</p>
            <p className="text-xs text-gray-400">{getMyAccountText()}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {menuItemsWithLang.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <Link
                key={item.key}
                href={`/my-account/${item.key}`}
                className={`group flex items-center gap-3 border-b border-gray-100 px-4 py-3 text-sm transition-all last:border-b-0 ${
                  isActive
                    ? "border-l-4 border-l-[#ef553f] bg-red-50 font-semibold text-[#ef553f]"
                    : "border-l-4 border-l-transparent text-gray-600 hover:border-l-[#ef553f] hover:bg-gray-50 hover:text-[#ef553f]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 transition-colors ${
                    isActive ? "text-[#ef553f]" : "text-gray-400 group-hover:text-[#ef553f]"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-red-500 transition-colors" />
            {getLogoutText()}
          </button>
        </nav>
      </aside>

      {/* MOBILE DROPDOWN */}
      <div className="md:hidden mb-4 w-full">
        {/* Trigger button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            {user?.image ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md">
                <Image
                  src={user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ef553f] text-white font-bold text-sm">
                {getUserInitial()}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ActiveIcon className="h-4 w-4 text-[#ef553f]" />
              {activeItem.label}
            </div>
          </div>
          {mobileOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* Dropdown menu */}
        {mobileOpen && (
          <nav className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {menuItemsWithLang.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.key;
              return (
                <Link
                  key={item.key}
                  href={`/my-account/${item.key}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 border-b border-gray-100 px-4 py-3 text-sm transition-all last:border-b-0 ${
                    isActive
                      ? "bg-red-50 font-semibold text-[#ef553f]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#ef553f]"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      isActive ? "text-[#ef553f]" : "text-gray-400"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {getLogoutText()}
            </button>
          </nav>
        )}
      </div>
    </>
  );
}