"use client";
import React, { useState } from "react";
import { Category, initialCategories } from "../data/initialData";
import AddForm from "./components/AddForm";
import TableList from "./components/TableList";
import { useApp } from "../context/AppContext";

interface CategoriesViewProps {
  categories?: Category[];
}

export const PageSet: React.FC<CategoriesViewProps> = ({ categoriesResponse }) => {
  const { isBn } = useApp();
  const [categories, setCategories] = useState<Category[]>(categoriesResponse);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isBn ? "ক্যাটাগরি সমূহ" : "Categories Management"}
          </h1>
          <p className="text-sm text-slate-500">
            {isBn
              ? "আপনার দোকানের সব পণ্যের শ্রেণীবিভাগ ও লিস্ট"
              : "Create, view, and organize product categories"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category Form Component */}
        <AddForm categories={categories} setCategories={setCategories} />

        {/* Categories List Component */}
        <TableList
          categories={categories} setCategories={setCategories}
        />
      </div>
    </div>
  );
};
