// components/EditForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle2,
  ImageIcon,
  Video,
  X,
  Bold,
  Italic,
  List,
  ChevronDown,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types
interface Category {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
}

interface SubCategory {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  categoryId: string;
}

interface Brand {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
}

interface Size {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
}

interface Color {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  hex: string;
}

interface Product {
  _id?: string;
  id?: string;
  name: string;
  nameBn?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  discountType?: string;
  stock?: number;
  category?: string;
  categoryId?: string;
  subCategory?: string;
  subCategoryId?: string;
  brand?: string;
  brandId?: string;
  sizes?: string[];
  sizeIds?: string[];
  colors?: string[];
  colorIds?: string[];
  description?: string;
  descriptionBn?: string;
  image?: string;
  multiImages?: string[];
  video?: string;
  slug?: string;
  active?: boolean;
  status?: string;
  sales?: number;
  section?: string;
  badge?: string;
  productType?: string;
}

interface EditFormProps {
  product: Product;
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
    oldPrice: number;
    discount: number;
    discountType: string;
    stock: number;
    category: string;
    subCategory: string;
    brand: string;
    sizes: string[];
    colors: string[];
    description: string;
    descriptionBn: string;
    image: string;
    multiImages: string[];
    video: string;
    slug: string;
    section: string;
    badge: string;
    productType: string;
    active: boolean;
    sales: number;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

// Options for select fields
const SECTION_OPTIONS = [
  { value: "new-arrival", labelEn: "New Arrival", labelBn: "নতুন আগমন" },
  { value: "best-seller", labelEn: "Best Seller", labelBn: "বেস্ট সেলার" },
  { value: "featured", labelEn: "Featured", labelBn: "ফিচার্ড" },
  { value: "trending", labelEn: "Trending", labelBn: "ট্রেন্ডিং" },
  { value: "sale", labelEn: "Sale", labelBn: "সেল" },
  { value: "limited-edition", labelEn: "Limited Edition", labelBn: "লিমিটেড সংস্করণ" },
  { value: "new", labelEn: "New", labelBn: "নতুন" },
  { value: "none", labelEn: "None", labelBn: "কোনটি নয়" },
];

const BADGE_OPTIONS = [
  { value: "hot", labelEn: "Hot 🔥", labelBn: "হট 🔥" },
  { value: "sale", labelEn: "Sale 💰", labelBn: "সেল 💰" },
  { value: "new", labelEn: "New 🆕", labelBn: "নতুন 🆕" },
  { value: "trending", labelEn: "Trending 📈", labelBn: "ট্রেন্ডিং 📈" },
  { value: "limited", labelEn: "Limited 🎯", labelBn: "লিমিটেড 🎯" },
  { value: "exclusive", labelEn: "Exclusive ✨", labelBn: "এক্সক্লুসিভ ✨" },
  { value: "best-seller", labelEn: "Best Seller 🏆", labelBn: "বেস্ট সেলার 🏆" },
  { value: "none", labelEn: "None", labelBn: "কোনটি নয়" },
];

const PRODUCT_TYPE_OPTIONS = [
  { value: "simple", labelEn: "Simple", labelBn: "সাধারণ" },
  { value: "variable", labelEn: "Variable (Size/Color)", labelBn: "ভেরিয়েবল (সাইজ/রং)" },
  { value: "digital", labelEn: "Digital", labelBn: "ডিজিটাল" },
  { value: "service", labelEn: "Service", labelBn: "সার্ভিস" },
  { value: "affiliate", labelEn: "Affiliate", labelBn: "অ্যাফিলিয়েট" },
];

const DISCOUNT_TYPE_OPTIONS = [
  { value: "flat", labelEn: "Flat (৳)", labelBn: "ফ্ল্যাট (৳)" },
  { value: "percentage", labelEn: "Percentage (%)", labelBn: "পার্সেন্টেজ (%)" },
];

const EditForm: React.FC<EditFormProps> = ({ product, categories, brands, sizes, colors }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const router = useRouter();

  // Form states
  const [name, setName] = useState<string>(product.name || "");
  const [nameBn, setNameBn] = useState<string>(product.nameBn || product.name || "");
  const [price, setPrice] = useState<number>(product.price || 0);
  const [oldPrice, setOldPrice] = useState<number>(product.oldPrice || 0);
  const [discount, setDiscount] = useState<number>(product.discount || 0);
  const [discountType, setDiscountType] = useState<string>(product.discountType || "percentage");
  const [stock, setStock] = useState<number>(product.stock || 0);
  const [categoryId, setCategoryId] = useState<string>(product.categoryId || product.category || "");
  const [subCategoryId, setSubCategoryId] = useState<string>(product.subCategoryId || product.subCategory || "");
  const [brandId, setBrandId] = useState<string>(product.brandId || product.brand || "");
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>(product.sizeIds || product.sizes || []);
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>(product.colorIds || product.colors || []);
  const [description, setDescription] = useState<string>(product.description || "");
  const [descriptionBn, setDescriptionBn] = useState<string>(product.descriptionBn || product.description || "");
  const [active, setActive] = useState<boolean>(product.active !== false && product.status !== "Inactive");

  // New fields
  const [section, setSection] = useState<string>(product.section || "none");
  const [badge, setBadge] = useState<string>(product.badge || "none");
  const [productType, setProductType] = useState<string>(product.productType || "simple");

  // Subcategory states
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState<boolean>(false);

  // UI states
  const [sizeSearch, setSizeSearch] = useState<string>("");
  const [colorSearch, setColorSearch] = useState<string>("");
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState<boolean>(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product.image || "");
  const [multiImages, setMultiImages] = useState<File[]>([]);
  const [multiImagePreviews, setMultiImagePreviews] = useState<string[]>(product.multiImages || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>("");

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!categoryId) {
        setSubCategories([]);
        setSubCategoryId("");
        return;
      }

      setIsLoadingSubCategories(true);
      try {
        const response = await fetch(`/api/subcategory?categoryId=${categoryId}`);
        const data = await response.json();

        if (data.success && data.data) {
          setSubCategories(data.data);
        } else {
          setSubCategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([]);
      } finally {
        setIsLoadingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubCategoryId("");
  }, [categoryId]);

  // Flag to prevent infinite loops
  const [isUpdatingFromPrice, setIsUpdatingFromPrice] = useState(false);
  const [isUpdatingFromDiscount, setIsUpdatingFromDiscount] = useState(false);

  // Calculate discount from price and oldPrice
  const calculateDiscountFromPrices = (regularPrice: number, sellingPrice: number, type: string) => {
    if (regularPrice <= 0 || sellingPrice <= 0 || regularPrice <= sellingPrice) {
      return 0;
    }
    if (type === "percentage") {
      return Math.round(((regularPrice - sellingPrice) / regularPrice) * 100);
    } else {
      return regularPrice - sellingPrice;
    }
  };

  // Calculate selling price from regular price and discount
  const calculatePriceFromDiscount = (regularPrice: number, discountAmount: number, type: string) => {
    if (regularPrice <= 0 || discountAmount <= 0) {
      return regularPrice;
    }
    if (type === "percentage") {
      const calculatedPrice = regularPrice - (regularPrice * discountAmount) / 100;
      return Math.round(calculatedPrice);
    } else {
      const calculatedPrice = regularPrice - discountAmount;
      return calculatedPrice > 0 ? calculatedPrice : 0;
    }
  };

  // Handle regular price change
  const handleOldPriceChange = (value: number) => {
    setOldPrice(value);
    if (value > 0 && price > 0 && value > price) {
      const newDiscount = calculateDiscountFromPrices(value, price, discountType);
      setDiscount(newDiscount);
    } else if (value > 0 && price > 0 && value <= price) {
      setPrice(value);
      setDiscount(0);
    } else if (value > 0 && price === 0) {
      setPrice(value);
      setDiscount(0);
    }
  };

  // Handle selling price change
  const handlePriceChange = (value: number) => {
    setPrice(value);
    if (oldPrice > 0 && value < oldPrice) {
      const newDiscount = calculateDiscountFromPrices(oldPrice, value, discountType);
      setDiscount(newDiscount);
    } else if (oldPrice > 0 && value >= oldPrice) {
      setDiscount(0);
      if (value > oldPrice) {
        setOldPrice(value);
      }
    } else if (oldPrice === 0 && value > 0) {
      setOldPrice(value);
      setDiscount(0);
    }
  };

  // Handle discount type change
  const handleDiscountTypeChange = (type: string) => {
    setDiscountType(type);
    if (oldPrice > 0 && price > 0 && oldPrice > price) {
      const newDiscount = calculateDiscountFromPrices(oldPrice, price, type);
      setDiscount(newDiscount);
    }
  };

  // Handle discount amount change
  const handleDiscountChange = (value: number) => {
    setDiscount(value);
    if (oldPrice > 0 && value > 0) {
      const newPrice = calculatePriceFromDiscount(oldPrice, value, discountType);
      setPrice(newPrice);
    } else if (value === 0 && oldPrice > 0) {
      setPrice(oldPrice);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== product.image) {
        URL.revokeObjectURL(imagePreview);
      }
      multiImagePreviews.forEach((url) => {
        if (url && !product.multiImages?.includes(url)) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreview, multiImagePreviews, product.image, product.multiImages]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImageFile(file);
      if (imagePreview && imagePreview !== product.image) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMultiImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(language === 'bn' ? `শুধু ইমেজ ফাইল সাপোর্টেড: ${file.name}` : `Only image files supported: ${file.name}`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(language === 'bn' ? `${file.name} সাইজ 2MB এর কম হতে হবে` : `${file.name} size must be less than 2MB`);
        return false;
      }
      return true;
    });

    setMultiImages((prev) => [...prev, ...validFiles]);
    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setMultiImagePreviews((prev) => [...prev, ...urls]);
  };

  const removeExistingImage = (imageUrl: string) => {
    setRemovedImages((prev) => [...prev, imageUrl]);
    setMultiImagePreviews((prev) => prev.filter((url) => url !== imageUrl));
  };

  const removeNewImage = (index: number) => {
    setMultiImages((prev) => prev.filter((_, i) => i !== index));
    setMultiImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error(language === 'bn' ? "শুধু ভিডিও ফাইল সাপোর্টেড" : "Only video files are supported");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(language === 'bn' ? "ভিডিও সাইজ 50MB এর কম হতে হবে" : "Video size must be less than 50MB");
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
      list: ["- ", ""],
    };
    const [prefix, suffix] = formatChars[type] || ["", ""];
    if (target === "en") {
      setDescription((prev) => prev + `${prefix}New Text${suffix}`);
    } else {
      setDescriptionBn((prev) => prev + `${prefix}নতুন টেক্সট${suffix}`);
    }
  };

  const filteredSizes = sizes.filter((s) =>
    (language === 'bn' ? s.nameBn || s.name : s.name).toLowerCase().includes(sizeSearch.toLowerCase())
  );

  const filteredColors = colors.filter((c) =>
    (language === 'bn' ? c.nameBn || c.name : c.name).toLowerCase().includes(colorSearch.toLowerCase())
  );

  const toggleSize = (sizeId: string) => {
    setSelectedSizeIds((prev) =>
      prev.includes(sizeId) ? prev.filter((id) => id !== sizeId) : [...prev, sizeId]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColorIds((prev) =>
      prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]
    );
  };

  const resetForm = () => {
    setName(product.name || "");
    setNameBn(product.nameBn || "");
    setPrice(product.price || 0);
    setOldPrice(product.oldPrice || 0);
    setDiscount(product.discount || 0);
    setDiscountType(product.discountType || "percentage");
    setStock(product.stock || 0);
    setCategoryId(product.categoryId || product.category || "");
    setSubCategoryId(product.subCategoryId || product.subCategory || "");
    setBrandId(product.brandId || product.brand || "");
    setSelectedSizeIds(product.sizeIds || product.sizes || []);
    setSelectedColorIds(product.colorIds || product.colors || []);
    setDescription(product.description || "");
    setDescriptionBn(product.descriptionBn || "");
    setActive(product.active !== false && product.status !== "Inactive");
    setSection(product.section || "none");
    setBadge(product.badge || "none");
    setProductType(product.productType || "simple");
    setImageFile(null);
    setImagePreview(product.image || "");
    setMultiImages([]);
    setMultiImagePreviews(product.multiImages || []);
    setRemovedImages([]);
    setVideoFile(null);
    setVideoName("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(language === 'bn' ? "পণ্যের নাম দিন" : "Enter product name");
      return;
    }

    if (!price || price <= 0) {
      toast.error(language === 'bn' ? "সঠিক মূল্য দিন" : "Enter valid price");
      return;
    }

    if (!categoryId) {
      toast.error(language === 'bn' ? "ক্যাটাগরি নির্বাচন করুন" : "Select category");
      return;
    }

    if (!brandId) {
      toast.error(language === 'bn' ? "ব্র্যান্ড নির্বাচন করুন" : "Select brand");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("id", product._id || product.id || "");
    formData.append("name", name.trim());
    formData.append("nameBn", nameBn.trim() || name.trim());
    formData.append("price", price.toString());
    const finalOldPrice = oldPrice > 0 && oldPrice > price ? oldPrice : price;
    formData.append("oldPrice", finalOldPrice.toString());
    formData.append("discount", discount.toString());
    formData.append("discountType", discountType);
    formData.append("stock", stock.toString());
    formData.append("category", categoryId);
    formData.append("subCategory", subCategoryId);
    formData.append("brand", brandId);
    formData.append("sizes", JSON.stringify(selectedSizeIds));
    formData.append("colors", JSON.stringify(selectedColorIds));
    formData.append("description", description);
    formData.append("descriptionBn", descriptionBn || description);
    formData.append("active", active.toString());
    formData.append("section", section);
    formData.append("badge", badge);
    formData.append("productType", productType);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    multiImages.forEach((file) => {
      formData.append("multiImages", file);
    });

    if (removedImages.length > 0) {
      formData.append("removeImages", JSON.stringify(removedImages));
    }

    if (videoFile) {
      formData.append("video", videoFile);
    }

    try {
      const res = await fetch("/api/product", {
        method: "PUT",
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (language === 'bn' ? "পণ্য আপডেট করতে ব্যর্থ" : "Failed to update product"));
      }

      if (data.success) {
        toast.success(data.message || (language === 'bn' ? "পণ্য সফলভাবে আপডেট হয়েছে!" : "Product updated successfully!"));
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          router.refresh();
          router.push(`/dashboard/products`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage = error instanceof Error ? error.message : (language === 'bn' ? "পণ্য আপডেট করতে ব্যর্থ" : "Failed to update product");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'bn' ? "পণ্য সম্পাদনা করুন" : "Edit Product"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {language === 'bn' ? "পণ্যের বিবরণ এবং মিডিয়া ফাইল আপডেট করুন" : "Update product details and media files"}
            </p>
          </div>
        </div>
        <Link href={`/dashboard/products`} className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">
          {language === 'bn' ? "পিছনে" : "Back"}
        </Link>
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
            {language === 'bn' ? "পণ্য সফলভাবে আপডেট করা হয়েছে!" : "Product updated successfully!"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "পণ্যের নাম (ইংরেজি) *" : "Product Name (English) *"}
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
                  {language === 'bn' ? "পণ্যের নাম (বাংলা)" : "Product Name (Bangla)"}
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

            {/* Price Section */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {language === 'bn' ? "নিয়মিত মূল্য (৳)" : "Regular Price (৳)"}
                    <span className="text-xs text-gray-400 ml-1">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="number"
                    value={oldPrice || ""}
                    onChange={(e) => handleOldPriceChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                    disabled={isLoading}
                    placeholder={language === 'bn' ? "নিয়মিত মূল্য" : "Regular price"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {language === 'bn' ? "বিক্রয় মূল্য (৳) *" : "Selling Price (৳) *"}
                  </label>
                  <input
                    type="number"
                    value={price || ""}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                    disabled={isLoading}
                    placeholder={language === 'bn' ? "বিক্রয় মূল্য" : "Selling price"}
                  />
                </div>
              </div>

              {(oldPrice > 0 && oldPrice > price) && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {language === 'bn' ? "ডিসকাউন্ট টাইপ" : "Discount Type"}
                      </label>
                      <select
                        value={discountType}
                        onChange={(e) => handleDiscountTypeChange(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                      >
                        {DISCOUNT_TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {language === 'bn' ? option.labelBn : option.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {language === 'bn' ? discountType === "percentage" ? "ডিসকাউন্ট (%)" : "ডিসকাউন্ট (৳)" : discountType === "percentage" ? "Discount (%)" : "Discount (৳)"}
                      </label>
                      <input
                        type="number"
                        value={discount || ""}
                        onChange={(e) => handleDiscountChange(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "স্টক পরিমাণ" : "Stock Quantity"}
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

            {/* Brand, Category, SubCategory */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "ব্র্যান্ড *" : "Brand *"}
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                >
                  <option value="">{language === 'bn' ? "-- ব্র্যান্ড নির্বাচন করুন --" : "-- Select Brand --"}</option>
                  {brands.map((b) => (
                    <option key={b._id || b.id} value={b._id || b.id}>
                      {language === 'bn' ? b.nameBn || b.name : b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "ক্যাটাগরি *" : "Category *"}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                >
                  <option value="">{language === 'bn' ? "-- ক্যাটাগরি নির্বাচন করুন --" : "-- Select Category --"}</option>
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {language === 'bn' ? c.nameBn || c.name : c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "সাব-ক্যাটাগরি" : "Subcategory"}
                  <span className="text-xs text-gray-400 ml-1">(ঐচ্ছিক)</span>
                </label>
                <select
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading || isLoadingSubCategories}
                >
                  <option value="">{language === 'bn' ? "-- সাব-ক্যাটাগরি নির্বাচন করুন --" : "-- Select Subcategory --"}</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id || sub.id} value={sub._id || sub.id}>
                      {language === 'bn' ? sub.nameBn || sub.name : sub.name}
                    </option>
                  ))}
                </select>
                {isLoadingSubCategories && (
                  <p className="text-xs text-gray-400 mt-1">
                    {language === 'bn' ? "সাব-ক্যাটাগরি লোড হচ্ছে..." : "Loading subcategories..."}
                  </p>
                )}
                {!isLoadingSubCategories && subCategories.length === 0 && categoryId && (
                  <p className="text-xs text-amber-600 mt-1">
                    {language === 'bn' ? "এই ক্যাটাগরির অধীনে কোনো সাব-ক্যাটাগরি নেই" : "No subcategories found"}
                  </p>
                )}
              </div>
            </div>

            {/* Section, Badge, Product Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "সেকশন" : "Section"}
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                >
                  {SECTION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {language === 'bn' ? option.labelBn : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "ব্যাজ" : "Badge"}
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                >
                  {BADGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {language === 'bn' ? option.labelBn : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "প্রোডাক্ট টাইপ" : "Product Type"}
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm disabled:bg-slate-50"
                  disabled={isLoading}
                >
                  {PRODUCT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {language === 'bn' ? option.labelBn : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sizes and Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sizes Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "সাইজ" : "Sizes"}
                </label>
                <button
                  type="button"
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm"
                  disabled={isLoading}
                >
                  <span className="truncate text-gray-600">
                    {selectedSizeIds.length > 0
                      ? selectedSizeIds.map((id) => {
                        const size = sizes.find((s) => (s._id || s.id) === id);
                        return size?.name;
                      }).filter(Boolean).join(", ")
                      : language === 'bn' ? "সাইজ নির্বাচন করুন..." : "Select sizes..."}
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
                          placeholder={language === 'bn' ? "সাইজ খুঁজুন..." : "Search sizes..."}
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
                          onClick={() => toggleSize(size._id || size.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedSizeIds.includes(size._id || size.id)
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          {language === 'bn' ? size.nameBn || size.name : size.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Colors Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "রং" : "Colors"}
                </label>
                <button
                  type="button"
                  onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm"
                  disabled={isLoading}
                >
                  <span className="truncate text-gray-600">
                    {selectedColorIds.length > 0
                      ? selectedColorIds.map((id) => {
                        const color = colors.find((c) => (c._id || c.id) === id);
                        return language === 'bn' ? color?.nameBn || color?.name : color?.name;
                      }).filter(Boolean).join(", ")
                      : language === 'bn' ? "রং নির্বাচন করুন..." : "Select colors..."}
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
                          placeholder={language === 'bn' ? "রং খুঁজুন..." : "Search colors..."}
                          value={colorSearch}
                          onChange={(e) => setColorSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                      {filteredColors.map((color) => (
                        <button
                          key={color._id || color.id}
                          type="button"
                          onClick={() => toggleColor(color._id || color.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedColorIds.includes(color._id || color.id)
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: color.hex }} />
                          {language === 'bn' ? color.nameBn || color.name : color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {language === 'bn' ? "বিবরণ (ইংরেজি)" : "Description (English)"}
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                    <button type="button" onClick={() => addTextFormatting("bold", "en")} className="p-1 hover:bg-white rounded">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => addTextFormatting("italic", "en")} className="p-1 hover:bg-white rounded">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => addTextFormatting("list", "en")} className="p-1 hover:bg-white rounded">
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
                  {language === 'bn' ? "বিবরণ (বাংলা)" : "Description (Bangla)"}
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                    <button type="button" onClick={() => addTextFormatting("bold", "bn")} className="p-1 hover:bg-white rounded">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => addTextFormatting("italic", "bn")} className="p-1 hover:bg-white rounded">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => addTextFormatting("list", "bn")} className="p-1 hover:bg-white rounded">
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

            {/* Status */}
            <div className="w-40">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {language === 'bn' ? "পণ্য স্ট্যাটাস" : "Product Status"}
              </label>
              <select
                value={active ? "active" : "inactive"}
                onChange={(e) => setActive(e.target.value === "active")}
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm"
                disabled={isLoading}
              >
                <option value="active">{language === 'bn' ? "সক্রিয়" : "Active"}</option>
                <option value="inactive">{language === 'bn' ? "নিষ্ক্রিয়" : "Inactive"}</option>
              </select>
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {language === 'bn' ? "প্রধান ছবি" : "Main Image"}
              </label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-28 w-28 object-cover rounded-xl mx-auto" />
                    <button
                      type="button"
                      onClick={() => {
                        if (imagePreview && imagePreview !== product.image) {
                          URL.revokeObjectURL(imagePreview);
                        }
                        setImageFile(null);
                        setImagePreview(product.image || "");
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="mt-4">
                  <label className="cursor-pointer bg-white font-semibold text-indigo-600">
                    <span>{language === 'bn' ? "ছবি পরিবর্তন করুন" : "Change image"}</span>
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="sr-only" disabled={isLoading} />
                  </label>
                </div>
              </div>
            </div>

            {/* Multiple Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {language === 'bn' ? "একাধিক ছবি" : "Multiple Images"}
              </label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                {multiImagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4 max-h-40 overflow-y-auto">
                    {multiImagePreviews.map((url, idx) => {
                      const isExisting = product.multiImages?.includes(url);
                      return (
                        <div key={idx} className="relative">
                          <img src={url} alt="Preview" className="h-14 w-14 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => {
                              if (isExisting) {
                                removeExistingImage(url);
                              } else {
                                removeNewImage(idx);
                              }
                            }}
                            className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          {isExisting && (
                            <div className="absolute -bottom-2 left-0 right-0 text-center">
                              <span className="text-[10px] bg-blue-500 text-white px-1 rounded">Existing</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <label className="cursor-pointer bg-white font-semibold text-indigo-600">
                  <span>{language === 'bn' ? "ছবি যোগ করুন" : "Add images"}</span>
                  <input type="file" multiple accept="image/*" onChange={handleMultiImagesChange} className="sr-only" disabled={isLoading} />
                </label>
              </div>
            </div>

            {/* Video */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {language === 'bn' ? "ভিডিও" : "Video"}
              </label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                {videoName ? (
                  <div className="flex items-center justify-between gap-2 mb-3 px-3 py-2 bg-indigo-50 rounded-lg">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs text-indigo-600 flex-1 truncate">{videoName}</span>
                    <button type="button" onClick={removeVideo} className="p-0.5 text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : product.video ? (
                  <div className="flex items-center justify-between gap-2 mb-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <Video className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 flex-1 truncate">Video exists</span>
                  </div>
                ) : null}
                <label className="cursor-pointer bg-white font-semibold text-indigo-600">
                  <span>{language === 'bn' ? "ভিডিও আপলোড করুন" : "Upload video"}</span>
                  <input type="file" accept="video/*" onChange={handleVideoChange} className="sr-only" disabled={isLoading} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200"
            disabled={isLoading}
          >
            {language === 'bn' ? "রিসেট" : "Reset"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {language === 'bn' ? "পণ্য আপডেট করুন" : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;