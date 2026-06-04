"use client";
import React, { useState } from "react";
import { Folder, Trash2, Search, Edit2, ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

interface Category {
  _id: string;
  id?: string;
  name: string;
  nameBn: string;
}

interface SubCategory {
  _id: string;
  name: string;
  nameBn: string;
  categoryId: string;
  categoryName?: string;
  categoryNameBn?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  slug: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface SubCategoryTableListProps {
  subCategories: SubCategory[];
  categories: Category[];
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
  onEditSubCategory?: (subCategory: SubCategory) => void;
}

const SubCategoryTableList: React.FC<SubCategoryTableListProps> = ({
  subCategories,
  categories,
  setSubCategories,
  onEditSubCategory,
}) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const refreshSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategory");
      const data = await response.json();
      if (data.success && data.data) {
        setSubCategories(data.data);
      }
    } catch (error) {
      console.error("Error refreshing subcategories:", error);
    }
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsTogglingStatus(id);

    try {
      const res = await fetch("/api/subcategory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      if (data.success) {
        await refreshSubCategories();
        toast.success(language === 'bn' ? "স্ট্যাটাস আপডেট হয়েছে!" : "Status updated!");
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const onDeleteSubCategory = async (id: string) => {
    if (!id) {
      toast.error(language === 'bn' ? "আইডি পাওয়া যায়নি" : "ID not found");
      return;
    }

    const confirmDelete = confirm(language === 'bn' ? "ডিলিট করতে চান?" : "Are you sure?");
    if (!confirmDelete) return;

    setIsDeleting(id);

    try {
      const res = await fetch("/api/subcategory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete");

      if (data.success) {
        await refreshSubCategories();
        toast.success(data.message || (language === 'bn' ? "ডিলিট করা হয়েছে!" : "Deleted successfully!"));
        router.refresh();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : (language === 'bn' ? "ডিলিট করতে ব্যর্থ" : "Failed to delete"));
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (subCategory: SubCategory) => {
    if (onEditSubCategory) {
      onEditSubCategory(subCategory);
      setTimeout(() => {
        const formElement = document.querySelector('.add-form-section');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => (c._id === categoryId || c.id === categoryId));
    if (!category) return { name: "Unknown", nameBn: "অজানা" };
    return { name: category.name, nameBn: category.nameBn };
  };

  const filteredSubCategories = subCategories.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nameBn.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? c.categoryId === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSubCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {language === 'bn' ? "সাব-ক্যাটাগরির তালিকা" : "Subcategories List"}
            </h2>
            <span className="text-xs text-slate-500">
              {filteredSubCategories.length} {language === 'bn' ? "টি সাব-ক্যাটাগরি পাওয়া গেছে" : "subcategories found"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{language === 'bn' ? "সব ক্যাটাগরি" : "All Categories"}</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {language === 'bn' ? cat.nameBn : cat.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">{language === 'bn' ? "প্রতি পৃষ্ঠায়:" : "Show:"}</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={language === 'bn' ? "সাব-ক্যাটাগরি খুঁজুন..." : "Search subcategories..."}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-8"></th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {language === 'bn' ? "সাব-ক্যাটাগরির নাম" : "Subcategory Name"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {language === 'bn' ? "প্যারেন্ট ক্যাটাগরি" : "Parent Category"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {language === 'bn' ? "স্ট্যাটাস" : "Status"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                  {language === 'bn' ? "অ্যাকশন" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? (
                currentItems.map((subCategory) => {
                  const isActive = subCategory.active !== false;
                  
                  return (
                    <React.Fragment key={subCategory._id}>
                      <tr className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => toggleRowExpand(subCategory._id)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                          >
                            {expandedRows.has(subCategory._id) ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: subCategory.iconBgColor || subCategory.imageBgColor || "#EFF6FF" }}
                            >
                              {subCategory.image && subCategory.image.startsWith("/assets/") ? (
                                <img
                                  src={subCategory.image}
                                  alt={subCategory.name}
                                  className="w-6 h-6 object-contain"
                                  style={{ backgroundColor: subCategory.imageBgColor || "transparent" }}
                                />
                              ) : (
                                <Icon
                                  name={subCategory.icon || "Folder"}
                                  size={22}
                                  color={subCategory.iconColor || "#3B82F6"}
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {language === 'bn' ? subCategory.nameBn : subCategory.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {language === 'bn' ? subCategory.name : subCategory.nameBn}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-indigo-50 px-2.5 py-1 rounded-full font-medium text-indigo-600 flex items-center gap-1.5 w-fit border border-indigo-100">
                            <Folder className="w-3 h-3" />
                            {language === 'bn' ? getCategoryName(subCategory.categoryId).nameBn : getCategoryName(subCategory.categoryId).name}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => onToggleStatus(subCategory._id, isActive)}
                            disabled={isTogglingStatus === subCategory._id}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                              !isActive
                                ? "bg-amber-50 text-amber-600 border border-amber-200"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            }`}
                          >
                            {isTogglingStatus === subCategory._id ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                            ) : !isActive ? (
                              language === 'bn' ? "নিষ্ক্রিয়" : "Inactive"
                            ) : language === 'bn' ? "সক্রিয়" : "Active"}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditClick(subCategory)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                              title={language === 'bn' ? "এডিট করুন" : "Edit"}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteSubCategory(subCategory._id)}
                              disabled={isDeleting === subCategory._id}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                              title={language === 'bn' ? "ডিলিট করুন" : "Delete"}
                            >
                              {isDeleting === subCategory._id ? (
                                <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(subCategory._id) && (
                        <tr className="bg-slate-50/30">
                          <td colSpan={5} className="px-4 py-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-slate-400">{language === 'bn' ? "স্লাগ" : "Slug"}</p>
                                <p className="text-slate-700 font-mono text-xs">{subCategory.slug}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">{language === 'bn' ? "আইকন" : "Icon"}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div 
                                    className="p-1 rounded"
                                    style={{ backgroundColor: subCategory.iconBgColor || "#EFF6FF" }}
                                  >
                                    <Icon name={subCategory.icon || "Folder"} size={16} color={subCategory.iconColor || "#3B82F6"} />
                                  </div>
                                  <span className="text-xs">{subCategory.icon || "Folder"}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">{language === 'bn' ? "তৈরি হয়েছে" : "Created"}</p>
                                <p className="text-slate-700 text-xs">
                                  {new Date(subCategory.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">{language === 'bn' ? "শেষ আপডেট" : "Updated"}</p>
                                <p className="text-slate-700 text-xs">
                                  {new Date(subCategory.updated_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">
                        {search || categoryFilter
                          ? (language === 'bn' ? "কোন সাব-ক্যাটাগরি পাওয়া যায়নি" : "No subcategories found matching your search")
                          : (language === 'bn' ? "কোন সাব-ক্যাটাগরি নেই" : "No subcategories found")}
                      </p>
                      {(search || categoryFilter) && (
                        <button
                          onClick={() => {
                            setSearch("");
                            setCategoryFilter("");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {language === 'bn' ? "ফিল্টার ক্লিয়ার করুন" : "Clear filters"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSubCategories.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <p className="text-xs text-slate-500">
            {language === 'bn' ? "দেখানো হচ্ছে" : "Showing"} <span className="font-semibold text-slate-700">{startIndex + 1}</span>{" "}
            {language === 'bn' ? "থেকে" : "to"} <span className="font-semibold text-slate-700">
              {Math.min(startIndex + itemsPerPage, filteredSubCategories.length)}
            </span>{" "}
            {language === 'bn' ? "সর্বমোট" : "of"} <span className="font-semibold text-slate-700">{filteredSubCategories.length}</span>{" "}
            {language === 'bn' ? "টি" : "entries"}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {language === 'bn' ? "পূর্ববর্তী" : "Prev"}
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNumber = idx + 1;
                if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  return <span key={pageNumber} className="text-slate-400 px-1">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {language === 'bn' ? "পরবর্তী" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryTableList;