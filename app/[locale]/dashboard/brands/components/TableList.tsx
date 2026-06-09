"use client";
import React, { useState } from "react";
import { Trash2, Globe, Search, Edit2, ShieldCheck, Eye, Image as ImageIcon, Package } from "lucide-react";
import { Brand } from "../../data/initialData";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import Image from "next/image";

interface BrandListProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  onEditBrand?: (brand: Brand) => void;
}

const TableList: React.FC<BrandListProps> = ({ brands, setBrands, onEditBrand }) => {
  const { language } = useLanguage();
  const router = useRouter();
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [showBannerModal, setShowBannerModal] = useState<boolean>(false);

  const refreshBrands = async () => {
    try {
      const response = await fetch("/api/brand");
      const data = await response.json();
      if (data.success && data.data) {
        setBrands(data.data); // শুধু state আপডেট করুন
        return data.data;
      }
    } catch (error) {
      console.error("Error refreshing brands:", error);
    }
    return [];
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsTogglingStatus(id);
    
    try {
      const res = await fetch("/api/brand", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      if (data.success) {
        await refreshBrands(); // ✅ শুধু রিফ্রেশ করুন, router.refresh() বাদ দিন
        toast.success(language === 'bn' ? "স্ট্যাটাস আপডেট হয়েছে!" : "Status updated!");
        // router.refresh(); // ❌ এই লাইনটি সরান বা কমেন্ট করুন
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const onDeleteBrand = async (id: string) => {
    if (!id) {
      toast.error(language === 'bn' ? 'ব্র্যান্ড আইডি পাওয়া যায়নি' : 'Brand ID not found');
      return;
    }

    const confirmDelete = confirm(language === 'bn' ? 'আপনি কি এই ব্র্যান্ডটি ডিলিট করতে চান?' : 'Are you sure you want to delete this brand?');
    if (!confirmDelete) return;

    setIsDeleting(id);
    
    try {
      const res = await fetch("/api/brand", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete brand");
      
      if (data.success) {
        await refreshBrands(); // ✅ শুধু রিফ্রেশ করুন
        toast.success(data.message || (language === 'bn' ? 'ব্র্যান্ড ডিলিট করা হয়েছে!' : 'Brand deleted!'));
        // router.refresh(); // ❌ এই লাইনটি সরান
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : (language === 'bn' ? 'ব্র্যান্ড ডিলিট করতে ব্যর্থ' : 'Failed to delete'));
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (brand: Brand) => {
    if (onEditBrand) {
      onEditBrand(brand);
    }
  };

  const handleViewBanner = (bannerUrl: string) => {
    setSelectedBanner(bannerUrl);
    setShowBannerModal(true);
  };

  const filteredBrands = brands.filter(
    (b: Brand) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.nameBn && b.nameBn.toLowerCase().includes(search.toLowerCase())) ||
      (b.country && b.country.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBrands.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {language === 'bn' ? "সকল ব্র্যান্ডের তালিকা" : "Partners & Brands"}
              </h2>
              <span className="text-xs text-slate-500">
                {filteredBrands.length} {language === 'bn' ? "টি ব্র্যান্ড পাওয়া গেছে" : "brands found"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 font-medium">{language === 'bn' ? "প্রতি পৃষ্ঠায়:" : "Show:"}</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option>
                </select>
              </div>

              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder={language === 'bn' ? "ব্র্যান্ড খুঁজুন..." : "Search brands..."}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {language === 'bn' ? "ব্র্যান্ডের নাম" : "Brand Name"}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {language === 'bn' ? "ব্যানার" : "Banner"}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {language === 'bn' ? "দেশ" : "Country"}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {language === 'bn' ? "পণ্যের সংখ্যা" : "Item Count"}
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
                  currentItems.map((brand: Brand) => {
                    const brandId = brand._id || brand.id || "";
                    const isActive = brand.active !== false;
                    const hasBanner = brand.bannerImage && brand.bannerImage.trim() !== "";
                    const itemCount = brand.itemCount || 0;
                    
                    return (
                      <tr key={brandId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: brand.iconBgColor || brand.imageBgColor || "#EFF6FF" }}
                            >
                              {brand.image && brand.image.startsWith("/uploads/") ? (
                                <img src={brand.image} alt={brand.name} className="w-6 h-6 object-contain" style={{ backgroundColor: brand.imageBgColor || "transparent" }} />
                              ) : (
                                <Icon name={brand.icon || "Building2"} size={22} color={brand.iconColor || "#3B82F6"} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-800">{brand.name}</span>
                              {brand.nameBn && <span className="text-xs text-slate-500">{brand.nameBn}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {hasBanner ? (
                            <button
                              onClick={() => handleViewBanner(brand.bannerImage!)}
                              className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors text-xs font-medium"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              {language === 'bn' ? "ব্যানার দেখুন" : "View Banner"}
                              <Eye className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5" />
                              {language === 'bn' ? "ব্যানার নেই" : "No Banner"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>{brand.country}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 px-2.5 py-1 rounded-full font-medium text-slate-600">
                            <Package className="w-3 h-3 text-slate-400" />
                            {itemCount} {language === 'bn' ? "টি পণ্য" : "products"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => onToggleStatus(brandId, isActive)}
                            disabled={isTogglingStatus === brandId}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors border ${
                              !isActive ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            } disabled:opacity-50`}
                          >
                            {isTogglingStatus === brandId ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3 h-3" />
                            )}
                            {!isActive ? (language === 'bn' ? "নিষ্ক্রিয়" : "Inactive") : (language === 'bn' ? "সক্রিয়" : "Active")}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(brand)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteBrand(brandId)}
                              disabled={isDeleting === brandId}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                            >
                              {isDeleting === brandId ? (
                                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">{language === 'bn' ? "কোনো ব্র্যান্ড পাওয়া যায়নি।" : "No brands found."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
            <span className="text-xs text-slate-500">
              {language === 'bn' ? "দেখাচ্ছে" : "Showing"} {startIndex + 1} {language === 'bn' ? "থেকে" : "to"} {Math.min(startIndex + itemsPerPage, filteredBrands.length)} {language === 'bn' ? "এর মধ্যে" : "of"} {filteredBrands.length}
            </span>
            <div className="flex gap-1.5">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                {language === 'bn' ? "পূর্ববর্তী" : "Prev"}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${currentPage === page ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {page}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                {language === 'bn' ? "পরবর্তী" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Banner Modal */}
      {showBannerModal && selectedBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowBannerModal(false)}>
          <div className="relative max-w-5xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-white">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                {language === 'bn' ? "ব্র্যান্ড ব্যানার" : "Brand Banner"}
              </h3>
              <button onClick={() => setShowBannerModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 bg-slate-100">
              <img src={selectedBanner} alt="Banner" className="w-full h-auto max-h-[70vh] object-contain rounded-lg" />
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button onClick={() => setShowBannerModal(false)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                {language === 'bn' ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableList;