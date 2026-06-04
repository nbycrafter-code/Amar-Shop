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
}

export const Breadcrumb = ({ product, classname = "" }: BreadcrumbProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // ✅ যদি product না থাকে তাহলে কিছু রেন্ডার করবেন না
  if (!product) {
    return null;
  }

  return (
    <div className={`py-2 ${classname}`}>
      <div className="container w-full mx-auto px-4">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          {/* হোম লিংক */}
          <Link
            href="/"
            className="hover:text-orange-500 cursor-pointer transition-colors duration-200"
          >
            {isBn ? "হোম" : "Home"}
          </Link>

          {/* ক্যাটাগরি */}
          {product.categoryId && product.categoryName && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Link
                href={`/categories/${product.categorySlug}`}
                className="hover:text-orange-500 cursor-pointer transition-colors duration-200"
              >
                {isBn ? product.categoryNameBn || product.categoryName : product.categoryName}
              </Link>
            </>
          )}

          {/* সাবক্যাটাগরি */}
          {product.subCategoryId && product.subCategoryName && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Link
                href={`/categories/${product.categorySlug}/${product.subCategorySlug}`}
                className="hover:text-orange-500 cursor-pointer transition-colors duration-200"
              >
                {isBn ? product.subCategoryNameBn || product.subCategoryName : product.subCategoryName}
              </Link>
            </>
          )}

          {/* কারেন্ট পেজ (প্রোডাক্ট নাম) */}
          {(product.name || product.nameBn) && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700 font-medium">
                {isBn ? product.nameBn || product.name : product.name}
              </span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};