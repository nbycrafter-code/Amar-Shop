"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BreadcrumbItem {
  name: string;
  path: string;
  isLast: boolean;
}

interface AccountBreadcrumbProps {
  customTitle?: string;
  showHomeIcon?: boolean;
  separator?: string;
}

// Route names translations
const routeNamesEn: Record<string, string> = {
  "account": "My Account",
  "orders": "My Orders",
  "order-history": "Order History",
  "wishlist": "Wishlist",
  "settings": "Settings",
  "profile": "Profile Settings",
  "address": "Shipping Address",
  "payment": "Payment Methods",
  "change-password": "Change Password",
  "reviews": "My Reviews",
  "returns": "Returns & Refunds",
  "dashboard": "Dashboard",
  "account-details": "Account Details",
  "compare": "Compare Products"
};

const routeNamesBn: Record<string, string> = {
  "account": "আমার অ্যাকাউন্ট",
  "orders": "আমার অর্ডার",
  "order-history": "অর্ডার ইতিহাস",
  "wishlist": "উইশলিস্ট",
  "settings": "সেটিংস",
  "profile": "প্রোফাইল সেটিংস",
  "address": "শিপিং ঠিকানা",
  "payment": "পেমেন্ট পদ্ধতি",
  "change-password": "পাসওয়ার্ড পরিবর্তন",
  "reviews": "আমার রিভিউ",
  "returns": "রিটার্ন ও রিফান্ড",
  "dashboard": "ড্যাশবোর্ড",
  "account-details": "অ্যাকাউন্ট বিবরণ",
  "compare": "তুলনা করুন"
};

interface PageDescriptions {
  [key: string]: string;
}

const pageDescriptionsEn: PageDescriptions = {
  "My Orders": "Track and manage all your orders in one place",
  "Wishlist": "Your saved favorite products",
  "Settings": "Manage your account preferences",
  "Profile Settings": "Update your personal information",
  "Shipping Address": "Manage your delivery addresses",
  "Payment Methods": "Add or remove payment methods",
  "Change Password": "Update your password for security",
  "My Reviews": "View all your product reviews",
  "Returns & Refunds": "Manage your returns and refunds",
  "Dashboard": "Overview of your account activity",
  "Account Details": "View and edit your account information",
  "Compare Products": "Compare your favorite products"
};

const pageDescriptionsBn: PageDescriptions = {
  "My Orders": "আপনার সব অর্ডার এক জায়গায় ট্র্যাক ও ম্যানেজ করুন",
  "Wishlist": "আপনার সেভ করা প্রিয় পণ্যসমূহ",
  "Settings": "আপনার অ্যাকাউন্ট পছন্দসমূহ ম্যানেজ করুন",
  "Profile Settings": "আপনার ব্যক্তিগত তথ্য আপডেট করুন",
  "Shipping Address": "আপনার ডেলিভারি ঠিকানা ম্যানেজ করুন",
  "Payment Methods": "পেমেন্ট পদ্ধতি যোগ বা সরান",
  "Change Password": "নিরাপত্তার জন্য আপনার পাসওয়ার্ড আপডেট করুন",
  "My Reviews": "আপনার সব পণ্য রিভিউ দেখুন",
  "Returns & Refunds": "আপনার রিটার্ন ও রিফান্ড ম্যানেজ করুন",
  "Dashboard": "আপনার অ্যাকাউন্ট কার্যকলাপের সারাংশ",
  "Account Details": "আপনার অ্যাকাউন্ট তথ্য দেখুন ও সম্পাদনা করুন",
  "Compare Products": "আপনার প্রিয় পণ্য তুলনা করুন"
};

export const AccountBreadcrumb = ({ 
  customTitle, 
  showHomeIcon = true,
  separator = "/"
}: AccountBreadcrumbProps) => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const getRouteName = (segment: string): string => {
    if (isBn) {
      return routeNamesBn[segment] || segment.replace(/-/g, " ").replace(/_/g, " ");
    }
    return routeNamesEn[segment] || segment.replace(/-/g, " ").replace(/_/g, " ");
  };

  const formatText = (text: string): string => {
    if (isBn) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    if (!pathname) return [];
    
    let paths = pathname.split("/").filter(Boolean);
    
    if (paths[0] === "account" && paths.length > 1) {
      paths = paths.slice(1);
    }
    
    if (paths.length === 0) {
      return [{ 
        name: isBn ? "আমার অ্যাকাউন্ট" : "My Account", 
        path: "/my-account/dashboard", 
        isLast: true 
      }];
    }
    
    const items: BreadcrumbItem[] = [];
    let currentPath = "/my-account/dashboard";
    
    paths.forEach((segment, index) => {
      let name = getRouteName(segment);
      name = formatText(name);
      
      items.push({
        name,
        path: currentPath,
        isLast: index === paths.length - 1
      });
    });
    
    return items;
  }, [pathname, isBn]);

  const pageTitle = useMemo((): string => {
    if (customTitle) return customTitle;
    
    if (!pathname) return isBn ? "আমার অ্যাকাউন্ট" : "My Account";
    
    let paths = pathname.split("/").filter(Boolean);
    if (paths[0] === "account" && paths.length > 1) {
      paths = paths.slice(1);
    }
    
    if (paths.length === 0) return isBn ? "আমার অ্যাকাউন্ট" : "My Account";
    
    const lastSegment = paths[paths.length - 1];
    let title = getRouteName(lastSegment);
    title = formatText(title);
    
    return title;
  }, [pathname, customTitle, isBn]);

  const getPageDescription = (): string | null => {
    const descriptions = isBn ? pageDescriptionsBn : pageDescriptionsEn;
    
    if (customTitle) {
      const matchedKey = Object.keys(descriptions).find(
        key => key.toLowerCase() === customTitle.toLowerCase()
      );
      if (matchedKey) return descriptions[matchedKey];
      return null;
    }
    
    const titleMap: Record<string, string> = {
      [isBn ? "আমার অর্ডার" : "My Orders"]: "My Orders",
      [isBn ? "উইশলিস্ট" : "Wishlist"]: "Wishlist",
      [isBn ? "সেটিংস" : "Settings"]: "Settings",
      [isBn ? "প্রোফাইল সেটিংস" : "Profile Settings"]: "Profile Settings",
      [isBn ? "শিপিং ঠিকানা" : "Shipping Address"]: "Shipping Address",
      [isBn ? "পেমেন্ট পদ্ধতি" : "Payment Methods"]: "Payment Methods",
      [isBn ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"]: "Change Password",
      [isBn ? "আমার রিভিউ" : "My Reviews"]: "My Reviews",
      [isBn ? "রিটার্ন ও রিফান্ড" : "Returns & Refunds"]: "Returns & Refunds",
      [isBn ? "ড্যাশবোর্ড" : "Dashboard"]: "Dashboard",
      [isBn ? "অ্যাকাউন্ট বিবরণ" : "Account Details"]: "Account Details",
      [isBn ? "তুলনা করুন" : "Compare Products"]: "Compare Products"
    };
    
    const descriptionKey = titleMap[pageTitle];
    if (descriptionKey && descriptions[descriptionKey]) {
      return descriptions[descriptionKey];
    }
    
    return null;
  };

  const pageDescription = getPageDescription();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 py-8">
      <div className="container w-full mx-auto px-4">
        <nav className="mb-3" aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap justify-center gap-1 text-sm">
            <li className="flex items-center">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                {showHomeIcon && <Home className="w-4 h-4" />}
                {!showHomeIcon && (isBn ? "হোম" : "Home")}
              </Link>
            </li>
            
            {breadcrumbItems.map((item, index) => (
              <li key={item.path} className="flex items-center">
                <span className="mx-2 text-gray-400">
                  {separator === "/" ? "/" : <ChevronRight className="w-3 h-3" />}
                </span>
                {item.isLast ? (
                  <span className="text-gray-700 font-medium">
                    {item.name}
                  </span>
                ) : (
                  <Link 
                    href={item.path} 
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        
        <h1 className="text-md md:text-xl lg:text-2xl font-semibold text-gray-800 text-center">
          {pageTitle}
        </h1>
        
        {pageDescription && (
          <p className="text-center text-gray-500 text-sm mt-2">
            {pageDescription}
          </p>
        )}
      </div>
    </div>
  );
};