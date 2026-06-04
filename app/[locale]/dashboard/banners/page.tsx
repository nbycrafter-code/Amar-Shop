// app/admin/banners/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  Link as LinkIcon,
  Palette,
  Globe,
  Video,
  Play
} from "lucide-react";
import Image from "next/image";

interface BannerType {
  _id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  buttonText: string;
  buttonTextBn: string;
  buttonLink: string;
  bgImage: string;
  mobileImage?: string;
  textColor: string;
  highlightColor: string;
  gradient: string;
  order: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  pageType: string;
  pagePosition: string;
  bgVideo?: string;
  mediaType?: string;
}

// Page type options
const pageTypeOptions = [
  { name: "Homepage", value: "homepage", bn: "হোমপেজ" },
  { name: "Shop", value: "shop", bn: "শপ" },
  { name: "Product Details", value: "product-details", bn: "পণ্য বিস্তারিত" },
  { name: "Category", value: "category", bn: "ক্যাটাগরি" },
  { name: "Cart", value: "cart", bn: "কার্ট" },
  { name: "Checkout", value: "checkout", bn: "চেকআউট" },
  { name: "About", value: "about", bn: "আমাদের সম্পর্কে" },
  { name: "Contact", value: "contact", bn: "যোগাযোগ" },
  { name: "Blog", value: "blog", bn: "ব্লগ" },
  { name: "All Pages", value: "all", bn: "সব পৃষ্ঠা" },
];

// Page position options
const pagePositionOptions = [
  { name: "Hero Section (Top)", value: "hero", bn: "হিরো সেকশন (শীর্ষ)" },
  { name: "Banner Grid - Position 1", value: "banner-grid-1", bn: "ব্যানার গ্রিড - অবস্থান ১" },
  { name: "Banner Grid - Position 2", value: "banner-grid-2", bn: "ব্যানার গ্রিড - অবস্থান ২" },
  { name: "Banner Grid - Position 3", value: "banner-grid-3", bn: "ব্যানার গ্রিড - অবস্থান ৩" },
  { name: "Banner Grid - Position 4", value: "banner-grid-4", bn: "ব্যানার গ্রিড - অবস্থান ৪" },
  { name: "Promo Section", value: "promo", bn: "প্রোমো সেকশন" },
  { name: "Category Section", value: "category", bn: "বিভাগ সেকশন" },
  { name: "Bottom Section", value: "bottom", bn: "নিচের সেকশন" },
  { name: "Sidebar", value: "sidebar", bn: "সাইডবার" },
  { name: "Popup Modal", value: "popup", bn: "পপআপ মোডাল" },
];

// Color options for text and highlight
const textColorOptions = [
  { name: "White", value: "text-white" },
  { name: "Black", value: "text-black" },
  { name: "Gray", value: "text-gray-700" },
  { name: "Blue", value: "text-blue-600" },
];

const highlightColorOptions = [
  { name: "Lime", value: "text-lime-300" },
  { name: "Yellow", value: "text-yellow-300" },
  { name: "Orange", value: "text-orange-300" },
  { name: "Purple", value: "text-purple-300" },
  { name: "Pink", value: "text-pink-300" },
  { name: "Red", value: "text-red-300" },
  { name: "Green", value: "text-green-300" },
  { name: "Blue", value: "text-blue-300" },
];

const gradientOptions = [
  { name: "Dark to Light", value: "from-black/30 via-black/15 to-transparent" },
  { name: "Black to Transparent", value: "from-black/50 via-black/25 to-transparent" },
  { name: "Dark Blue", value: "from-blue-900/40 via-blue-900/20 to-transparent" },
  { name: "None", value: "" },
];

export default function AdminBanners() {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerType | null>(null);
  const [search, setSearch] = useState("");
  const [pageTypeFilter, setPageTypeFilter] = useState("");
  const [pagePositionFilter, setPagePositionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  // Refresh function after upload
  const refreshImages = () => {
    setImageTimestamp(Date.now());
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banner");
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      language === 'bn' ? "আপনি কি এই ব্যানারটি ডিলিট করতে চান?" : "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    setIsDeleting(id);
    try {
      const res = await fetch("/api/banner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(language === 'bn' ? "ব্যানার ডিলিট করা হয়েছে!" : "Banner deleted successfully!");
        fetchBanners();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(language === 'bn' ? "ব্যানার ডিলিট করতে ব্যর্থ" : "Failed to delete banner");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsToggling(id);
    try {
      const res = await fetch("/api/banner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          language === 'bn'
            ? `ব্যানার ${!currentStatus ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে`
            : `Banner ${!currentStatus ? "activated" : "deactivated"}`
        );
        fetchBanners();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast.error(language === 'bn' ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status");
    } finally {
      setIsToggling(null);
    }
  };

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    const currentIndex = banners.findIndex(b => b._id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= banners.length) return;

    const updatedBanners = [...banners];
    const temp = updatedBanners[currentIndex].order;
    updatedBanners[currentIndex].order = updatedBanners[newIndex].order;
    updatedBanners[newIndex].order = temp;

    try {
      const res = await fetch("/api/banner/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { id: updatedBanners[currentIndex]._id, order: updatedBanners[currentIndex].order },
            { id: updatedBanners[newIndex]._id, order: updatedBanners[newIndex].order },
          ],
        }),
      });

      if (res.ok) {
        setBanners(updatedBanners.sort((a, b) => a.order - b.order));
        toast.success(language === 'bn' ? "অর্ডার আপডেট হয়েছে" : "Order updated");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(language === 'bn' ? "অর্ডার আপডেট করতে ব্যর্থ" : "Failed to update order");
    }
  };

  // Filter and pagination
  const filteredBanners = banners.filter(
    (b) => {
      const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.titleBn.toLowerCase().includes(search.toLowerCase());
      const matchesPageType = !pageTypeFilter || b.pageType === pageTypeFilter;
      const matchesPagePosition = !pagePositionFilter || b.pagePosition === pagePositionFilter;
      return matchesSearch && matchesPageType && matchesPagePosition;
    }
  );

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBanners = filteredBanners.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'bn' ? "ব্যানার ম্যানেজমেন্ট" : "Banner Management"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredBanners.length} {language === 'bn' ? "টি ব্যানার পাওয়া গেছে" : "banners found"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={language === 'bn' ? "ব্যানার খুঁজুন..." : "Search banners..."}
                className="w-64 px-4 py-2 pl-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Page Type Filter */}
            <select
              value={pageTypeFilter}
              onChange={(e) => {
                setPageTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">{language === 'bn' ? "সব পৃষ্ঠা" : "All Pages"}</option>
              {pageTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {language === 'bn' ? opt.bn : opt.name}
                </option>
              ))}
            </select>

            {/* Page Position Filter */}
            <select
              value={pagePositionFilter}
              onChange={(e) => {
                setPagePositionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">{language === 'bn' ? "সব অবস্থান" : "All Positions"}</option>
              {pagePositionOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {language === 'bn' ? opt.bn : opt.name}
                </option>
              ))}
            </select>

            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value={10}>10 {language === 'bn' ? "টি" : "items"}</option>
              <option value={20}>20 {language === 'bn' ? "টি" : "items"}</option>
              <option value={50}>50 {language === 'bn' ? "টি" : "items"}</option>
            </select>

            {/* Add button */}
            <button
              onClick={() => {
                setEditingBanner(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              {language === 'bn' ? "নতুন ব্যানার" : "New Banner"}
            </button>
          </div>
        </div>

        {/* Banners Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "ছবি" : "Image"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "শিরোনাম" : "Title"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "পৃষ্ঠা" : "Page"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "অবস্থান" : "Position"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "মিডিয়া" : "Media"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "অর্ডার" : "Order"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "স্ট্যাটাস" : "Status"}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {language === 'bn' ? "অ্যাকশন" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentBanners.length > 0 ? (
                  currentBanners.map((banner) => (
                    <tr key={banner._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                          {banner.mediaType === "video" && banner.bgVideo ? (
                            <video
                              src={banner.bgVideo}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              // src={banner.bgImage}
                              src={`${banner.bgImage}?t=${imageTimestamp}`}
                              alt={banner.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{banner.title}</p>
                          <p className="text-sm text-gray-500">{banner.titleBn}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {language === 'bn'
                            ? pageTypeOptions.find(opt => opt.value === banner.pageType)?.bn || banner.pageType
                            : pageTypeOptions.find(opt => opt.value === banner.pageType)?.name || banner.pageType
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {language === 'bn'
                            ? pagePositionOptions.find(opt => opt.value === banner.pagePosition)?.bn || banner.pagePosition
                            : pagePositionOptions.find(opt => opt.value === banner.pagePosition)?.name || banner.pagePosition
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {banner.mediaType === "video" ? (
                          <span className="flex items-center gap-1 text-xs text-purple-600">
                            <Video className="w-3 h-3" /> Video
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <ImageIcon className="w-3 h-3" /> Image
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{banner.order}</span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleMoveOrder(banner._id, "up")}
                              disabled={banner.order === 1}
                              className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <MoveUp className="w-3 h-3 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleMoveOrder(banner._id, "down")}
                              disabled={banner.order === banners.length}
                              className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                            >
                              <MoveDown className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(banner._id, banner.active)}
                          disabled={isToggling === banner._id}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${banner.active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } disabled:opacity-50`}
                        >
                          {isToggling === banner._id ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                          ) : banner.active ? (
                            language === 'bn' ? "সক্রিয়" : "Active"
                          ) : (
                            language === 'bn' ? "নিষ্ক্রিয়" : "Inactive"
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingBanner(banner);
                              setShowModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title={language === 'bn' ? "এডিট" : "Edit"}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            disabled={isDeleting === banner._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title={language === 'bn' ? "ডিলিট" : "Delete"}
                          >
                            {isDeleting === banner._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
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
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      {language === 'bn' ? "কোন ব্যানার পাওয়া যায়নি" : "No banners found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              {language === 'bn' ? "দেখানো হচ্ছে" : "Showing"} {startIndex + 1} {language === 'bn' ? "থেকে" : "to"}{" "}
              {Math.min(startIndex + itemsPerPage, filteredBanners.length)} {language === 'bn' ? "সর্বমোট" : "of"}{" "}
              {filteredBanners.length} {language === 'bn' ? "টি" : "entries"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                {language === 'bn' ? "পূর্ববর্তী" : "Prev"}
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                {language === 'bn' ? "পরবর্তী" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Banner Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchBanners();
          }}
          language={language === 'bn' ? 'bn' : 'en'}
        />
      )}
    </div>
  );
}

// Banner Modal Component
function BannerModal({ banner, onClose, onSuccess, language }: any) {
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    titleBn: banner?.titleBn || "",
    subtitle: banner?.subtitle || "",
    subtitleBn: banner?.subtitleBn || "",
    buttonText: banner?.buttonText || "Shop Now",
    buttonTextBn: banner?.buttonTextBn || "কিনুন এখন",
    buttonLink: banner?.buttonLink || "/shop",
    textColor: banner?.textColor || "text-white",
    highlightColor: banner?.highlightColor || "text-lime-300",
    gradient: banner?.gradient || "from-black/30 via-black/15 to-transparent",
    order: banner?.order || 0,
    pageType: banner?.pageType || "homepage",
    pagePosition: banner?.pagePosition || "hero",
  });

  const [bgImage, setBgImage] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState(banner?.bgImage || "");
  const [bgVideo, setBgVideo] = useState<File | null>(null);
  const [bgVideoPreview, setBgVideoPreview] = useState(banner?.bgVideo || "");
  const [mediaType, setMediaType] = useState<"image" | "video">(
    banner?.bgVideo ? "video" : "image"
  );
  const [loading, setLoading] = useState(false);

  const bgImageRef = useRef<HTMLInputElement>(null);
  const bgVideoRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(language === 'bn' ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === 'bn' ? "ইমেজ সাইজ 5MB এর কম হতে হবে" : "Image size must be less than 5MB");
        return;
      }
      setBgImage(file);
      const previewUrl = URL.createObjectURL(file);
      setBgImagePreview(previewUrl);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setBgVideo(file);
      const previewUrl = URL.createObjectURL(file);
      setBgVideoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mediaType === "video" && !bgVideo && !banner?.bgVideo) {
      toast.error(language === 'bn' ? "ভিডিও ফাইল প্রয়োজন" : "Video file is required");
      return;
    }

    if (mediaType === "image" && !bgImage && !banner?.bgImage) {
      toast.error(language === 'bn' ? "ইমেজ ফাইল প্রয়োজন" : "Image file is required");
      return;
    }

    setLoading(true);

    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      submitData.append(key, (formData as any)[key]);
    });

    submitData.append("mediaType", mediaType);

    if (bgImage) {
      submitData.append("bgImage", bgImage);
    }
    if (bgVideo) {
      submitData.append("bgVideo", bgVideo);
    }

    if (banner?._id) {
      submitData.append("id", banner._id);
    }

    try {
      const url = banner?._id ? "/api/banner" : "/api/banner";
      const method = banner?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: submitData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          banner
            ? (language === 'bn' ? "ব্যানার আপডেট হয়েছে!" : "Banner updated successfully!")
            : (language === 'bn' ? "ব্যানার তৈরি হয়েছে!" : "Banner created successfully!")
        );
        onSuccess();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error(language === 'bn' ? "ব্যানার সংরক্ষণ করতে ব্যর্থ" : "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {banner
              ? language === 'bn' ? "ব্যানার এডিট করুন" : "Edit Banner"
              : language === 'bn' ? "নতুন ব্যানার তৈরি করুন" : "Create New Banner"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'bn' ? "মিডিয়া টাইপ" : "Media Type"}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaTypeRadio"
                  value="image"
                  checked={mediaType === "image"}
                  onChange={(e) => setMediaType(e.target.value as "image")}
                  className="w-4 h-4 text-blue-600"
                />
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm">{language === 'bn' ? "ইমেজ" : "Image"}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaTypeRadio"
                  value="video"
                  checked={mediaType === "video"}
                  onChange={(e) => setMediaType(e.target.value as "video")}
                  className="w-4 h-4 text-blue-600"
                />
                <Video className="w-4 h-4" />
                <span className="text-sm">{language === 'bn' ? "ভিডিও" : "Video"}</span>
              </label>
            </div>
          </div>

          {/* Title Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (English) *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (বাংলা) *
              </label>
              <input
                type="text"
                name="titleBn"
                value={formData.titleBn}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="শিরোনাম লিখুন"
              />
            </div>
          </div>

          {/* Subtitle Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle (English)
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle (বাংলা)
              </label>
              <input
                type="text"
                name="subtitleBn"
                value={formData.subtitleBn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="উপশিরোনাম লিখুন"
              />
            </div>
          </div>

          {/* Button Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text (English)
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Shop Now"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text (বাংলা)
              </label>
              <input
                type="text"
                name="buttonTextBn"
                value={formData.buttonTextBn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="কিনুন এখন"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Link
              </label>
              <input
                type="text"
                name="buttonLink"
                value={formData.buttonLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="/shop"
              />
            </div>
          </div>

          {/* Page Type and Position Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'bn' ? "পৃষ্ঠার ধরন" : "Page Type"} *
              </label>
              <select
                name="pageType"
                value={formData.pageType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {pageTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {language === 'bn' ? option.bn : option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'bn' ? "এই ব্যানারটি কোন পৃষ্ঠায় দেখাবে" : "Select which page this banner will appear on"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'bn' ? "পৃষ্ঠার অবস্থান" : "Page Position"} *
              </label>
              <select
                name="pagePosition"
                value={formData.pagePosition}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {pagePositionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {language === 'bn' ? option.bn : option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'bn' ? "পৃষ্ঠার কোন অংশে দেখাবে" : "Select which position on the page"}
              </p>
            </div>
          </div>

          {/* Image Upload (for image type) */}
          {mediaType === "image" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image *
              </label>
              <div
                onClick={() => bgImageRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition"
              >
                {bgImagePreview ? (
                  <div className="relative">
                    <img
                      src={bgImagePreview}
                      alt="Background preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBgImagePreview("");
                        setBgImage(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload background image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </>
                )}
              </div>
              <input
                ref={bgImageRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Video Upload (for video type) */}
          {mediaType === "video" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Video *
              </label>
              <div
                onClick={() => bgVideoRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition"
              >
                {bgVideoPreview ? (
                  <div className="relative">
                    <video
                      src={bgVideoPreview}
                      controls
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBgVideoPreview("");
                        setBgVideo(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload background video</p>
                    <p className="text-xs text-gray-400 mt-1">MP4, WebM up to 50MB</p>
                  </>
                )}
              </div>
              <input
                ref={bgVideoRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />

              {/* Optional: Thumbnail Image for Video */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'bn' ? "থাম্বনেইল ইমেজ (অপশনাল)" : "Thumbnail Image (Optional)"}
                </label>
                <div
                  onClick={() => bgImageRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-blue-400 transition"
                >
                  {bgImagePreview ? (
                    <div className="relative">
                      <img
                        src={bgImagePreview}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBgImagePreview("");
                          setBgImage(null);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Click to upload thumbnail (optional)</p>
                    </>
                  )}
                </div>
                <input
                  ref={bgImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Styling Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <select
                name="textColor"
                value={formData.textColor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {textColorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Highlight Color
              </label>
              <select
                name="highlightColor"
                value={formData.highlightColor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {highlightColorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gradient Overlay
              </label>
              <select
                name="gradient"
                value={formData.gradient}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {gradientOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              min="0"
            />
            <p className="text-xs text-gray-400 mt-1">
              {language === 'bn' ? "ছোট সংখ্যা আগে দেখাবে" : "Smaller numbers appear first"}
            </p>
          </div>

          {/* Preview Section */}
          {(bgImagePreview || bgVideoPreview) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {language === 'bn' ? "প্রিভিউ" : "Preview"}
              </h3>
              <div className="relative rounded-lg overflow-hidden h-40">
                {mediaType === "video" && bgVideoPreview ? (
                  <video
                    src={bgVideoPreview}
                    className="w-full h-full object-cover"
                    controls
                    poster={bgImagePreview || undefined}
                  />
                ) : bgImagePreview && (
                  <img
                    src={bgImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-r ${formData.gradient}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <p className={`text-sm font-semibold ${formData.highlightColor}`}>
                      {formData.subtitle || (language === 'bn' ? "উপশিরোনাম" : "Subtitle")}
                    </p>
                    <h2 className={`text-xl font-bold ${formData.textColor}`}>
                      {formData.title || (language === 'bn' ? "শিরোনাম" : "Title")}
                    </h2>
                    <button className="mt-2 px-4 py-1 bg-white/20 rounded-full text-xs">
                      {formData.buttonText || "Button"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              {language === 'bn' ? "বাতিল" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {banner
                ? (language === 'bn' ? "আপডেট করুন" : "Update")
                : (language === 'bn' ? "তৈরি করুন" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}