"use client";
import React, { useState } from "react";
import { Trash2, Search, Ruler } from "lucide-react";
import { Size } from "../../data/initialData";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SizeListProps {
  sizes: Size[];
  setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
}

const SizeList: React.FC<SizeListProps> = ({ sizes, setSizes }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredSizes = sizes.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSizes = filteredSizes.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // const onDeleteSize = (id: string) => {
  //   setSizes(sizes.filter((s) => s.id !== id));
  // };

  const onDeleteSize = async (id: string) => {
    try {
      // Confirm before delete
      const confirmDelete = confirm(
        language === 'bn'
          ? "আপনি কি এই সাইজটি ডিলিট করতে চান?"
          : "Are you sure you want to delete this size?",
      );

      if (!confirmDelete) return;

      const res = await fetch("/api/size", {
        method: "DELETE",
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) throw new Error("Failed to save brand");
      const data = await res.json();

      setSizes(sizes.filter((s) => s.id !== id));

      toast.success("Brand deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full min-h-[500px]">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Ruler className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            {language === 'bn' ? "সাইজ ম্যানেজমেন্ট" : "Sizes Configuration"}
          </h2>
        </div>

        {/* Search & Table */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-3 w-full mb-4">
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
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={language === 'bn' ? "সাইজ খুঁজুন..." : "Search sizes..."}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {language === 'bn' ? "সাইজের নাম" : "Size Label"}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                    {language === 'bn' ? "অ্যাকশন" : "Action"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentSizes.length > 0 ? (
                  currentSizes.map((size) => (
                    <tr
                      key={size.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-700 text-sm">
                          {size.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onDeleteSize(size.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      {language === 'bn' ? "কোনো সাইজ পাওয়া যায়নি।" : "No sizes found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
          <span className="text-xs text-slate-500">
            {language === 'bn' ? "দেখাচ্ছে" : "Showing"} {startIndex + 1}{" "}
            {language === 'bn' ? "থেকে" : "to"}{" "}
            {Math.min(startIndex + itemsPerPage, filteredSizes.length)}{" "}
            {language === 'bn' ? "এর মধ্যে" : "of"} {filteredSizes.length}{" "}
            {language === 'bn' ? "টি" : "entries"}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {language === 'bn' ? "পূর্ববর্তী" : "Prev"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-amber-600 text-white shadow-sm"
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
              {language === 'bn' ? "পরবর্তী" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeList;
