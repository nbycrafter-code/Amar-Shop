"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle2,
  ImageIcon,
  Upload,
  Video,
  X,
  Bold,
  Italic,
  List,
  Heading,
  Link2,
  ChevronDown,
  Search,
  Trash2,
} from "lucide-react";
import { Category, Brand, Size, Color, Product } from "../../data/initialData";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  brands: Brand[];
  sizes: Size[];
  colors: Color[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    price: number;
    stock: number;
    category: string;
    brand: string;
    sizes: string[];
    colors: string[];
    description: string;
    descriptionBn: string;
    image: string;
    multiImages: string[];
    video: string;
    slug: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

const AddForm: React.FC<ProductFormProps> = ({
  categories,
  brands,
  sizes,
  colors,
  products,
  setProducts,
}) => {
  const { isBn } = useApp();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [nameBn, setNameBn] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [descriptionBn, setDescriptionBn] = useState<string>("");

  const [sizeSearch, setSizeSearch] = useState<string>("");
  const [colorSearch, setColorSearch] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [multiImages, setMultiImages] = useState<File[]>([]);
  const [multiImagePreviews, setMultiImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>("");
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState<boolean>(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      multiImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreview, multiImagePreviews]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(isBn ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(isBn ? "ইমেজ সাইজ 2MB এর কম হতে হবে" : "Image size must be less than 2MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMultiImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(isBn ? `শুধু ইমেজ ফাইল সাপোর্টেড: ${file.name}` : `Only image files supported: ${file.name}`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(isBn ? `${file.name} সাইজ 2MB এর কম হতে হবে` : `${file.name} size must be less than 2MB`);
        return false;
      }
      return true;
    });
    
    setMultiImages(validFiles);
    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setMultiImagePreviews(urls);
  };

  const removeMultiImage = (index: number) => {
    setMultiImages(prev => prev.filter((_, i) => i !== index));
    setMultiImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error(isBn ? "শুধু ভিডিও ফাইল সাপোর্টেড" : "Only video files are supported");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(isBn ? "ভিডিও সাইজ 50MB এর কম হতে হবে" : "Video size must be less than 50MB");
        return;
      }
      setVideoFile(file);
      setVideoName(file.name);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoName("");
  };

  const addTextFormatting = (type: string, target: "en" | "bn") => {
    const formatChars: Record<string, [string, string]> = {
      bold: ["**", "**"],
      italic: ["*", "*"],
      heading: ["### ", ""],
      list: ["- ", ""],
      link: ["[", "](https://...)"],
    };
    const [prefix, suffix] = formatChars[type] || ["", ""];
    if (target === "en") {
      setDescription((prev) => prev + `${prefix}New Text${suffix}`);
    } else {
      setDescriptionBn((prev) => prev + `${prefix}নতুন টেক্সট${suffix}`);
    }
  };

  const filteredSizes = sizes.filter((s) =>
    s.name.toLowerCase().includes(sizeSearch.toLowerCase()),
  );
  const filteredColors = colors.filter(
    (c) =>
      c.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
      (c.nameBn && c.nameBn.includes(colorSearch)),
  );

  const toggleSize = (sizeName: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeName)
        ? prev.filter((s) => s !== sizeName)
        : [...prev, sizeName],
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((c) => c !== colorId)
        : [...prev, colorId],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError(isBn ? "পণ্যের নাম দিন" : "Enter product name");
      return;
    }
    
    if (!price || price <= 0) {
      setError(isBn ? "সঠিক মূল্য দিন" : "Enter valid price");
      return;
    }
    
    if (!category) {
      setError(isBn ? "ক্যাটাগরি নির্বাচন করুন" : "Select category");
      return;
    }
    
    if (!brand) {
      setError(isBn ? "ব্র্যান্ড নির্বাচন করুন" : "Select brand");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("nameBn", nameBn.trim() || name.trim());
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("sizes", JSON.stringify(selectedSizes));
    formData.append("colors", JSON.stringify(selectedColors));
    formData.append("description", description);
    formData.append("descriptionBn", descriptionBn || description);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    
    multiImages.forEach((file) => {
      formData.append("multiImages", file);
    });
    
    if (videoFile) {
      formData.append("video", videoFile);
    }

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "পণ্য সংরক্ষণ করতে ব্যর্থ" : "Failed to save product"));
      }

      if (data.success && data.data) {
        const newProduct: Product = {
          _id: data.data._id,
          id: data.data._id,
          name: data.data.name,
          nameBn: data.data.nameBn,
          price: data.data.price,
          stock: data.data.stock,
          category: data.data.category,
          brand: data.data.brand,
          sizes: data.data.sizes,
          colors: data.data.colors,
          description: data.data.description,
          descriptionBn: data.data.descriptionBn,
          image: data.data.image,
          multiImages: data.data.multiImages,
          video: data.data.video,
          status: "Active",
          sales: 0,
        };
        
        setProducts([newProduct, ...products]);
        toast.success(data.message || (isBn ? "পণ্য সফলভাবে সংরক্ষণ হয়েছে!" : "Product saved successfully!"));
        
        // Reset form
        setName("");
        setNameBn("");
        setPrice(0);
        setStock(0);
        setCategory("");
        setBrand("");
        setSelectedSizes([]);
        setSelectedColors([]);
        setDescription("");
        setDescriptionBn("");
        setImageFile(null);
        setImagePreview("");
        setMultiImages([]);
        setMultiImagePreviews([]);
        setVideoFile(null);
        setVideoName("");
        setSuccess(true);
        
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = error instanceof Error ? error.message : (isBn ? "পণ্য সংরক্ষণ করতে ব্যর্থ" : "Failed to save product");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isBn ? "নতুন পণ্য যোগ করুন" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isBn
                ? "পণ্যের সমস্ত বিবরণ এবং মিডিয়া ফাইল আপলোড করুন"
                : "Enter all details and upload media files"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            {isBn
              ? "পণ্য সফলভাবে যোগ করা হয়েছে!"
              : "Product added successfully!"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "পণ্যের নাম (ইংরেজি) *" : "Product Name (English) *"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "পণ্যের নাম (বাংলা)" : "Product Name (Bangla)"}
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "মূল্য (৳) *" : "Price (৳) *"}
                </label>
                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "স্টক পরিমাণ" : "Stock Quantity"}
                </label>
                <input
                  type="number"
                  value={stock || ""}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "ব্র্যান্ড *" : "Brand *"}
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                >
                  <option value="">
                    {isBn
                      ? "-- ব্র্যান্ড নির্বাচন করুন --"
                      : "-- Select Brand --"}
                  </option>
                  {brands.map((b) => (
                    <option key={b._id || b.id} value={b.name}>
                      {isBn ? b.nameBn || b.name : b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "ক্যাটাগরি *" : "Category *"}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                >
                  <option value="">
                    {isBn
                      ? "-- ক্যাটাগরি নির্বাচন করুন --"
                      : "-- Select Category --"}
                  </option>
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c.name}>
                      {isBn ? c.nameBn || c.name : c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sizes & Colors Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "সাইজ" : "Sizes"}
                </label>
                <button
                  type="button"
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm"
                  disabled={isLoading}
                >
                  <span className="truncate text-gray-600">
                    {selectedSizes.length > 0
                      ? selectedSizes.join(", ")
                      : isBn
                        ? "সাইজ নির্বাচন করুন..."
                        : "Select sizes..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {sizeDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder={isBn ? "সাইজ খুঁজুন..." : "Search sizes..."}
                          value={sizeSearch}
                          onChange={(e) => setSizeSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                      {filteredSizes.map((size) => (
                        <button
                          key={size._id || size.id}
                          type="button"
                          onClick={() => toggleSize(size.name)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedSizes.includes(size.name) ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "রং" : "Colors"}
                </label>
                <button
                  type="button"
                  onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm"
                  disabled={isLoading}
                >
                  <span className="truncate text-gray-600">
                    {selectedColors.length > 0
                      ? selectedColors.join(", ")
                      : isBn
                        ? "রং নির্বাচন করুন..."
                        : "Select colors..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {colorDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder={isBn ? "রং খুঁজুন..." : "Search colors..."}
                          value={colorSearch}
                          onChange={(e) => setColorSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                      {filteredColors.map((col) => (
                        <button
                          key={col._id || col.id}
                          type="button"
                          onClick={() => toggleColor(col.hex)}
                          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedColors.includes(col.hex) ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: col.hex }}
                          />
                          {isBn ? col.nameBn || col.name : col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Editors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"}
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => addTextFormatting("bold", "en")}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("italic", "en")}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("list", "en")}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-white border-0 focus:ring-0 focus:outline-none text-sm resize-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"}
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => addTextFormatting("bold", "bn")}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("italic", "bn")}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("list", "bn")}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    className="w-full p-3 bg-white border-0 focus:ring-0 focus:outline-none text-sm resize-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? "প্রধান ছবি *" : "Main Image *"}
              </label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-28 w-28 object-cover rounded-xl mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="mt-4">
                  <label className="cursor-pointer bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                    <span>{isBn ? "ফাইল সিলেক্ট করুন" : "Upload a file"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? "একাধিক ছবি" : "Multiple Images"}
              </label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors">
                {multiImagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {multiImagePreviews.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${idx + 1}`}
                          className="h-14 w-14 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeMultiImage(idx)}
                          className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="cursor-pointer bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                  <span>
                    {isBn ? "ফাইল সিলেক্ট করুন" : "Upload multiple files"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultiImagesChange}
                    className="sr-only"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? "ভিডিও" : "Video"}
              </label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors">
                {videoName && (
                  <div className="flex items-center justify-between gap-2 mb-3 px-3 py-2 bg-indigo-50 rounded-lg">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs text-indigo-600 flex-1 truncate">{videoName}</span>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="p-0.5 text-red-500 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                  <span>
                    {isBn ? "ভিডিও ফাইল সিলেক্ট করুন" : "Select video file"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="sr-only"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setName("");
              setNameBn("");
              setPrice(0);
              setStock(0);
              setCategory("");
              setBrand("");
              setSelectedSizes([]);
              setSelectedColors([]);
              setDescription("");
              setDescriptionBn("");
              setImageFile(null);
              setImagePreview("");
              setMultiImages([]);
              setMultiImagePreviews([]);
              setVideoFile(null);
              setVideoName("");
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all"
            disabled={isLoading}
          >
            {isBn ? "রিসেট" : "Reset"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isBn ? "পণ্য প্রকাশ করুন" : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;