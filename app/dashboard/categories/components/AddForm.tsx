"use client";
import React, { useState, useRef } from "react";
import { Category } from "../../data/initialData";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";
import AllIcon from "@/components/AllIcon";
import { CheckCircle2, Palette, Plus, ShoppingBag, Trash2, Upload, Image } from "lucide-react";

interface AddCategoryFormProps {
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
    slug: string;
    icon: string;
    iconColor?: string;
    image?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

// Predefined color options
const colorOptions = [
  { name: "Blue", value: "#3B82F6", class: "bg-blue-500" },
  { name: "Purple", value: "#8B5CF6", class: "bg-purple-500" },
  { name: "Pink", value: "#EC4899", class: "bg-pink-500" },
  { name: "Green", value: "#10B981", class: "bg-green-500" },
  { name: "Yellow", value: "#F59E0B", class: "bg-yellow-500" },
  { name: "Red", value: "#EF4444", class: "bg-red-500" },
  { name: "Indigo", value: "#6366F1", class: "bg-indigo-500" },
  { name: "Teal", value: "#14B8A6", class: "bg-teal-500" },
  { name: "Orange", value: "#F97316", class: "bg-orange-500" },
  { name: "Cyan", value: "#06B6D4", class: "bg-cyan-500" },
  { name: "Rose", value: "#F43F5E", class: "bg-rose-500" },
  { name: "Amber", value: "#FBBF24", class: "bg-amber-500" },
  { name: "Emerald", value: "#059669", class: "bg-emerald-500" },
  { name: "Slate", value: "#64748B", class: "bg-slate-500" },
  { name: "Gray", value: "#6B7280", class: "bg-gray-500" },
];

const AddForm: React.FC<AddCategoryFormProps> = ({
  categories,
  setCategories,
}) => {
  const { isBn } = useApp();

  const [name, setName] = useState<string>("");
  const [nameBn, setNameBn] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("ShoppingBag");
  const [iconColor, setIconColor] = useState<string>("#3B82F6");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [uploadMethod, setUploadMethod] = useState<"icon" | "image">("icon");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(
          isBn ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported",
        );
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error(
          isBn
            ? "ইমেজ সাইজ 2MB এর কম হতে হবে"
            : "Image size must be less than 2MB",
        );
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(
        isBn ? "ক্যাটাগরির নাম (ইংরেজি) দিন" : "Enter category name (English)",
      );
      return;
    }

    if (!nameBn.trim()) {
      setError(
        isBn ? "ক্যাটাগরির নাম (বাংলা) দিন" : "Enter category name (Bangla)",
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    let formData;
    let headers = {};

    if (uploadMethod === "image" && selectedImage) {
      formData = new FormData();
      formData.append("name", name.trim());
      formData.append("nameBn", nameBn.trim());
      formData.append("image", selectedImage);
      headers = {};
    } else {
      formData = JSON.stringify({
        name: name.trim(),
        nameBn: nameBn.trim(),
        icon: selectedIcon,
        iconColor: iconColor,
      });
      headers = { "Content-Type": "application/json" };
    }

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            (isBn
              ? "ক্যাটাগরি সংরক্ষণ করতে ব্যর্থ"
              : "Failed to save category"),
        );
      }

      if (data.success && data.data) {
        const newCategory: Category = {
          _id: data.data._id,
          id: data.data._id,
          name: data.data.name,
          nameBn: data.data.nameBn,
          icon: data.data.icon,
          iconColor: data.data.iconColor,
          image: data.data.image,
          slug: data.data.slug,
          active: data.data.active,
          itemCount: 0,
        };

        setCategories([newCategory, ...categories]);
        toast.success(
          data.message ||
            (isBn
              ? "ক্যাটাগরি সফলভাবে সংরক্ষণ হয়েছে!"
              : "Category saved successfully!"),
        );

        setName("");
        setNameBn("");
        setSelectedIcon("ShoppingBag");
        setIconColor("#3B82F6");
        setSelectedImage(null);
        setImagePreview("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setShowIconPicker(false);
      } else {
        throw new Error(
          isBn ? "ক্যাটাগরি সংরক্ষণ করতে ব্যর্থ" : "Failed to save category",
        );
      }
    } catch (error) {
      console.error("Error saving category:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : isBn
            ? "ক্যাটাগরি সংরক্ষণ করতে ব্যর্থ"
            : "Failed to save category";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        {isBn ? "নতুন ক্যাটাগরি যোগ করুন" : "Add New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ক্যাটাগরির নাম (ইংরেজি)" : "Category Name (English)"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Winter Collection"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ক্যাটাগরির নাম (বাংলা)" : "Category Name (Bangla)"}
          </label>
          <input
            type="text"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            placeholder="উদাঃ শীতকালীন সংগ্রহ"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        {/* Upload Method Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "আপলোড পদ্ধতি" : "Upload Method"}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setUploadMethod("icon")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                uploadMethod === "icon"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isBn ? "আইকন" : "Icon"}
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod("image")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                uploadMethod === "image"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Image className="w-4 h-4" />
              {isBn ? "ইমেজ" : "Image"}
            </button>
          </div>
        </div>

        {/* Icon Selection Field */}
        {uploadMethod === "icon" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {isBn ? "আইকন সিলেক্ট করুন" : "Select Icon"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center gap-2 bg-white"
                  disabled={isLoading}
                >
                  <AllIcon name={selectedIcon} size={20} color={iconColor} />
                  <span className="flex-1 text-left">{selectedIcon}</span>
                  <Plus className="w-4 h-4 text-slate-400" />
                </button>

                {showIconPicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg">
                    <AllIcon
                      showAllIcons={true}
                      onSelectIcon={(iconName: string) => {
                        setSelectedIcon(iconName);
                        setShowIconPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Color Selection Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                {isBn ? "আইকনের রং নির্বাচন করুন" : "Select Icon Color"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center gap-3 bg-white"
                  disabled={isLoading}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-slate-200 shadow-sm"
                    style={{ backgroundColor: iconColor }}
                  />
                  <span className="flex-1 text-left">{iconColor}</span>
                  <Palette className="w-4 h-4 text-slate-400" />
                </button>

                {showColorPicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                    {/* Preset Colors */}
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-2">
                        {isBn ? "প্রিসেট রং" : "Preset Colors"}
                      </p>
                      <div className="grid grid-cols-8 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => {
                              setIconColor(color.value);
                              setShowColorPicker(false);
                            }}
                            className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
                              iconColor === color.value
                                ? "ring-2 ring-blue-500 ring-offset-2"
                                : ""
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Custom Color Picker */}
                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        {isBn ? "কাস্টম রং" : "Custom Color"}
                      </p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded border border-slate-200 text-sm"
                          placeholder="#000000"
                        />
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(false)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          {isBn ? "ঠিক আছে" : "OK"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 mb-2 text-center">
                {isBn ? "প্রিভিউ" : "Preview"}
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  <AllIcon name={selectedIcon} size={24} color={iconColor} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {name || "Category Name"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {nameBn || "ক্যাটাগরির নাম"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Image Upload Field */}
        {uploadMethod === "image" && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {isBn ? "ক্যাটাগরি ইমেজ আপলোড করুন" : "Upload Category Image"}
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    {isBn
                      ? "ইমেজ সিলেক্ট করতে ক্লিক করুন"
                      : "Click to select image"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, GIF (Max 2MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 mx-auto rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
            {error}
          </p>
        )}

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              {isBn ? "সফলভাবে যোগ করা হয়েছে!" : "Category added successfully!"}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isBn ? "সংরক্ষণ করুন" : "Save Category"}
        </button>
      </form>
    </div>
  );
};

export default AddForm;