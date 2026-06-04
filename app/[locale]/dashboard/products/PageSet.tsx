// PageSet.tsx
"use client";
import React, { useState } from "react";
import { Product, Category, Brand, Size, Color } from "../data/initialData";
import TableList from "./components/TableList";
import { useLanguage } from '@/context/LanguageContext';
import Link from "next/link";
import { Plus } from "lucide-react";

interface PageSetProps {
  productsResponse: Product[];
  categoriesResponse: Category[];
  brandsResponse: Brand[];
  sizesResponse: Size[];
  colorsResponse: Color[];
}

export const PageSet: React.FC<PageSetProps> = ({
  products,
}) => {
  const { language } = useLanguage(); // ✅ যোগ করুন


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {language === 'bn' ? "ক্যাটাগরি সমূহ" : "Categories Management"}
          </h1>
          <p className="text-sm text-slate-500">
            {language === 'bn'
              ? "আপনার দোকানের সব পণ্যের শ্রেণীবিভাগ ও লিস্ট"
              : "Create, view, and organize product categories"}
          </p>
        </div>
        <div className="relative flex justify-end flex-1 sm:flex-initial sm:w-64">
          <Link href={`/dashboard/products/add`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition text-sm flex-inline"
          >
            <Plus className="w-4 h-4" />
            {language === 'bn' ? "নতুন পণ্য" : "New Product"}
          </Link>
        </div>
      </div>

      <div className="gap-8">
        <TableList
          products={products}
        />
      </div>
    </div>
  );
};