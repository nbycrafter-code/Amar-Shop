"use client";
import React, { useState, useEffect } from "react";
import { Category, initialCategories } from "../data/initialData";
import AddForm from "./components/AddForm";
import TableList from "./components/TableList";
import AddSubCategoryForm from "./components/AddSubCategoryForm";
import SubCategoryTableList from "./components/SubCategoryTableList";
import { useLanguage } from '@/context/LanguageContext';

interface CategoriesViewProps {
  categoriesResponse?: Category[];
  subCategoriesResponse?: any[];
}

export const PageSet: React.FC<CategoriesViewProps> = ({
  categoriesResponse = [],
  subCategoriesResponse = []
}) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const [categories, setCategories] = useState<Category[]>(categoriesResponse);
  const [subCategories, setSubCategories] = useState<any[]>(subCategoriesResponse);
  const [activeTab, setActiveTab] = useState<string>("categories");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategory");
      const data = await response.json();
      if (data.success) {
        setSubCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [refreshKey]);

  const handleSubCategorySuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCategoryUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setActiveTab("categories");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };


  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setActiveTab("subcategories");
  };

  const handleCancelEditSubCategory = () => {
    setEditingSubCategory(null);
  };

  const handleSubCategoryUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setEditingSubCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {language === 'bn' ? "ক্যাটাগরি ও সাব-ক্যাটাগরি" : "Categories & Subcategories"}
          </h1>
          <p className="text-sm text-slate-500">
            {language === 'bn'
              ? "আপনার দোকানের সব পণ্যের শ্রেণীবিভাগ ও সাব-শ্রেণীবিভাগ"
              : "Create, view, and organize product categories and subcategories"}
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          <button
            onClick={() => {
              setActiveTab("categories");
              setEditingCategory(null);
            }}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "categories"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {language === 'bn' ? "ক্যাটাগরি সমূহ" : "Categories"}
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
              {categories.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("subcategories");
              setEditingCategory(null);
            }}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "subcategories"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {language === 'bn' ? "সাব-ক্যাটাগরি সমূহ" : "Subcategories"}
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
              {subCategories.length}
            </span>
          </button>
        </nav>
      </div>

      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AddForm
            categories={categories}
            setCategories={setCategories}
            editingCategory={editingCategory}
            onCancelEdit={handleCancelEdit}
            onUpdateSuccess={handleCategoryUpdate}
          />
          <TableList
            categories={categories}
            setCategories={setCategories}
            onEditCategory={handleEditCategory}
          />
        </div>
      )}

      {activeTab === "subcategories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AddSubCategoryForm
            categories={categories}
            onSuccess={handleSubCategorySuccess}
            editingSubCategory={editingSubCategory}
            onCancelEdit={handleCancelEditSubCategory}
            onUpdateSuccess={handleSubCategoryUpdate}
          />
          <SubCategoryTableList
            subCategories={subCategories}
            categories={categories}
            setSubCategories={setSubCategories}
            onEditSubCategory={handleEditSubCategory}
          />
        </div>
      )}
    </div>
  );
};