// components/SubCategoryTableList.tsx
"use client";
import React, { useState } from "react";
import { Trash2, Tag, Search, Edit2, Image as BannerIcon, Eye, FolderTree, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

interface SubCategory {
  _id?: string;
  id?: string;
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
  bannerImage?: string;
  description?: string;
  descriptionBn?: string;
  slug?: string;
  active?: boolean;
  itemCount?: number;
}

interface SubCategoryTableListProps {
  subCategories: SubCategory[];
  categories: any[];
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
  onEditSubCategory?: (subcategory: SubCategory) => void;
}

const SubCategoryTableList: React.FC<SubCategoryTableListProps> = ({
  subCategories,
  categories,
  setSubCategories,
  onEditSubCategory,
}) => {
  const { language } = useLanguage();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [showBannerModal, setShowBannerModal] = useState<boolean>(false);
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
        toast.success(language === 'bn' ? "স্ট্যাটাস আপডেট হয়েছে!" : "Status updated successfully!");
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
      toast.error(language === 'bn' ? "সাব-ক্যাটাগরি আইডি পাওয়া যায়নি" : "Subcategory ID not found");
      return;
    }

    const confirmDelete = confirm(
      language === 'bn' ? "আপনি কি এই সাব-ক্যাটাগরিটি ডিলিট করতে চান?" : "Are you sure you want to delete this subcategory?"
    );

    if (!confirmDelete) return;

    setIsDeleting(id);

    try {
      const res = await fetch("/api/subcategory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete subcategory");
      }

      const data = await res.json();

      if (data.success) {
        await refreshSubCategories();
        toast.success(language === 'bn' ? "সাব-ক্যাটাগরি ডিলিট করা হয়েছে!" : "Subcategory deleted successfully!");
        router.refresh();

        const currentSubCategoryList = subCategories.filter(
          (sub) =>
            sub.name.toLowerCase().includes(search.toLowerCase()) ||
            (sub.nameBn && sub.nameBn.toLowerCase().includes(search.toLowerCase()))
        );
        if (currentSubCategoryList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete subcategory");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (subcategory: SubCategory) => {
    if (onEditSubCategory) {
      onEditSubCategory(subcategory);
      setTimeout(() => {
        const formElement = document.querySelector('.add-form-section');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleViewBanner = (bannerUrl: string) => {
    setSelectedBanner(bannerUrl);
    setShowBannerModal(true);
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

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => (c._id || c.id) === categoryId);
    if (!category) return language === 'bn' ? "অজানা" : "Unknown";
    return language === 'bn' ? category.nameBn : category.name;
  };

  const filteredSubCategories = subCategories.filter(
    (sub: SubCategory) =>
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      (sub.nameBn && sub.nameBn.toLowerCase().includes(search.toLowerCase())) ||
      getCategoryName(sub.categoryId).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSubCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {language === 'bn' ? "সকল সাব-ক্যাটাগরির তালিকা" : "Available Subcategories"}
              </h2>
              <span className="text-xs text-slate-500">
                {filteredSubCategories.length} {language === 'bn' ? "টি সাব-ক্যাটাগরি পাওয়া গেছে" : "subcategories found"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 font-medium">
                  {language === 'bn' ? "প্রতি পৃষ্ঠায়:" : "Show:"}
                </label>
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
                    {language === 'bn' ? "ব্যানার" : "Banner"}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {language === 'bn' ? "মোট পণ্য" : "Item Count"}
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
                  currentItems.map((sub) => {
                    const subId = sub._id || sub.id || "";
                    const isActive = sub.active !== false;
                    const hasBanner = sub.bannerImage && sub.bannerImage.trim() !== "";
                    const parentCategoryName = getCategoryName(sub.categoryId);

                    return (
                      <React.Fragment key={subId}>
                        <tr className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => toggleRowExpand(subId)}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                              {expandedRows.has(subId) ? (
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
                                style={{ backgroundColor: sub.iconBgColor || sub.imageBgColor || "#EFF6FF" }}
                              >
                                {sub.image && sub.image.startsWith("/") ? (
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-6 h-6 object-contain"
                                    style={{ backgroundColor: sub.imageBgColor || "transparent" }}
                                  />
                                ) : (
                                  <Icon
                                    name={sub.icon || "Folder"}
                                    size={22}
                                    color={sub.iconColor || "#3B82F6"}
                                  />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {language === 'bn' ? sub.nameBn : sub.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {language === 'bn' ? sub.name : sub.nameBn}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 w-fit">
                              <FolderTree className="w-3 h-3" />
                              {parentCategoryName}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {hasBanner ? (
                              <button
                                onClick={() => handleViewBanner(sub.bannerImage!)}
                                className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors text-xs font-medium"
                              >
                                <BannerIcon className="w-3.5 h-3.5" />
                                {language === 'bn' ? "ব্যানার দেখুন" : "View Banner"}
                                <Eye className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <BannerIcon className="w-3.5 h-3.5" />
                                {language === 'bn' ? "ব্যানার নেই" : "No Banner"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full font-medium text-slate-600 flex items-center gap-1.5 w-fit border border-slate-200">
                              <Tag className="w-3 h-3 text-slate-400" />
                              {sub.itemCount || 0} {language === 'bn' ? "টি" : "Items"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => onToggleStatus(subId, isActive)}
                              disabled={isTogglingStatus === subId}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${!isActive
                                ? "bg-amber-50 text-amber-600 border border-amber-200"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                }`}
                            >
                              {isTogglingStatus === subId ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                              ) : !isActive ? (
                                language === 'bn' ? "নিষ্ক্রিয়" : "Inactive"
                              ) : language === 'bn' ? "সক্রিয়" : "Active"}
                            </button>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditClick(sub)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                                title={language === 'bn' ? "এডিট করুন" : "Edit"}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteSubCategory(subId)}
                                disabled={isDeleting === subId}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                                title={language === 'bn' ? "ডিলিট করুন" : "Delete"}
                              >
                                {isDeleting === subId ? (
                                  <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Row with Details */}
                        {expandedRows.has(subId) && (
                          <tr className="bg-slate-50/30">
                            <td colSpan={6} className="px-4 py-3">
                              <div className="pl-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-xs text-slate-400">{language === 'bn' ? "স্লাগ" : "Slug"}</p>
                                    <p className="text-slate-700 font-mono text-xs">{sub.slug || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">{language === 'bn' ? "আইকন" : "Icon"}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div
                                        className="p-1 rounded"
                                        style={{ backgroundColor: sub.iconBgColor || "#EFF6FF" }}
                                      >
                                        <Icon name={sub.icon || "Folder"} size={16} color={sub.iconColor || "#3B82F6"} />
                                      </div>
                                      <span className="text-xs">{sub.icon || "Folder"}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">{language === 'bn' ? "ক্যাটাগরি আইডি" : "Category ID"}</p>
                                    <p className="text-slate-700 text-xs font-mono">{sub.categoryId}</p>
                                  </div>
                                  {sub.description && (
                                    <div className="col-span-full">
                                      <p className="text-xs text-slate-400 mb-1">
                                        {language === 'bn' ? "বিবরণ" : "Description"}
                                      </p>
                                      <div
                                        className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200"
                                        dangerouslySetInnerHTML={{ __html: sub.description }}
                                      />
                                    </div>
                                  )}
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
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <FolderTree className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">
                          {search
                            ? (language === 'bn' ? "কোন সাব-ক্যাটাগরি পাওয়া যায়নি" : "No subcategories found matching your search")
                            : (language === 'bn' ? "কোন সাব-ক্যাটাগরি নেই" : "No subcategories found")}
                        </p>
                        {search && (
                          <button
                            onClick={() => setSearch("")}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {language === 'bn' ? "সার্চ ক্লিয়ার করুন" : "Clear search"}
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

        {/* Pagination */}
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
                        className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${currentPage === pageNumber
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

      {/* Banner Modal */}
      {showBannerModal && selectedBanner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowBannerModal(false)}
        >
          <div
            className="relative max-w-5xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <BannerIcon className="w-5 h-5 text-purple-600" />
                {language === 'bn' ? "ব্যানার ইমেজ" : "Banner Image"}
              </h3>
              <button
                onClick={() => setShowBannerModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 bg-slate-100">
              <img
                src={selectedBanner}
                alt="Banner"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setShowBannerModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {language === 'bn' ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCategoryTableList;