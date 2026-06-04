"use client";
import React, { useState, useRef } from "react";
import { Folder, Trash2, Tag, Search, Edit2, Check, X, Image as ImageIcon, Palette, Upload, Plus, Circle } from "lucide-react";
import { Category } from "../../data/initialData";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import AllIcon from "@/components/AllIcon";

interface CategoryListProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    icon: string;
    iconColor?: string;
    iconBgColor?: string;  // ✅ নতুন - আইকনের ব্যাকগ্রাউন্ড কালার
    image?: string;
    imageBgColor?: string; // ✅ নতুন - ইমেজের ব্যাকগ্রাউন্ড কালার
    slug: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

// Predefined color options for icon color
const iconColorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Orange", value: "#F97316" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Amber", value: "#FBBF24" },
  { name: "Emerald", value: "#059669" },
  { name: "Slate", value: "#64748B" },
  { name: "Gray", value: "#6B7280" },
];

// Predefined background color options
const bgColorOptions = [
  { name: "Light Blue", value: "#EFF6FF" },
  { name: "Light Purple", value: "#F5F3FF" },
  { name: "Light Pink", value: "#FDF2F8" },
  { name: "Light Green", value: "#ECFDF5" },
  { name: "Light Yellow", value: "#FEFCE8" },
  { name: "Light Red", value: "#FEF2F2" },
  { name: "Light Indigo", value: "#EEF2FF" },
  { name: "Light Teal", value: "#F0FDFA" },
  { name: "Light Orange", value: "#FFF7ED" },
  { name: "Light Cyan", value: "#ECFEFF" },
  { name: "Light Rose", value: "#FFF1F2" },
  { name: "Light Amber", value: "#FFFBEB" },
  { name: "Light Emerald", value: "#ECFDF5" },
  { name: "Light Slate", value: "#F8FAFC" },
  { name: "White", value: "#FFFFFF" },
  { name: "Transparent", value: "transparent" },
];

const TableList: React.FC<CategoryListProps> = ({
  categories,
  setCategories,
}) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const router = useRouter();

  // Edit states
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editNameBn, setEditNameBn] = useState<string>("");
  const [editIcon, setEditIcon] = useState<string>("");
  const [editIconColor, setEditIconColor] = useState<string>("#3B82F6");
  const [editIconBgColor, setEditIconBgColor] = useState<string>("#EFF6FF"); // ✅ আইকন ব্যাকগ্রাউন্ড
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [editImageBgColor, setEditImageBgColor] = useState<string>("#F8FAFC"); // ✅ ইমেজ ব্যাকগ্রাউন্ড
  const [editUploadMethod, setEditUploadMethod] = useState<"icon" | "image">("icon");
  const [showEditIconPicker, setShowEditIconPicker] = useState<boolean>(false);
  const [showEditIconColorPicker, setShowEditIconColorPicker] = useState<boolean>(false);
  const [showEditIconBgPicker, setShowEditIconBgPicker] = useState<boolean>(false);
  const [showEditImageBgPicker, setShowEditImageBgPicker] = useState<boolean>(false);
  
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Loading states
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  // Search & Pagination states
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const onUpdateCategory = async (
    id: string,
    updatedFields: Partial<Category>,
  ) => {
    setIsUpdating(id);

    try {
      let res;
      
      if (editUploadMethod === "image" && editImage) {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", updatedFields.name || "");
        formData.append("nameBn", updatedFields.nameBn || "");
        formData.append("image", editImage);
        formData.append("imageBgColor", editImageBgColor); // ✅ ইমেজ ব্যাকগ্রাউন্ড পাঠানো
        res = await fetch("/api/category", {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/category", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            ...updatedFields,
            icon: editIcon,
            iconColor: editIconColor,
            iconBgColor: editIconBgColor, // ✅ আইকন ব্যাকগ্রাউন্ড পাঠানো
          }),
        });
      }

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            (isBn
              ? "ক্যাটাগরি আপডেট করতে ব্যর্থ"
              : "Failed to update category"),
        );
      }

      if (data.success && data.data) {
        setCategories(
          categories.map((c) =>
            c._id === id || c.id === id
              ? {
                  ...c,
                  name: data.data.name,
                  nameBn: data.data.nameBn,
                  icon: data.data.icon,
                  iconColor: data.data.iconColor,
                  iconBgColor: data.data.iconBgColor, // ✅ সেট করা
                  image: data.data.image,
                  imageBgColor: data.data.imageBgColor, // ✅ সেট করা
                  active: data.data.active,
                }
              : c,
          ),
        );
        toast.success(
          data.message ||
            (isBn
              ? "ক্যাটাগরি সফলভাবে আপডেট হয়েছে!"
              : "Category updated successfully!"),
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isBn
            ? "ক্যাটাগরি আপডেট করতে ব্যর্থ"
            : "Failed to update category",
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(isBn ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(isBn ? "ইমেজ সাইজ 2MB এর কম হতে হবে" : "Image size must be less than 2MB");
        return;
      }
      setEditImage(file);
      const previewUrl = URL.createObjectURL(file);
      setEditImagePreview(previewUrl);
    }
  };

  const handleEdit = (category: Category) => {
    setEditId(category._id || category.id || null);
    setEditName(category.name);
    setEditNameBn(category.nameBn);
    setEditIcon(category.icon || "ShoppingBag");
    setEditIconColor(category.iconColor || "#3B82F6");
    setEditIconBgColor(category.iconBgColor || "#EFF6FF");
    setEditImageBgColor(category.imageBgColor || "#F8FAFC");
    setEditUploadMethod(category.image && category.image.startsWith("/") ? "image" : "icon");
    if (category.image && category.image.startsWith("/")) {
      setEditImagePreview(category.image);
    } else {
      setEditImagePreview("");
    }
    setEditImage(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (editName.trim() && editNameBn.trim()) {
      const updateData: Partial<Category> = {
        name: editName.trim(),
        nameBn: editNameBn.trim(),
      };
      
      if (editUploadMethod === "icon") {
        updateData.icon = editIcon;
        updateData.iconColor = editIconColor;
        updateData.iconBgColor = editIconBgColor;
      } else {
        updateData.imageBgColor = editImageBgColor;
      }
      
      await onUpdateCategory(id, updateData);
      setEditId(null);
      setEditImagePreview("");
      setEditImage(null);
    } else {
      toast.error(isBn ? "নাম দুটি পূরণ করুন" : "Please fill both names");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditNameBn("");
    setEditIcon("");
    setEditIconColor("#3B82F6");
    setEditIconBgColor("#EFF6FF");
    setEditImageBgColor("#F8FAFC");
    setEditImagePreview("");
    setEditImage(null);
    setShowEditIconPicker(false);
    setShowEditIconColorPicker(false);
    setShowEditIconBgPicker(false);
    setShowEditImageBgPicker(false);
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsTogglingStatus(id);

    try {
      const res = await fetch("/api/category", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          active: !currentStatus,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            (isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status"),
        );
      }

      if (data.success) {
        setCategories(
          categories.map((c) =>
            c._id === id || c.id === id ? { ...c, active: data.data?.active } : c,
          ),
        );
        toast.success(
          data.message ||
            (isBn
              ? "স্ট্যাটাস সফলভাবে আপডেট হয়েছে!"
              : "Status updated successfully!"),
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isBn
            ? "স্ট্যাটাস আপডেট করতে ব্যর্থ"
            : "Failed to update status",
      );
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const onDeleteCategory = async (id: string) => {
    if (!id) {
      toast.error(
        isBn ? "ক্যাটাগরি আইডি পাওয়া যায়নি" : "Category ID not found",
      );
      return;
    }

    const confirmDelete = confirm(
      isBn
        ? "আপনি কি এই ক্যাটাগরিটি ডিলিট করতে চান?"
        : "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    setIsDeleting(id);

    try {
      const res = await fetch("/api/category", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete category");
      }

      const data = await res.json();

      if (data.success) {
        setCategories(categories.filter((c) => c._id !== id && c.id !== id));
        toast.success(
          data.message ||
            (isBn
              ? "ক্যাটাগরি ডিলিট করা হয়েছে!"
              : "Category deleted successfully!"),
        );
        router.refresh();

        const currentCategoryList = filteredCategories.filter(
          (c) => c._id !== id && c.id !== id,
        );
        if (currentCategoryList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(
          data.error ||
            (isBn
              ? "ক্যাটাগরি ডিলিট করতে ব্যর্থ"
              : "Failed to delete category"),
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isBn
            ? "ক্যাটাগরি ডিলিট করতে ব্যর্থ"
            : "Failed to delete category",
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // Color Picker Component (Reusable)
  const ColorPicker = ({ 
    color, 
    onChange, 
    onClose, 
    title, 
    colorOptions 
  }: { 
    color: string; 
    onChange: (color: string) => void; 
    onClose: () => void; 
    title: string;
    colorOptions: any[];
  }) => (
    <div className="absolute z-20 mt-1 w-48 bg-white border rounded-lg shadow-lg p-2">
      <p className="text-xs text-slate-500 mb-2">{title}</p>
      <div className="grid grid-cols-5 gap-1 mb-2">
        {colorOptions.map((colorOpt) => (
          <button
            key={colorOpt.value}
            onClick={() => {
              onChange(colorOpt.value);
              onClose();
            }}
            className={`w-6 h-6 rounded-full border hover:scale-110 transition ${
              color === colorOpt.value ? "ring-2 ring-blue-500 ring-offset-1" : ""
            }`}
            style={{ backgroundColor: colorOpt.value }}
            title={colorOpt.name}
          />
        ))}
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded cursor-pointer"
      />
    </div>
  );

  // Filter & Pagination logic
  const filteredCategories = categories.filter(
    (c: Category) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nameBn && c.nameBn.toLowerCase().includes(search.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isBn ? "সকল ক্যাটাগরির তালিকা" : "Available Categories"}
            </h2>
            <span className="text-xs text-slate-500">
              {filteredCategories.length}{" "}
              {isBn ? "টি ক্যাটাগরি পাওয়া গেছে" : "categories found"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">
                {isBn ? "প্রতি পৃষ্ঠায়:" : "Show:"}
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
                placeholder={
                  isBn ? "ক্যাটাগরি খুঁজুন..." : "Search categories..."
                }
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn ? "ক্যাটাগরির নাম" : "Category Name"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn ? "মোট পণ্য" : "Item Count"}
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
                currentItems.map((category: Category) => (
                  <tr
                    key={category._id || category.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      {editId === (category._id || category.id) ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="English Name"
                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isUpdating === (category._id || category.id)}
                          />
                          <input
                            type="text"
                            value={editNameBn}
                            onChange={(e) => setEditNameBn(e.target.value)}
                            placeholder="বাংলা নাম"
                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isUpdating === (category._id || category.id)}
                          />
                          
                          {/* Upload Method Selection */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditUploadMethod("icon")}
                              className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                                editUploadMethod === "icon"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              Icon
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditUploadMethod("image")}
                              className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                                editUploadMethod === "image"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              Image
                            </button>
                          </div>

                          {/* Icon Selection */}
                          {editUploadMethod === "icon" && (
                            <div className="space-y-2">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowEditIconPicker(!showEditIconPicker)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm flex items-center gap-2"
                                >
                                  <Icon name={editIcon} size={16} color={editIconColor} />
                                  <span className="flex-1 text-left">{editIcon}</span>
                                  <Plus className="w-3 h-3" />
                                </button>
                                {showEditIconPicker && (
                                  <div className="absolute z-20 mt-1 w-64 bg-white border rounded-lg shadow-lg">
                                    <AllIcon
                                      showAllIcons={true}
                                      onSelectIcon={(iconName) => {
                                        setEditIcon(iconName);
                                        setShowEditIconPicker(false);
                                      }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Icon Color Selection */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowEditIconColorPicker(!showEditIconColorPicker)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm flex items-center gap-2"
                                >
                                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: editIconColor }} />
                                  <span className="flex-1 text-left">{editIconColor}</span>
                                  <Palette className="w-3 h-3" />
                                </button>
                                {showEditIconColorPicker && (
                                  <ColorPicker
                                    color={editIconColor}
                                    onChange={setEditIconColor}
                                    onClose={() => setShowEditIconColorPicker(false)}
                                    title="Icon Color"
                                    colorOptions={iconColorOptions}
                                  />
                                )}
                              </div>

                              {/* ✅ Icon Background Color Selection */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowEditIconBgPicker(!showEditIconBgPicker)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm flex items-center gap-2"
                                >
                                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: editIconBgColor }} />
                                  <span className="flex-1 text-left">{editIconBgColor}</span>
                                  <Circle className="w-3 h-3" />
                                </button>
                                {showEditIconBgPicker && (
                                  <ColorPicker
                                    color={editIconBgColor}
                                    onChange={setEditIconBgColor}
                                    onClose={() => setShowEditIconBgPicker(false)}
                                    title="Background Color"
                                    colorOptions={bgColorOptions}
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Image Upload with Background Color */}
                          {editUploadMethod === "image" && (
                            <div className="space-y-2">
                              <div className="border-2 border-dashed border-slate-200 rounded-lg p-2 text-center">
                                {!editImagePreview ? (
                                  <div onClick={() => editFileInputRef.current?.click()} className="cursor-pointer">
                                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                                    <p className="text-xs text-slate-500">Click to upload</p>
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <img 
                                      src={editImagePreview} 
                                      alt="Preview" 
                                      className="h-16 mx-auto rounded object-contain" 
                                      style={{ backgroundColor: editImageBgColor }}
                                    />
                                    <button
                                      onClick={() => {
                                        setEditImagePreview("");
                                        setEditImage(null);
                                      }}
                                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                                <input
                                  ref={editFileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEditImageSelect}
                                  className="hidden"
                                />
                              </div>

                              {/* ✅ Image Background Color Selection */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowEditImageBgPicker(!showEditImageBgPicker)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm flex items-center gap-2"
                                >
                                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: editImageBgColor }} />
                                  <span className="flex-1 text-left">{editImageBgColor}</span>
                                  <Circle className="w-3 h-3" />
                                </button>
                                {showEditImageBgPicker && (
                                  <ColorPicker
                                    color={editImageBgColor}
                                    onChange={setEditImageBgColor}
                                    onClose={() => setShowEditImageBgPicker(false)}
                                    title="Background Color"
                                    colorOptions={bgColorOptions}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="p-2 rounded-lg text-blue-600"
                            style={{ backgroundColor: category.iconBgColor || (category.imageBgColor || "#EFF6FF") }}
                          >
                            {category.image && category.image.startsWith("/") ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-5 h-5 object-contain"
                                style={{ backgroundColor: category.imageBgColor || "transparent" }}
                              />
                            ) : (
                              <Icon
                                name={category.icon || "ShoppingBag"}
                                size={20}
                                color={category.iconColor || "#3B82F6"}
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {isBn ? category.nameBn : category.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {isBn ? category.name : category.nameBn}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-600 flex items-center gap-1 w-fit border border-slate-200">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {category.itemCount || 0} {isBn ? "টি" : "Items"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => onToggleStatus(category._id || category.id || "", category.active !== false)}
                        disabled={isTogglingStatus === (category._id || category.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                          category.active === false
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        }`}
                      >
                        {isTogglingStatus === (category._id || category.id) ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                        ) : category.active === false ? (
                          isBn ? "নিষ্ক্রিয়" : "Inactive"
                        ) : isBn ? "সক্রিয়" : "Active"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editId === (category._id || category.id) ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(category._id || category.id || "")}
                              disabled={isUpdating === (category._id || category.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            >
                              {isUpdating === (category._id || category.id) ? (
                                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteCategory(category._id || category.id || "")}
                          disabled={isDeleting === (category._id || category.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-all"
                        >
                          {isDeleting === (category._id || category.id) ? (
                            <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-slate-500">
                    {isBn ? "কোনো ক্যাটাগরি পাওয়া যায়নি।" : "No categories found matching your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredCategories.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <p className="text-xs text-slate-500">
            {isBn ? "দেখানো হচ্ছে" : "Showing"} <span className="font-semibold text-slate-700">{startIndex + 1}</span>{" "}
            {isBn ? "থেকে" : "to"} <span className="font-semibold text-slate-700">
              {Math.min(startIndex + itemsPerPage, filteredCategories.length)}
            </span>{" "}
            {isBn ? "সর্বমোট" : "of"} <span className="font-semibold text-slate-700">{filteredCategories.length}</span>{" "}
            {isBn ? "টি" : "entries"}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
            >
              {isBn ? "পূর্ববর্তী" : "Prev"}
            </button>
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNumber = idx + 1;
              if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                      currentPage === pageNumber ? "bg-blue-600 text-white shadow" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return <span key={pageNumber} className="text-slate-400">...</span>;
              }
              return null;
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
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