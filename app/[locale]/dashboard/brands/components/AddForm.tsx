"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, CheckCircle2, Upload, Image, Trash2, X, Edit2, Circle, Palette } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { Brand } from "../../data/initialData";
import { toast } from "sonner";
import AllIcon from "@/components/AllIcon";
import { useRouter } from "next/navigation";

interface AddFormProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  editingBrand?: Brand | null;
  onCancelEdit?: () => void;
  onUpdateSuccess?: () => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    country: string;
    icon?: string;
    iconColor?: string;
    iconBgColor?: string;
    image?: string;
    imageBgColor?: string;
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

const AddForm: React.FC<AddFormProps> = ({ brands, setBrands, editingBrand, onCancelEdit, onUpdateSuccess }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const isEditMode = !!editingBrand;
  const router = useRouter();
  
  const [name, setName] = useState<string>("");
  const [nameBn, setNameBn] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Building2");
  const [iconColor, setIconColor] = useState<string>("#3B82F6");
  const [iconBgColor, setIconBgColor] = useState<string>("#EFF6FF");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBgColor, setImageBgColor] = useState<string>("#F8FAFC");
  const [uploadMethod, setUploadMethod] = useState<"icon" | "image">("icon");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [showIconColorPicker, setShowIconColorPicker] = useState<boolean>(false);
  const [showIconBgPicker, setShowIconBgPicker] = useState<boolean>(false);
  const [showImageBgPicker, setShowImageBgPicker] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load editing brand data
  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name);
      setNameBn(editingBrand.nameBn || "");
      setCountry(editingBrand.country || "");
      
      if (editingBrand.image && editingBrand.image.startsWith("/uploads/")) {
        setUploadMethod("image");
        setImagePreview(editingBrand.image);
        setImageBgColor(editingBrand.imageBgColor || "#F8FAFC");
      } else {
        setUploadMethod("icon");
        setSelectedIcon(editingBrand.icon || "Building2");
        setIconColor(editingBrand.iconColor || "#3B82F6");
        setIconBgColor(editingBrand.iconBgColor || "#EFF6FF");
      }
    }
  }, [editingBrand]);

  const refreshBrands = async () => {
    try {
      const response = await fetch("/api/brand");
      const data = await response.json();
      if (data.success && data.data) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Error refreshing brands:", error);
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
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setName("");
    setNameBn("");
    setCountry("");
    setSelectedIcon("Building2");
    setIconColor("#3B82F6");
    setIconBgColor("#EFF6FF");
    setSelectedImage(null);
    setImagePreview("");
    setImageBgColor("#F8FAFC");
    setUploadMethod("icon");
    setError("");
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError(language === 'bn' ? "ব্র্যান্ডের নাম (ইংরেজি) দিন" : "Enter brand name (English)");
      return;
    }
    
    if (!nameBn.trim()) {
      setError(language === 'bn' ? "ব্র্যান্ডের নাম (বাংলা) দিন" : "Enter brand name (Bangla)");
      return;
    }
    
    if (!country.trim()) {
      setError(language === 'bn' ? "মূল দেশ দিন" : "Enter country of origin");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      let res;
      
      if (isEditMode && editingBrand) {
        const id = editingBrand._id || editingBrand.id;
        
        if (uploadMethod === "image" && (selectedImage || imagePreview)) {
          const formData = new FormData();
          formData.append("id", id);
          formData.append("name", name.trim());
          formData.append("nameBn", nameBn.trim());
          formData.append("country", country.trim());
          if (selectedImage) {
            formData.append("image", selectedImage);
          }
          formData.append("imageBgColor", imageBgColor);
          res = await fetch("/api/brand", {
            method: "PUT",
            body: formData,
          });
        } else {
          res = await fetch("/api/brand", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              name: name.trim(),
              nameBn: nameBn.trim(),
              country: country.trim(),
              icon: selectedIcon,
              iconColor: iconColor,
              iconBgColor: iconBgColor,
            }),
          });
        }
      } else {
        if (uploadMethod === "image" && selectedImage) {
          const formData = new FormData();
          formData.append("name", name.trim());
          formData.append("nameBn", nameBn.trim());
          formData.append("country", country.trim());
          formData.append("image", selectedImage);
          formData.append("imageBgColor", imageBgColor);
          res = await fetch("/api/brand", {
            method: "POST",
            body: formData,
          });
        } else {
          res = await fetch("/api/brand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.trim(),
              nameBn: nameBn.trim(),
              country: country.trim(),
              icon: selectedIcon,
              iconColor: iconColor,
              iconBgColor: iconBgColor,
            }),
          });
        }
      }

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isEditMode ? "Failed to update brand" : "Failed to save brand"));
      }

      if (data.success) {
        await refreshBrands();
        toast.success(isEditMode 
          ? (language === 'bn' ? "ব্র্যান্ড আপডেট হয়েছে!" : "Brand updated successfully!")
          : (language === 'bn' ? "ব্র্যান্ড সংরক্ষণ হয়েছে!" : "Brand saved successfully!")
        );
        
        if (!isEditMode) {
          resetForm();
        } else {
          handleCancel();
          if (onUpdateSuccess) onUpdateSuccess();
        }
        
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save brand";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Color Picker Component
  const ColorPicker = ({ color, onChange, onClose, title, colorOptions }: any) => (
    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg p-3">
      <p className="text-xs text-slate-500 mb-2">{title}</p>
      <div className="grid grid-cols-8 gap-2 mb-2">
        {colorOptions.map((opt: any) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange(opt.value); onClose(); }}
            className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${color === opt.value ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
            style={{ backgroundColor: opt.value }}
            title={opt.name}
          />
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
        <input type="text" value={color} onChange={(e) => onChange(e.target.value)} className="flex-1 px-2 py-1.5 rounded border text-sm" />
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded">OK</button>
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
            <Plus className="w-5 h-5 text-indigo-600" />
          )}
          {isEditMode 
            ? (language === 'bn' ? "ব্র্যান্ড এডিট করুন" : "Edit Brand")
            : (language === 'bn' ? "নতুন ব্র্যান্ড যোগ করুন" : "Add New Brand")
          }
        </h2>
        {isEditMode && (
          <button type="button" onClick={handleCancel} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "ব্র্যান্ডের নাম (ইংরেজি)" : "Brand Name (English)"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Nike"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "ব্র্যান্ডের নাম (বাংলা)" : "Brand Name (Bangla)"}
          </label>
          <input
            type="text"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            placeholder="উদাঃ নাইকি"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "মূল দেশ" : "Country of Origin"}
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. USA"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        {/* Upload Method Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {language === 'bn' ? "আপলোড পদ্ধতি" : "Upload Method"}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setUploadMethod("icon")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                uploadMethod === "icon" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <AllIcon name="Building2" size={16} />
              {language === 'bn' ? "আইকন" : "Icon"}
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod("image")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                uploadMethod === "image" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Image className="w-4 h-4" />
              {language === 'bn' ? "ইমেজ" : "Image"}
            </button>
          </div>
        </div>

        {/* Icon Selection */}
        {uploadMethod === "icon" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {language === 'bn' ? "আইকন সিলেক্ট করুন" : "Select Icon"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-2 bg-white"
                >
                  <AllIcon name={selectedIcon} size={20} color={iconColor} />
                  <span className="flex-1 text-left">{selectedIcon}</span>
                  <Plus className="w-4 h-4 text-slate-400" />
                </button>
                {showIconPicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
                    <AllIcon showAllIcons={true} onSelectIcon={(iconName: string) => { setSelectedIcon(iconName); setShowIconPicker(false); }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                {language === 'bn' ? "আইকনের রং" : "Icon Color"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconColorPicker(!showIconColorPicker)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-3 bg-white"
                >
                  <div className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: iconColor }} />
                  <span className="flex-1 text-left">{iconColor}</span>
                  <Palette className="w-4 h-4 text-slate-400" />
                </button>
                {showIconColorPicker && (
                  <ColorPicker color={iconColor} onChange={setIconColor} onClose={() => setShowIconColorPicker(false)} 
                    title={language === 'bn' ? "আইকনের রং নির্বাচন" : "Select Icon Color"} colorOptions={iconColorOptions} />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                <Circle className="w-3.5 h-3.5" />
                {language === 'bn' ? "আইকনের ব্যাকগ্রাউন্ড রং" : "Icon Background Color"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconBgPicker(!showIconBgPicker)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-3 bg-white"
                >
                  <div className="w-6 h-6 rounded-lg border-2" style={{ backgroundColor: iconBgColor }} />
                  <span className="flex-1 text-left">{iconBgColor}</span>
                  <Circle className="w-4 h-4 text-slate-400" />
                </button>
                {showIconBgPicker && (
                  <ColorPicker color={iconBgColor} onChange={setIconBgColor} onClose={() => setShowIconBgPicker(false)} 
                    title={language === 'bn' ? "ব্যাকগ্রাউন্ড রং নির্বাচন" : "Select Background Color"} colorOptions={bgColorOptions} />
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 mb-2 text-center">{language === 'bn' ? "প্রিভিউ" : "Preview"}</p>
              <div className="flex items-center justify-center gap-3 p-3 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100" style={{ backgroundColor: iconBgColor }}>
                  <AllIcon name={selectedIcon} size={24} color={iconColor} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{name || "Brand Name"}</p>
                  <p className="text-xs text-slate-500">{nameBn || "ব্র্যান্ডের নাম"}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Image Upload */}
        {uploadMethod === "image" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {language === 'bn' ? "ব্র্যান্ড ইমেজ আপলোড করুন" : "Upload Brand Image"}
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                <Circle className="w-3.5 h-3.5" />
                {language === 'bn' ? "ইমেজের ব্যাকগ্রাউন্ড রং" : "Image Background Color"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowImageBgPicker(!showImageBgPicker)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-3 bg-white"
                >
                  <div className="w-6 h-6 rounded-lg border-2" style={{ backgroundColor: imageBgColor }} />
                  <span className="flex-1 text-left">{imageBgColor}</span>
                  <Circle className="w-4 h-4 text-slate-400" />
                </button>
                {showImageBgPicker && (
                  <ColorPicker color={imageBgColor} onChange={setImageBgColor} onClose={() => setShowImageBgPicker(false)} 
                    title={language === 'bn' ? "ব্যাকগ্রাউন্ড রং নির্বাচন" : "Select Background Color"} colorOptions={bgColorOptions} />
                )}
              </div>
            </div>
          </>
        )}

        {error && <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>}
        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditMode ? (language === 'bn' ? "আপডেট সম্পন্ন!" : "Updated!") : (language === 'bn' ? "সফলভাবে যোগ করা হয়েছে!" : "Added!")}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={isLoading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isEditMode ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
            {isEditMode ? (language === 'bn' ? "আপডেট করুন" : "Update") : (language === 'bn' ? "সংরক্ষণ করুন" : "Save")}
          </button>
          {isEditMode && (
            <button type="button" onClick={handleCancel} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              {language === 'bn' ? "বাতিল করুন" : "Cancel"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddForm;