'use client';
import React, { useState } from 'react';
import { Trash2, Search, Edit2, Check, X, Palette } from 'lucide-react';
import { Color } from '../../data/initialData';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ColorListProps {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    hex: string;
    slug: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

const ColorList: React.FC<ColorListProps> = ({ colors, setColors }) => {
  const { isBn } = useApp();
  const router = useRouter();

  const [editColorId, setEditColorId] = useState<string | null>(null);
  const [editColorName, setEditColorName] = useState<string>('');
  const [editColorNameBn, setEditColorNameBn] = useState<string>('');
  const [editColorHex, setEditColorHex] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const onUpdateColor = async (id: string, updatedFields: Partial<Color>) => {
    setIsUpdating(id);
    
    try {
      const res = await fetch("/api/color", {
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
        throw new Error(data.error || (isBn ? "রঙ আপডেট করতে ব্যর্থ" : "Failed to update color"));
      }

      if (data.success && data.data) {
        setColors(colors.map((c) => 
          (c._id === id || c.id === id) 
            ? { 
                ...c, 
                name: data.data.name,
                nameBn: data.data.nameBn,
                hex: data.data.hex,
              } 
            : c
        ));
        toast.success(data.message || (isBn ? "রঙ সফলভাবে আপডেট হয়েছে!" : "Color updated successfully!"));
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating color:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? "রঙ আপডেট করতে ব্যর্থ" : "Failed to update color"));
    } finally {
      setIsUpdating(null);
    }
  };

  const onDeleteColor = async (id: string) => {
    if (!id) {
      toast.error(isBn ? 'রঙ আইডি পাওয়া যায়নি' : 'Color ID not found');
      return;
    }

    // Confirm before delete
    const confirmDelete = confirm(
      isBn ? 'আপনি কি এই রঙটি ডিলিট করতে চান?' : 'Are you sure you want to delete this color?'
    );
    
    if (!confirmDelete) return;

    setIsDeleting(id);
    
    try {
      const res = await fetch("/api/color", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete color");
      }
      
      const data = await res.json();

      if (data.success) {
        // Update local state
        setColors(colors.filter((c) => c._id !== id && c.id !== id));
        
        toast.success(data.message || (isBn ? 'রঙ ডিলিট成功了!' : 'Color deleted successfully!'));
        router.refresh();
        
        // Adjust current page if needed
        const currentColorList = filteredColors.filter((c) => c._id !== id && c.id !== id);
        if (currentColorList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(data.error || (isBn ? 'রঙ ডিলিট করতে ব্যর্থ' : 'Failed to delete color'));
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : (isBn ? 'রঙ ডিলিট করতে ব্যর্থ' : 'Failed to delete color'));
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredColors = colors.filter((c: Color) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.nameBn && c.nameBn.includes(search)) ||
    c.hex.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredColors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentColors = filteredColors.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const startEditColor = (c: Color) => {
    setEditColorId(c._id || c.id || null);
    setEditColorName(c.name);
    setEditColorNameBn(c.nameBn || '');
    setEditColorHex(c.hex);
  };

  const saveEditColor = async (id: string) => {
    // Validate hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(editColorHex)) {
      toast.error(isBn ? 'ভুল হেক্স কোড। ফরম্যাট: #RRGGBB' : 'Invalid hex code. Format: #RRGGBB');
      return;
    }

    await onUpdateColor(id, { 
      name: editColorName, 
      nameBn: editColorNameBn, 
      hex: editColorHex 
    });
    setEditColorId(null);
  };

  const cancelEdit = () => {
    setEditColorId(null);
    setEditColorName('');
    setEditColorNameBn('');
    setEditColorHex('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full min-h-[500px]">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Palette className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            {isBn ? 'রঙ ম্যানেজমেন্ট' : 'Colors Palette Configuration'}
          </h2>
        </div>

        {/* Search & Table */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-3 w-full mb-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">
                {isBn ? 'প্রতি পৃষ্ঠায়:' : 'Show:'}
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                placeholder={isBn ? 'রঙ খুঁজুন...' : 'Search colors...'}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {isBn ? 'রঙের নাম (ইংরেজি ও বাংলা)' : 'Color Name'}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {isBn ? 'হেক্স কোড' : 'Hex Code'}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                    {isBn ? 'অ্যাকশন' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentColors.length > 0 ? (
                  currentColors.map((color: Color) => (
                    <tr key={color._id || color.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        {editColorId === (color._id || color.id) ? (
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              value={editColorName}
                              onChange={(e) => setEditColorName(e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="English Name"
                              disabled={isUpdating === (color._id || color.id)}
                            />
                            <input
                              type="text"
                              value={editColorNameBn}
                              onChange={(e) => setEditColorNameBn(e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="Bangla Name"
                              disabled={isUpdating === (color._id || color.id)}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-slate-200 shadow-sm flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex flex-col leading-tight">
                              <span className="font-semibold text-slate-700 text-sm">
                                {color.name}
                              </span>
                              {color.nameBn && (
                                <span className="text-[11px] text-slate-500">
                                  {color.nameBn}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                       </td>
                      <td className="px-4 py-3">
                        {editColorId === (color._id || color.id) ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={editColorHex}
                              onChange={(e) => setEditColorHex(e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                              disabled={isUpdating === (color._id || color.id)}
                            />
                            <input
                              type="text"
                              value={editColorHex}
                              onChange={(e) => setEditColorHex(e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono"
                              disabled={isUpdating === (color._id || color.id)}
                            />
                          </div>
                        ) : (
                          <span className="font-mono text-xs bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-100">
                            {color.hex}
                          </span>
                        )}
                       </td>
                      <td className="px-4 py-3 text-right">
                        {editColorId === (color._id || color.id) ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => saveEditColor(color._id || color.id || '')}
                              disabled={isUpdating === (color._id || color.id)}
                              className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              {isUpdating === (color._id || color.id) ? (
                                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={isUpdating === (color._id || color.id)}
                              className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEditColor(color)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteColor(color._id || color.id || '')}
                              disabled={isDeleting === (color._id || color.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                            >
                              {isDeleting === (color._id || color.id) ? (
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
                    <td colSpan={3} className="py-8 text-center text-sm text-slate-500">
                      {isBn ? 'কোনো রঙ পাওয়া যায়নি।' : 'No colors found.'}
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
            {isBn ? 'দেখাচ্ছে' : 'Showing'} {startIndex + 1} {isBn ? 'থেকে' : 'to'} {Math.min(startIndex + itemsPerPage, filteredColors.length)} {isBn ? 'এর মধ্যে' : 'of'} {filteredColors.length} {isBn ? 'টি' : 'entries'}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {isBn ? 'পূর্ববর্তী' : 'Prev'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
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
              {isBn ? 'পরবর্তী' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorList;