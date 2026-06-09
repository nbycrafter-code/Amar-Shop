"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface BreadcrumbProps {
  page: string;
  classname?: string;
  settings?: any; // settings prop যোগ করা হলো
}

export const Breadcrumb = ({ page, classname = "", settings = {} }: BreadcrumbProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";

  const homeText = isBn ? "হোম" : "Home";

  return (
    <div className={`py-2 ${classname}`}>
      <div className="container w-full mx-auto">
        <nav className="text-sm" style={{ color: textMuted }}>
          <Link 
            href="/" 
            className="transition-colors"
            style={{ color: textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
          >
            {homeText}
          </Link>
          <span className="mx-2" style={{ color: textMuted }}>/</span>
          <span style={{ color: textColor }}>
            {page}
          </span>
        </nav>
      </div>
    </div>
  );
};