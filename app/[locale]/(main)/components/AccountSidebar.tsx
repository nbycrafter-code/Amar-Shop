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
  settings?: any; // settings prop যোগ করা হলো
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

export default function AccountSidebar({ user = {}, settings = {} }: AccountSidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [mobileOpen, setMobileOpen] = useState(false);

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.cardBackground || "#FFFFFF";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const gradientStart = settings?.gradientStart || "#ef553f";
  const gradientEnd = settings?.gradientEnd || "#f97316";

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
        <div 
          className="mb-5 flex items-center gap-3 rounded-xl border px-4 py-4 shadow-sm"
          style={{ 
            borderColor: borderColor,
            backgroundColor: backgroundColor
          }}
        >
          {user?.image ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${gradientEnd})`
              }}
            >
              <Image
                src={user.image}
                alt="Profile"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white font-bold text-lg shadow"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${gradientEnd})`
              }}
            >
              {getUserInitial()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: textColor }}>{getUserName()}</p>
            <p className="text-xs" style={{ color: textMuted }}>{getMyAccountText()}</p>
          </div>
        </div>

        {/* Nav */}
        <nav 
          className="overflow-hidden rounded-xl border shadow-sm"
          style={{ 
            borderColor: borderColor,
            backgroundColor: backgroundColor
          }}
        >
          {menuItemsWithLang.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <Link
                key={item.key}
                href={`/my-account/${item.key}`}
                className={`group flex items-center gap-3 border-b px-4 py-3 text-sm transition-all last:border-b-0`}
                style={{
                  borderBottomColor: borderColor,
                  borderLeft: isActive ? `4px solid ${primaryColor}` : `4px solid transparent`,
                  backgroundColor: isActive ? `${primaryColor}10` : 'transparent',
                  color: isActive ? primaryColor : textMuted,
                  fontWeight: isActive ? '600' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = hoverBg;
                    e.currentTarget.style.color = primaryColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = textMuted;
                  }
                }}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 transition-colors`}
                  style={{ color: isActive ? primaryColor : textMuted }}
                />
                {item.label}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 border-t px-4 py-3 text-sm transition-all"
            style={{ 
              borderTopColor: borderColor,
              color: '#EF4444'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut className="h-4 w-4 flex-shrink-0 transition-colors" style={{ color: '#EF4444' }} />
            {getLogoutText()}
          </button>
        </nav>
      </aside>

      {/* MOBILE DROPDOWN */}
      <div className="md:hidden mb-4 w-full">
        {/* Trigger button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border px-4 py-3 shadow-sm"
          style={{ 
            borderColor: borderColor,
            backgroundColor: backgroundColor
          }}
        >
          <div className="flex items-center gap-2.5">
            {user?.image ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${gradientEnd})`
                }}
              >
                <Image
                  src={user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${gradientEnd})`
                }}
              >
                {getUserInitial()}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: textColor }}>
              <ActiveIcon className="h-4 w-4" style={{ color: primaryColor }} />
              {activeItem.label}
            </div>
          </div>
          {mobileOpen ? (
            <ChevronUp className="h-4 w-4" style={{ color: textMuted }} />
          ) : (
            <ChevronDown className="h-4 w-4" style={{ color: textMuted }} />
          )}
        </button>

        {/* Dropdown menu */}
        {mobileOpen && (
          <nav 
            className="mt-1 overflow-hidden rounded-xl border shadow-lg"
            style={{ 
              borderColor: borderColor,
              backgroundColor: backgroundColor
            }}
          >
            {menuItemsWithLang.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.key;
              return (
                <Link
                  key={item.key}
                  href={`/my-account/${item.key}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 border-b px-4 py-3 text-sm transition-all last:border-b-0`}
                  style={{
                    borderBottomColor: borderColor,
                    backgroundColor: isActive ? `${primaryColor}10` : 'transparent',
                    color: isActive ? primaryColor : textMuted
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.color = primaryColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = textMuted;
                    }
                  }}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0`}
                    style={{ color: isActive ? primaryColor : textMuted }}
                  />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="flex w-full items-center gap-3 border-t px-4 py-3 text-sm transition-colors"
              style={{ 
                borderTopColor: borderColor,
                color: '#EF4444'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" style={{ color: '#EF4444' }} />
              {getLogoutText()}
            </button>
          </nav>
        )}
      </div>
    </>
  );
}