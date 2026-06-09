"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface BreadcrumbProps {
  product: {
    name?: string;
    nameBn?: string;
    categoryId?: string;
    categoryName?: string;
    categoryNameBn?: string;
    subCategoryId?: string;
    subCategoryName?: string;
    subCategoryNameBn?: string;
    slug?: string;
    slugBn?: string;
  };
  classname?: string;
  settings?: any; // settings prop যোগ করা হলো
}

export const Breadcrumb = ({ product, classname = "", settings = {} }: BreadcrumbProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";

  // যদি product না থাকে তাহলে কিছু রেন্ডার করবেন না
  if (!product) {
    return null;
  }

  return (
    <div className={`py-2 ${classname}`}>
      <div className="container w-full mx-auto px-4">
        <nav className="text-sm" style={{ color: textMuted }} aria-label="Breadcrumb">
          {/* হোম লিংক */}
          <Link
            href="/"
            className="transition-colors duration-200"
            style={{ color: textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
          >
            {isBn ? "হোম" : "Home"}
          </Link>

          {/* ক্যাটাগরি */}
          {product.categoryId && product.categoryName && (
            <>
              <span className="mx-2" style={{ color: textMuted }}>/</span>
              <Link
                href={`/categories/${product.categorySlug}`}
                className="transition-colors duration-200"
                style={{ color: textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
              >
                {isBn ? product.categoryNameBn || product.categoryName : product.categoryName}
              </Link>
            </>
          )}

          {/* সাবক্যাটাগরি */}
          {product.subCategoryId && product.subCategoryName && (
            <>
              <span className="mx-2" style={{ color: textMuted }}>/</span>
              <Link
                href={`/categories/${product.categorySlug}/${product.subCategorySlug}`}
                className="transition-colors duration-200"
                style={{ color: textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
              >
                {isBn ? product.subCategoryNameBn || product.subCategoryName : product.subCategoryName}
              </Link>
            </>
          )}

          {/* কারেন্ট পেজ (প্রোডাক্ট নাম) */}
          {(product.name || product.nameBn) && (
            <>
              <span className="mx-2" style={{ color: textMuted }}>/</span>
              <span className="font-medium" style={{ color: textColor }}>
                {isBn ? product.nameBn || product.name : product.name}
              </span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};