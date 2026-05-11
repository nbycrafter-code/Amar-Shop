"use client";
import React, { useState } from "react";
import {
  Trash2,
  ShieldCheck,
  Globe,
  Search,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Brand } from "../../data/initialData";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BrandListProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    country: string;
    slug: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

const TableList: React.FC<BrandListProps> = ({ brands, setBrands }) => {
  const { isBn } = useApp();
  const router = useRouter();
  
  // Edit states
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editNameBn, setEditNameBn] = useState<string>("");
  const [editCountry, setEditCountry] = useState<string>("");
  
  // Loading states
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  // Search & Pagination states
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const onUpdateBrand = async (id: string, updatedFields: Partial<Brand>) => {
    setIsUpdating(id);
    
    try {
      const res = await fetch("/api/brand", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id, 
          ...updatedFields 
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "ব্র্যান্ড আপডেট করতে ব্যর্থ" : "Failed to update brand"));
      }

      if (data.success && data.data) {
        setBrands(brands.map((b) => 
          (b._id === id || b.id === id) 
            ? { 
                ...b, 
                name: data.data.name,
                nameBn: data.data.nameBn,
                country: data.data.country,
                active: data.data.active,
              } 
            : b
        ));
        toast.success(data.message || (isBn ? "ব্র্যান্ড সফলভাবে আপডেট হয়েছে!" : "Brand updated successfully!"));
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? "ব্র্যান্ড আপডেট করতে ব্যর্থ" : "Failed to update brand"));
    } finally {
      setIsUpdating(null);
    }
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsTogglingStatus(id);
    
    try {
      const res = await fetch("/api/brand", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id, 
          active: !currentStatus 
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status"));
      }

      if (data.success) {
        setBrands(brands.map((b) => 
          (b._id === id || b.id === id) 
            ? { ...b, active: data.active } 
            : b
        ));
        toast.success(data.message || (isBn ? "স্ট্যাটাস সফলভাবে আপডেট হয়েছে!" : "Status updated successfully!"));
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status"));
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const onDeleteBrand = async (id: string) => {
    if (!id) {
      toast.error(isBn ? 'ব্র্যান্ড আইডি পাওয়া যায়নি' : 'Brand ID not found');
      return;
    }

    // Confirm before delete
    const confirmDelete = confirm(
      isBn ? 'আপনি কি এই ব্র্যান্ডটি ডিলিট করতে চান?' : 'Are you sure you want to delete this brand?'
    );
    
    if (!confirmDelete) return;

    setIsDeleting(id);
    
    try {
      const res = await fetch("/api/brand", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete brand");
      }
      
      const data = await res.json();

      if (data.success) {
        // Update local state
        setBrands(brands.filter((b) => b._id !== id && b.id !== id));
        
        toast.success(data.message || (isBn ? 'ব্র্যান্ড ডিলিট成功了!' : 'Brand deleted successfully!'));
        router.refresh();
        
        // Adjust current page if needed
        const currentBrandList = filteredBrands.filter((b) => b._id !== id && b.id !== id);
        if (currentBrandList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(data.error || (isBn ? 'ব্র্যান্ড ডিলিট করতে ব্যর্থ' : 'Failed to delete brand'));
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? 'ব্র্যান্ড ডিলিট করতে ব্যর্থ' : 'Failed to delete brand'));
    } finally {
      setIsDeleting(null);
    }
  };

  const startEdit = (brand: Brand) => {
    setEditId(brand._id || brand.id || null);
    setEditName(brand.name);
    setEditNameBn(brand.nameBn || "");
    setEditCountry(brand.country);
  };

  const saveEdit = async (id: string) => {
    await onUpdateBrand(id, {
      name: editName,
      nameBn: editNameBn,
      country: editCountry,
    });
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditNameBn("");
    setEditCountry("");
  };

  // Filter & Pagination logic
  const filteredBrands = brands.filter(
    (b: Brand) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.nameBn && b.nameBn.toLowerCase().includes(search.toLowerCase())) ||
      b.country.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBrands.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isBn ? "সকল ব্র্যান্ডের তালিকা" : "Partners & Brands"}
            </h2>
            <span className="text-xs text-slate-500">
              {filteredBrands.length}{" "}
              {isBn ? "টি ব্র্যান্ড পাওয়া গেছে" : "brands found"}
            </span>
          </div>

          {/* Search Bar and Items per Page Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">
                {isBn ? "প্রতি পৃষ্ঠায়:" : "Show:"}
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                onChange={handleSearchChange}
                placeholder={isBn ? "ব্র্যান্ড খুঁজুন..." : "Search brands..."}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table layout for Brands */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn
                    ? "ব্র্যান্ডের নাম (ইংরেজি ও বাংলা)"
                    : "Brand Name (EN & BN)"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn ? "দেশ" : "Country"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn ? "স্ট্যাটাস" : "Status"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                  {isBn ? "অ্যাকশন" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? (
                currentItems.map((brand: Brand) => (
                  <tr
                    key={brand._id || brand.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {editId === (brand._id || brand.id) ? (
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="English Name"
                            disabled={isUpdating === (brand._id || brand.id)}
                          />
                          <input
                            type="text"
                            value={editNameBn}
                            onChange={(e) => setEditNameBn(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Bangla Name"
                            disabled={isUpdating === (brand._id || brand.id)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                            {brand.name[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">
                              {brand.name}
                            </span>
                            {brand.nameBn && (
                              <span className="text-xs text-slate-500">
                                {brand.nameBn}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                     </td>
                    <td className="px-4 py-3">
                      {editId === (brand._id || brand.id) ? (
                        <input
                          type="text"
                          value={editCountry}
                          onChange={(e) => setEditCountry(e.target.value)}
                          className="w-24 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          disabled={isUpdating === (brand._id || brand.id)}
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{brand.country}</span>
                        </div>
                      )}
                     </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onToggleStatus(brand._id || brand.id || '', brand.active !== false)}
                        disabled={isTogglingStatus === (brand._id || brand.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors border ${
                          brand.active === false
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isTogglingStatus === (brand._id || brand.id) ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        {brand.active === false
                          ? isBn ? "নিষ্ক্রিয়" : "Inactive"
                          : isBn ? "সক্রিয়" : "Active"}
                      </button>
                     </td>
                    <td className="px-4 py-3 text-right">
                      {editId === (brand._id || brand.id) ? (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => saveEdit(brand._id || brand.id || '')}
                            disabled={isUpdating === (brand._id || brand.id)}
                            className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                          >
                            {isUpdating === (brand._id || brand.id) ? (
                              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isUpdating === (brand._id || brand.id)}
                            className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(brand)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteBrand(brand._id || brand.id || '')}
                            disabled={isDeleting === (brand._id || brand.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === (brand._id || brand.id) ? (
                              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                     </td>
                   </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    {isBn
                      ? "কোনো ব্র্যান্ড পাওয়া যায়নি।"
                      : "No brands found."}
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
          <span className="text-xs text-slate-500">
            {isBn ? "দেখাচ্ছে" : "Showing"} {startIndex + 1}{" "}
            {isBn ? "থেকে" : "to"}{" "}
            {Math.min(startIndex + itemsPerPage, filteredBrands.length)}{" "}
            {isBn ? "এর মধ্যে" : "of"} {filteredBrands.length}{" "}
            {isBn ? "টি" : "entries"}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {isBn ? "পূর্ববর্তী" : "Prev"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {isBn ? "পরবর্তী" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;