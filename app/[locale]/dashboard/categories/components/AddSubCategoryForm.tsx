"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import AllIcon from "@/components/AllIcon";
import { CheckCircle2, Palette, Plus, Folder, Trash2, Upload, Image, Circle, X, Edit2, Image as BannerIcon, FileText } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";

interface Category {
  _id: string;
  id?: string;
  name: string;
  nameBn: string;
}

interface SubCategory {
  _id?: string;
  name: string;
  nameBn: string;
  categoryId: string;
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
}

interface AddSubCategoryFormProps {
  categories: Category[];
  onSuccess?: () => void;
  editingSubCategory?: SubCategory | null;
  onCancelEdit?: () => void;
  onUpdateSuccess?: () => void;
}

const iconColorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Amber", value: "#FBBF24" },
  { name: "Emerald", value: "#059669" },
  { name: "Slate", value: "#64748B" },
  { name: "Gray", value: "#6B7280" },
];

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

const AddSubCategoryForm: React.FC<AddSubCategoryFormProps> = ({ 
  categories, 
  onSuccess,
  editingSubCategory,
  onCancelEdit,
  onUpdateSuccess,
}) => {
  const { language } = useLanguage();
  const isEditMode = !!editingSubCategory;
  
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("Folder");
  const [iconColor, setIconColor] = useState("#3B82F6");
  const [iconBgColor, setIconBgColor] = useState("#EFF6FF");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageBgColor, setImageBgColor] = useState("#F8FAFC");
  // Banner states
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"icon" | "image">("icon");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const [showIconBgPicker, setShowIconBgPicker] = useState(false);
  const [showImageBgPicker, setShowImageBgPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Load editing subcategory data
  useEffect(() => {
    if (editingSubCategory) {
      setName(editingSubCategory.name);
      setNameBn(editingSubCategory.nameBn);
      setSelectedCategoryId(editingSubCategory.categoryId);
      setDescription(editingSubCategory.description || "");
      setDescriptionBn(editingSubCategory.descriptionBn || "");
      
      // Show description checkbox if there is existing description
      if (editingSubCategory.description || editingSubCategory.descriptionBn) {
        setShowDescription(true);
      }
      
      if (editingSubCategory.image && editingSubCategory.image.startsWith("/assets/")) {
        setUploadMethod("image");
        setImagePreview(editingSubCategory.image);
        setImageBgColor(editingSubCategory.imageBgColor || "#F8FAFC");
      } else {
        setUploadMethod("icon");
        setSelectedIcon(editingSubCategory.icon || "Folder");
        setIconColor(editingSubCategory.iconColor || "#3B82F6");
        setIconBgColor(editingSubCategory.iconBgColor || "#EFF6FF");
      }
      
      // Load banner if exists
      if (editingSubCategory.bannerImage) {
        setBannerPreview(editingSubCategory.bannerImage);
      }
    }
  }, [editingSubCategory]);

  const refreshSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategory");
      const data = await response.json();
      if (data.success && data.data) {
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }
    } catch (error) {
      console.error("Error refreshing subcategories:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(language === 'bn' ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(language === 'bn' ? "ইমেজ সাইজ 2MB এর কম হতে হবে" : "Image size must be less than 2MB");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(language === 'bn' ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === 'bn' ? "ব্যানার ইমেজ সাইজ 5MB এর কম হতে হবে" : "Banner image size must be less than 5MB");
        return;
      }
      setSelectedBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeBanner = () => {
    setSelectedBanner(null);
    setBannerPreview("");
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const resetForm = () => {
    setName("");
    setNameBn("");
    setSelectedCategoryId("");
    setDescription("");
    setDescriptionBn("");
    setShowDescription(false);
    setSelectedIcon("Folder");
    setIconColor("#3B82F6");
    setIconBgColor("#EFF6FF");
    setSelectedImage(null);
    setImagePreview("");
    setImageBgColor("#F8FAFC");
    setSelectedBanner(null);
    setBannerPreview("");
    setUploadMethod("icon");
    setError("");
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(language === 'bn' ? "সাব-ক্যাটাগরির নাম (ইংরেজি) দিন" : "Enter subcategory name (English)");
      return;
    }
    if (!nameBn.trim()) {
      setError(language === 'bn' ? "সাব-ক্যাটাগরির নাম (বাংলা) দিন" : "Enter subcategory name (Bangla)");
      return;
    }
    if (!selectedCategoryId) {
      setError(language === 'bn' ? "ক্যাটাগরি সিলেক্ট করুন" : "Select a category");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let response;
      
      if (isEditMode && editingSubCategory) {
        const id = editingSubCategory._id;
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name.trim());
        formData.append("nameBn", nameBn.trim());
        formData.append("categoryId", selectedCategoryId);
        
        // Only append description if checkbox is checked
        if (showDescription) {
          formData.append("description", description.trim());
          formData.append("descriptionBn", descriptionBn.trim());
        } else {
          formData.append("description", "");
          formData.append("descriptionBn", "");
        }
        
        if (uploadMethod === "image" && selectedImage) {
          formData.append("image", selectedImage);
          formData.append("imageBgColor", imageBgColor);
        } else if (uploadMethod === "icon") {
          formData.append("icon", selectedIcon);
          formData.append("iconColor", iconColor);
          formData.append("iconBgColor", iconBgColor);
        }
        
        if (selectedBanner) {
          formData.append("bannerImage", selectedBanner);
        }
        
        response = await fetch("/api/subcategory", {
          method: "PUT",
          body: formData,
        });
      } else {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("nameBn", nameBn.trim());
        formData.append("categoryId", selectedCategoryId);
        
        // Only append description if checkbox is checked
        if (showDescription) {
          formData.append("description", description.trim());
          formData.append("descriptionBn", descriptionBn.trim());
        }
        
        if (uploadMethod === "image" && selectedImage) {
          formData.append("image", selectedImage);
          formData.append("imageBgColor", imageBgColor);
        } else if (uploadMethod === "icon") {
          formData.append("icon", selectedIcon);
          formData.append("iconColor", iconColor);
          formData.append("iconBgColor", iconBgColor);
        }
        
        if (selectedBanner) {
          formData.append("bannerImage", selectedBanner);
        }
        
        response = await fetch("/api/subcategory", {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (isEditMode ? "Failed to update subcategory" : "Failed to create subcategory"));
      }

      if (data.success) {
        await refreshSubCategories();
        toast.success(isEditMode 
          ? (language === 'bn' ? "সাব-ক্যাটাগরি আপডেট হয়েছে!" : "Subcategory updated successfully!")
          : (language === 'bn' ? "সাব-ক্যাটাগরি তৈরি হয়েছে!" : "Subcategory created successfully!")
        );
        
        if (!isEditMode) {
          resetForm();
        } else {
          handleCancel();
        }
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      toast.error(err instanceof Error ? err.message : "Failed to create subcategory");
    } finally {
      setIsLoading(false);
    }
  };

  const ColorPicker = ({ color, onChange, onClose, title, options }: any) => (
    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg p-3">
      <p className="text-xs text-slate-500 mb-2">{title}</p>
      <div className="grid grid-cols-8 gap-2 mb-2">
        {options.map((opt: any) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange(opt.value); onClose(); }}
            className={`w-6 h-6 rounded-full border ${color === opt.value ? "ring-2 ring-blue-500" : ""}`}
            style={{ backgroundColor: opt.value }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 border border-gray-300 rounded" />
        <input type="text" value={color} onChange={(e) => onChange(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="button" onClick={onClose} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">OK</button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {isEditMode ? (
            <Edit2 className="w-5 h-5 text-orange-600" />
          ) : (
            <Plus className="w-5 h-5 text-blue-600" />
          )}
          {isEditMode 
            ? (language === 'bn' ? "সাব-ক্যাটাগরি এডিট করুন" : "Edit Subcategory")
            : (language === 'bn' ? "নতুন সাব-ক্যাটাগরি যোগ করুন" : "Add New Subcategory")
          }
        </h2>
        {isEditMode && (
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "প্যারেন্ট ক্যাটাগরি" : "Parent Category"}
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            required
          >
            <option value="">{language === 'bn' ? "ক্যাটাগরি সিলেক্ট করুন" : "Select Category"}</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {language === 'bn' ? cat.nameBn : cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name Fields */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "সাব-ক্যাটাগরির নাম (ইংরেজি)" : "Subcategory Name (English)"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Men's Clothing"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "সাব-ক্যাটাগরির নাম (বাংলা)" : "Subcategory Name (Bangla)"}
          </label>
          <input
            type="text"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            placeholder="যেমন: পুরুষদের পোশাক"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Description with Checkbox */}
        <div className="space-y-4 border-t border-slate-100 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDescription}
              onChange={(e) => {
                setShowDescription(e.target.checked);
                if (!e.target.checked) {
                  setDescription("");
                  setDescriptionBn("");
                }
              }}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              disabled={isLoading}
            />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600">
                {language === 'bn' ? "বিবরণ যোগ করুন (ঐচ্ছিক)" : "Add Description (Optional)"}
              </span>
            </div>
          </label>

          {showDescription && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {language === 'bn' ? "বিবরণ (ইংরেজি)" : "Description (English)"}
                </label>
                <TipTapEditor
                  value={description}
                  onChange={setDescription}
                  placeholder={language === 'bn' ? "বিবরণ লিখুন..." : "Write a description..."}
                  disabled={isLoading}
                  minHeight="100px"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {language === 'bn' ? "বিবরণ (বাংলা)" : "Description (Bangla)"}
                </label>
                <TipTapEditor
                  value={descriptionBn}
                  onChange={setDescriptionBn}
                  placeholder={language === 'bn' ? "বাংলায় বিবরণ লিখুন..." : "Write description in Bangla..."}
                  disabled={isLoading}
                  minHeight="100px"
                />
              </div>
            </div>
          )}
        </div>

        {/* Upload Method */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "আপলোড পদ্ধতি" : "Upload Method"}
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setUploadMethod("icon")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${uploadMethod === "icon" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border-slate-200"}`}>
              <Folder className="w-4 h-4" /> {language === 'bn' ? "আইকন" : "Icon"}
            </button>
            <button type="button" onClick={() => setUploadMethod("image")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${uploadMethod === "image" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border-slate-200"}`}>
              <Image className="w-4 h-4" /> {language === 'bn' ? "ইমেজ" : "Image"}
            </button>
          </div>
        </div>

        {/* Icon Selection */}
        {uploadMethod === "icon" && (
          <>
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{language === 'bn' ? "আইকন সিলেক্ট করুন" : "Select Icon"}</label>
              <button type="button" onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-2 bg-white">
                <AllIcon name={selectedIcon} size={20} color={iconColor} />
                <span className="flex-1 text-left">{selectedIcon}</span>
                <Plus className="w-4 h-4" />
              </button>
              {showIconPicker && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  <AllIcon showAllIcons={true} onSelectIcon={(icon: string) => { setSelectedIcon(icon); setShowIconPicker(false); }} />
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" /> {language === 'bn' ? "আইকনের রং" : "Icon Color"}
              </label>
              <button type="button" onClick={() => setShowIconColorPicker(!showIconColorPicker)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-3 bg-white">
                <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: iconColor }} />
                <span className="flex-1 text-left">{iconColor}</span>
              </button>
              {showIconColorPicker && (
                <ColorPicker color={iconColor} onChange={setIconColor} onClose={() => setShowIconColorPicker(false)} 
                  title={language === 'bn' ? "আইকনের রং নির্বাচন" : "Select Color"} options={iconColorOptions} />
              )}
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                <Circle className="w-3.5 h-3.5" /> {language === 'bn' ? "ব্যাকগ্রাউন্ড রং" : "Background Color"}
              </label>
              <button type="button" onClick={() => setShowIconBgPicker(!showIconBgPicker)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-3 bg-white">
                <div className="w-6 h-6 rounded-lg border border-gray-300" style={{ backgroundColor: iconBgColor }} />
                <span className="flex-1 text-left">{iconBgColor}</span>
              </button>
              {showIconBgPicker && (
                <ColorPicker color={iconBgColor} onChange={setIconBgColor} onClose={() => setShowIconBgPicker(false)} 
                  title={language === 'bn' ? "ব্যাকগ্রাউন্ড রং নির্বাচন" : "Select Background"} options={bgColorOptions} />
              )}
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 mb-2 text-center">{language === 'bn' ? "প্রিভিউ" : "Preview"}</p>
              <div className="flex items-center justify-center gap-3 p-3 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100" style={{ backgroundColor: iconBgColor }}>
                  <AllIcon name={selectedIcon} size={24} color={iconColor} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{name || "Subcategory Name"}</p>
                  <p className="text-xs text-slate-500">{nameBn || "সাব-ক্যাটাগরির নাম"}</p>
                  {showDescription && description && (
                    <div 
                      className="text-xs text-slate-400 mt-1 line-clamp-1"
                      dangerouslySetInnerHTML={{ __html: description.substring(0, 50) + (description.length > 50 ? '...' : '') }}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Image Upload */}
        {uploadMethod === "image" && (
          <>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              {!imagePreview ? (
                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">{language === 'bn' ? "ইমেজ সিলেক্ট করতে ক্লিক করুন" : "Click to select image"}</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF (Max 2MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-contain" style={{ backgroundColor: imageBgColor }} />
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                <Circle className="w-3.5 h-3.5" /> {language === 'bn' ? "ইমেজের ব্যাকগ্রাউন্ড রং" : "Image Background Color"}
              </label>
              <button type="button" onClick={() => setShowImageBgPicker(!showImageBgPicker)}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 flex items-center gap-3 bg-white">
                <div className="w-6 h-6 rounded-lg border border-gray-300" style={{ backgroundColor: imageBgColor }} />
                <span className="flex-1 text-left">{imageBgColor}</span>
              </button>
              {showImageBgPicker && (
                <ColorPicker color={imageBgColor} onChange={setImageBgColor} onClose={() => setShowImageBgPicker(false)} 
                  title={language === 'bn' ? "ব্যাকগ্রাউন্ড রং নির্বাচন" : "Select Background"} options={bgColorOptions} />
              )}
            </div>

            {imagePreview && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-xs text-slate-500 mb-2 text-center">{language === 'bn' ? "প্রিভিউ" : "Preview"}</p>
                <div className="flex items-center justify-center p-4 rounded-xl" style={{ backgroundColor: imageBgColor }}>
                  <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg object-contain" />
                </div>
                {showDescription && description && (
                  <div 
                    className="text-xs text-slate-500 text-center mt-2 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Banner Image Upload Section */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
            <BannerIcon className="w-3.5 h-3.5 text-purple-600" />
            {language === 'bn' ? "ব্যানার ইমেজ (ঐচ্ছিক)" : "Banner Image (Optional)"}
          </label>
          <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 text-center hover:border-purple-400 transition-colors bg-purple-50/30">
            {!bannerPreview ? (
              <div onClick={() => bannerInputRef.current?.click()} className="cursor-pointer">
                <BannerIcon className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-purple-600">{language === 'bn' ? "ব্যানার ইমেজ সিলেক্ট করতে ক্লিক করুন" : "Click to select banner image"}</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF (Max 5MB) - ব্যানারের জন্য প্রস্তাবিত সাইজ: 1200x400px</p>
              </div>
            ) : (
              <div className="relative">
                <img src={bannerPreview} alt="Banner Preview" className="w-full max-h-32 object-cover rounded-lg" />
                <button type="button" onClick={removeBanner} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerSelect} className="hidden" />
          </div>
        </div>

        {error && <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>}
        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditMode ? (language === 'bn' ? "আপডেট সম্পন্ন!" : "Updated successfully!") : (language === 'bn' ? "সাব-ক্যাটাগরি যোগ করা হয়েছে!" : "Subcategory added successfully!")}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2">
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isEditMode ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
            {isEditMode ? (language === 'bn' ? "আপডেট করুন" : "Update") : (language === 'bn' ? "সংরক্ষণ করুন" : "Save")}
          </button>
          {isEditMode && (
            <button type="button" onClick={handleCancel} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              {language === 'bn' ? "বাতিল করুন" : "Cancel"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddSubCategoryForm;