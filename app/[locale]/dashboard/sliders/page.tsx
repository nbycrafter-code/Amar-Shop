// app/admin/sliders/page.tsx
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
  Play,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Grid3x3,
  List,
  LayoutGrid,
  Star,
  TrendingUp,
  Eye as ViewIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Zap,
  Layers,
  Sparkles,
  Moon,
  Sun,
  Settings
} from "lucide-react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface SliderType {
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
  views?: number;
  clicks?: number;
  ctr?: number;
}

// Enhanced color options with preview
const textColorOptions = [
  { name: "White", value: "text-white", hex: "#FFFFFF", bgHint: "bg-gray-800" },
  { name: "Black", value: "text-black", hex: "#000000", bgHint: "bg-gray-100" },
  { name: "Gray", value: "text-gray-700", hex: "#374151", bgHint: "bg-gray-100" },
  { name: "Blue", value: "text-blue-600", hex: "#2563EB", bgHint: "bg-gray-100" },
  { name: "Gold", value: "text-amber-400", hex: "#FBBF24", bgHint: "bg-gray-800" },
  { name: "Silver", value: "text-gray-300", hex: "#D1D5DB", bgHint: "bg-gray-800" },
];

const highlightColorOptions = [
  { name: "Lime", value: "text-lime-400", hex: "#A3E635" },
  { name: "Yellow", value: "text-amber-400", hex: "#FBBF24" },
  { name: "Orange", value: "text-orange-400", hex: "#FB923C" },
  { name: "Purple", value: "text-purple-400", hex: "#C084FC" },
  { name: "Pink", value: "text-pink-400", hex: "#F472B6" },
  { name: "Red", value: "text-red-400", hex: "#F87171" },
  { name: "Green", value: "text-emerald-400", hex: "#34D399" },
  { name: "Cyan", value: "text-cyan-400", hex: "#22D3EE" },
];

const gradientOptions = [
  { name: "Dark to Light", value: "from-black/50 via-black/20 to-transparent" },
  { name: "Deep Black", value: "from-black/70 via-black/40 to-transparent" },
  { name: "Dark Blue", value: "from-blue-900/60 via-blue-900/30 to-transparent" },
  { name: "Purple Dream", value: "from-purple-900/60 via-purple-900/30 to-transparent" },
  { name: "Sunset", value: "from-orange-900/50 via-orange-800/25 to-transparent" },
  { name: "Teal", value: "from-teal-900/50 via-teal-800/25 to-transparent" },
  { name: "None", value: "" },
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function AdminSliders() {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const [sliders, setSliders] = useState<SliderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<SliderType | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedSliders, setSelectedSliders] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"order" | "views" | "clicks" | "ctr">("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showStats, setShowStats] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  // fetchSliders ফাংশন আপডেট করুন
  const fetchSliders = async () => {
    try {
      const res = await fetch("/api/slider");
      const data = await res.json();
      if (data.success) {
        // ডেটাগুলোকে কনভার্ট করুন
        const formattedSliders = data.data.map((slider: any) => ({
          ...slider,
          startDate: slider.startDate ? new Date(slider.startDate).toISOString() : undefined,
          endDate: slider.endDate ? new Date(slider.endDate).toISOString() : undefined,
        }));
        setSliders(formattedSliders);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      toast.error("Failed to fetch sliders");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSliders();
    toast.success(language === 'bn' ? "ডাটা রিফ্রেশ করা হয়েছে" : "Data refreshed");
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      language === 'bn' ? "আপনি কি এই ব্যানারটি ডিলিট করতে চান?" : "Are you sure you want to delete this slider?"
    );
    if (!confirmDelete) return;

    setIsDeleting(id);
    try {
      const res = await fetch("/api/slider", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(language === 'bn' ? "ব্যানার ডিলিট করা হয়েছে!" : "Slider deleted successfully!");
        fetchSliders();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error(language === 'bn' ? "ব্যানার ডিলিট করতে ব্যর্থ" : "Failed to delete slider");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSliders.length === 0) return;
    const confirmDelete = confirm(
      language === 'bn' ? `${selectedSliders.length} টি ব্যানার ডিলিট করতে চান?` : `Delete ${selectedSliders.length} sliders?`
    );
    if (!confirmDelete) return;

    for (const id of selectedSliders) {
      await fetch("/api/slider", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
    toast.success(`${selectedSliders.length} ${language === 'bn' ? "টি ব্যানার ডিলিট করা হয়েছে" : "sliders deleted"}`);
    setSelectedSliders([]);
    fetchSliders();
  };

  const handleBulkStatus = async (status: boolean) => {
    for (const id of selectedSliders) {
      await fetch("/api/slider", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: status }),
      });
    }
    toast.success(`${selectedSliders.length} ${language === 'bn' ? "টি ব্যানার আপডেট করা হয়েছে" : "sliders updated"}`);
    setSelectedSliders([]);
    fetchSliders();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsToggling(id);
    try {
      const res = await fetch("/api/slider", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          language === 'bn'
            ? `ব্যানার ${!currentStatus ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে`
            : `Slider ${!currentStatus ? "activated" : "deactivated"}`
        );
        fetchSliders();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error toggling slider status:", error);
      toast.error(language === 'bn' ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status");
    } finally {
      setIsToggling(null);
    }
  };

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    const currentIndex = sliders.findIndex(b => b._id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sliders.length) return;

    const updatedSliders = [...sliders];
    const temp = updatedSliders[currentIndex].order;
    updatedSliders[currentIndex].order = updatedSliders[newIndex].order;
    updatedSliders[newIndex].order = temp;

    try {
      const res = await fetch("/api/slider/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { id: updatedSliders[currentIndex]._id, order: updatedSliders[currentIndex].order },
            { id: updatedSliders[newIndex]._id, order: updatedSliders[newIndex].order },
          ],
        }),
      });

      if (res.ok) {
        setSliders(updatedSliders.sort((a, b) => a.order - b.order));
        toast.success(language === 'bn' ? "অর্ডার আপডেট হয়েছে" : "Order updated");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(language === 'bn' ? "অর্ডার আপডেট করতে ব্যর্থ" : "Failed to update order");
    }
  };

  const handleDuplicate = async (slider: SliderType) => {
    try {
      // প্রথমে স্লাইডার ডেটা ফেচ করুন
      const res = await fetch(`/api/slider?id=${slider._id}`);
      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to fetch slider data");
        return;
      }

      const originalSlider = data.data;

      // FormData তৈরি করুন
      const formData = new FormData();
      formData.append("title", `${originalSlider.title} (Copy)`);
      formData.append("titleBn", `${originalSlider.titleBn} (কপি)`);
      formData.append("subtitle", originalSlider.subtitle || "");
      formData.append("subtitleBn", originalSlider.subtitleBn || "");
      formData.append("buttonText", originalSlider.buttonText || "Shop Now");
      formData.append("buttonTextBn", originalSlider.buttonTextBn || "কিনুন এখন");
      formData.append("buttonLink", originalSlider.buttonLink || "/shop");
      formData.append("textColor", originalSlider.textColor || "text-white");
      formData.append("highlightColor", originalSlider.highlightColor || "text-lime-400");
      formData.append("gradient", originalSlider.gradient || "from-black/50 via-black/20 to-transparent");
      formData.append("order", String(sliders.length + 1));
      formData.append("active", "true");
      formData.append("mediaType", originalSlider.bgVideo ? "video" : "image");

      // নোট: ইমেজ/ভিডিও ফাইল কপি করা হবে না, শুধু রেফারেন্স নেওয়া হবে
      if (originalSlider.bgImage) {
        // ইমেজ URL থেকে ফাইল ফেচ করে সেট করা প্রয়োজন
        // এটা এভয়েড করার জন্য আমরা শুধু টেক্সট ফিল্ড কপি করছি
      }

      const duplicateRes = await fetch("/api/slider", {
        method: "POST",
        body: formData,
      });

      const duplicateData = await duplicateRes.json();

      if (duplicateData.success) {
        toast.success(language === 'bn' ? "ব্যানার কপি করা হয়েছে" : "Slider duplicated");
        fetchSliders();
      } else {
        toast.error(duplicateData.error || "Failed to duplicate");
      }
    } catch (error) {
      console.error("Error duplicating slider:", error);
      toast.error(language === 'bn' ? "কপি করতে ব্যর্থ" : "Failed to duplicate");
    }
  };

  // Filter and sort sliders
  const filteredSliders = sliders
    .filter((b) => {
      const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.titleBn.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" ||
        (filterStatus === "active" && b.active) ||
        (filterStatus === "inactive" && !b.active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "order") {
        return sortOrder === "asc" ? a.order - b.order : b.order - a.order;
      } else if (sortBy === "views") {
        return sortOrder === "asc" ? (a.views || 0) - (b.views || 0) : (b.views || 0) - (a.views || 0);
      } else if (sortBy === "clicks") {
        return sortOrder === "asc" ? (a.clicks || 0) - (b.clicks || 0) : (b.clicks || 0) - (a.clicks || 0);
      } else {
        return sortOrder === "asc" ? (a.ctr || 0) - (b.ctr || 0) : (b.ctr || 0) - (a.ctr || 0);
      }
    });

  const totalPages = Math.ceil(filteredSliders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSliders = filteredSliders.slice(startIndex, startIndex + itemsPerPage);

  // Calculate stats
  const stats = {
    total: sliders.length,
    active: sliders.filter(s => s.active).length,
    inactive: sliders.filter(s => !s.active).length,
    totalViews: sliders.reduce((sum, s) => sum + (s.views || 0), 0),
    totalClicks: sliders.reduce((sum, s) => sum + (s.clicks || 0), 0),
    avgCtr: (sliders.reduce((sum, s) => sum + (s.ctr || 0), 0) / sliders.length).toFixed(1),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading sliders...</p>
        </div>
      </div>
    );
  }

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Animated Header */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <LayoutGrid className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {language === 'bn' ? "ব্যানার ম্যানেজমেন্ট" : "Slider Management"}
                  </h1>
                </div>
                <p className="text-gray-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {filteredSliders.length} {language === 'bn' ? "টি ব্যানার পাওয়া গেছে" : "sliders found"}
                  {showStats && (
                    <span className="text-xs bg-blue-50 px-2 py-1 rounded-full">
                      {stats.totalViews} views • {stats.totalClicks} clicks
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Refresh Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`} />
                </motion.button>

                {/* Stats Toggle */}
                <button
                  onClick={() => setShowStats(!showStats)}
                  className={`p-2 rounded-lg border transition-all shadow-sm ${showStats ? "bg-blue-50 border-blue-300 text-blue-600" : "bg-white border-gray-200 text-gray-600"
                    }`}
                >
                  <TrendingUp className="w-4 h-4" />
                </button>

                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded transition ${viewMode === "table" ? "bg-blue-600 text-white" : "text-gray-500"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded transition ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-500"}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={language === 'bn' ? "ব্যানার খুঁজুন..." : "Search sliders..."}
                    className="w-64 px-4 py-2 pl-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Filter by Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value="all">{language === 'bn' ? "সব" : "All"}</option>
                  <option value="active">{language === 'bn' ? "সক্রিয়" : "Active"}</option>
                  <option value="inactive">{language === 'bn' ? "নিষ্ক্রিয়" : "Inactive"}</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value="order">{language === 'bn' ? "অর্ডার" : "Order"}</option>
                  <option value="views">{language === 'bn' ? "ভিউ" : "Views"}</option>
                  <option value="clicks">{language === 'bn' ? "ক্লিক" : "Clicks"}</option>
                  <option value="ctr">CTR</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-2 bg-white rounded-lg border border-gray-200"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>

                {/* Items per page */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value={10}>10 {language === 'bn' ? "টি" : "items"}</option>
                  <option value={20}>20 {language === 'bn' ? "টি" : "items"}</option>
                  <option value={50}>50 {language === 'bn' ? "টি" : "items"}</option>
                </select>

                {/* Add button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingSlider(null);
                    setShowModal(true);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 transition shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'bn' ? "নতুন ব্যানার" : "New Slider"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500">Total Sliders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500">Avg. CTR</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgCtr}%</p>
              </div>
            </motion.div>
          )}

          {/* Bulk Actions Bar */}
          {selectedSliders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedSliders.length} {language === 'bn' ? "টি নির্বাচিত" : "selected"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatus(true)}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  {language === 'bn' ? "সক্রিয় করুন" : "Activate"}
                </button>
                <button
                  onClick={() => handleBulkStatus(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                >
                  {language === 'bn' ? "নিষ্ক্রিয় করুন" : "Deactivate"}
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  {language === 'bn' ? "ডিলিট করুন" : "Delete"}
                </button>
                <button
                  onClick={() => setSelectedSliders([])}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  {language === 'bn' ? "বাতিল" : "Cancel"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Sliders Display */}
          {viewMode === "table" ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSliders.length === currentSliders.length && currentSliders.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSliders(currentSliders.map(s => s._id));
                            } else {
                              setSelectedSliders([]);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'bn' ? "ছবি" : "Image"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'bn' ? "শিরোনাম" : "Title"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'bn' ? "অর্ডার" : "Order"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'bn' ? "স্ট্যাটাস" : "Status"}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Analytics
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'bn' ? "অ্যাকশন" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {currentSliders.length > 0 ? (
                        currentSliders.map((slider, idx) => (
                          <motion.tr
                            key={slider._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.03 }}
                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all group"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedSliders.includes(slider._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSliders([...selectedSliders, slider._id]);
                                  } else {
                                    setSelectedSliders(selectedSliders.filter(id => id !== slider._id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                                <img
                                  src={slider.bgImage}
                                  alt={slider.title}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-gray-900">{slider.title}</p>
                                <p className="text-sm text-gray-500">{slider.titleBn}</p>
                                {slider.buttonLink && (
                                  <p className="text-xs text-blue-500 mt-1 truncate max-w-xs">{slider.buttonLink}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-medium text-gray-700">
                                  {slider.order}
                                </div>
                                <div className="flex flex-col">
                                  <button
                                    onClick={() => handleMoveOrder(slider._id, "up")}
                                    disabled={slider.order === 1}
                                    className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 transition"
                                  >
                                    <MoveUp className="w-3 h-3 text-gray-500" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveOrder(slider._id, "down")}
                                    disabled={slider.order === sliders.length}
                                    className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 transition"
                                  >
                                    <MoveDown className="w-3 h-3 text-gray-500" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleToggleStatus(slider._id, slider.active)}
                                disabled={isToggling === slider._id}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${slider.active
                                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:shadow-md"
                                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-md"
                                  } disabled:opacity-50`}
                              >
                                {isToggling === slider._id ? (
                                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                                ) : slider.active ? (
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {language === 'bn' ? "সক্রিয়" : "Active"}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" /> {language === 'bn' ? "নিষ্ক্রিয়" : "Inactive"}
                                  </span>
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-3 text-xs">
                                <Tooltip.Root>
                                  <Tooltip.Trigger>
                                    <div className="text-center">
                                      <p className="font-semibold text-gray-900">{slider.views || 0}</p>
                                      <p className="text-gray-500">Views</p>
                                    </div>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                    Total views
                                  </Tooltip.Content>
                                </Tooltip.Root>
                                <div className="w-px bg-gray-200"></div>
                                <Tooltip.Root>
                                  <Tooltip.Trigger>
                                    <div className="text-center">
                                      <p className="font-semibold text-gray-900">{slider.clicks || 0}</p>
                                      <p className="text-gray-500">Clicks</p>
                                    </div>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                    Total clicks
                                  </Tooltip.Content>
                                </Tooltip.Root>
                                <div className="w-px bg-gray-200"></div>
                                <Tooltip.Root>
                                  <Tooltip.Trigger>
                                    <div className="text-center">
                                      <p className="font-semibold text-green-600">{slider.ctr || 0}%</p>
                                      <p className="text-gray-500">CTR</p>
                                    </div>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                    Click-through rate
                                  </Tooltip.Content>
                                </Tooltip.Root>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      onClick={() => handleDuplicate(slider)}
                                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                    Duplicate
                                  </Tooltip.Content>
                                </Tooltip.Root>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      onClick={() => {
                                        setEditingSlider(slider);
                                        setShowModal(true);
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                    Edit
                                  </Tooltip.Content>
                                </Tooltip.Root>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      onClick={() => handleDelete(slider._id)}
                                      disabled={isDeleting === slider._id}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                    >
                                      {isDeleting === slider._id ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs">
                                    Delete
                                  </Tooltip.Content>
                                </Tooltip.Root>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <td colSpan={7} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium">{language === 'bn' ? "কোন ব্যানার পাওয়া যায়নি" : "No sliders found"}</p>
                              <button
                                onClick={() => {
                                  setEditingSlider(null);
                                  setShowModal(true);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                              >
                                + {language === 'bn' ? "প্রথম ব্যানার তৈরি করুন" : "Create first slider"}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            // Grid View
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {currentSliders.map((slider, idx) => (
                  <motion.div
                    key={slider._id}
                    variants={fadeInUp}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={slider.bgImage}
                        alt={slider.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <button
                          onClick={() => handleToggleStatus(slider._id, slider.active)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${slider.active
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                            }`}
                        >
                          {slider.active ? "Active" : "Inactive"}
                        </button>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1">
                        <input
                          type="checkbox"
                          checked={selectedSliders.includes(slider._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSliders([...selectedSliders, slider._id]);
                            } else {
                              setSelectedSliders(selectedSliders.filter(id => id !== slider._id));
                            }
                          }}
                          className="w-4 h-4 rounded border-white bg-white/20 checked:bg-blue-600"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{slider.title}</h3>
                      <p className="text-sm text-gray-500">{slider.titleBn}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MoveUp className="w-3 h-3" />
                          <span>Order: {slider.order}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingSlider(slider);
                              setShowModal(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(slider)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(slider._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                        <div className="text-center">
                          <p className="font-semibold">{slider.views || 0}</p>
                          <p className="text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{slider.clicks || 0}</p>
                          <p className="text-gray-500">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">{slider.ctr || 0}%</p>
                          <p className="text-gray-500">CTR</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mt-8"
            >
              <p className="text-sm text-gray-500">
                {language === 'bn' ? "দেখানো হচ্ছে" : "Showing"} {startIndex + 1} {language === 'bn' ? "থেকে" : "to"}{" "}
                {Math.min(startIndex + itemsPerPage, filteredSliders.length)} {language === 'bn' ? "সর্বমোট" : "of"}{" "}
                {filteredSliders.length} {language === 'bn' ? "টি" : "entries"}
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:bg-gray-50 transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {language === 'bn' ? "পূর্ববর্তী" : "Prev"}
                </motion.button>
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
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${currentPage === pageNum
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                          : "border border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 hover:bg-gray-50 transition flex items-center gap-1"
                >
                  {language === 'bn' ? "পরবর্তী" : "Next"}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Slider Modal */}
      {showModal && (
        <EnhancedSliderModal
          slider={editingSlider}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchSliders();
          }}
          language={language === 'bn' ? 'bn' : 'en'}
        />
      )}
    </Tooltip.Provider>
  );
}

// For Bangladesh timezone specifically - এই ফাংশনটি সঠিকভাবে কাজ করবে
function formatDateForInputBD(date: string | Date | undefined): string {
  if (!date) return "";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    // বাংলাদেশ টাইমজোনের জন্য (UTC+6)
    // datetime-local ইনপুট লোকাল টাইম আশা করে, তাই আমাদের UTC+6 কে লোকাল দেখাতে হবে
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
}

// Enhanced Slider Modal Component
function EnhancedSliderModal({ slider, onClose, onSuccess, language }: any) {
  const [activeTab, setActiveTab] = useState("content");

  // Debug: কনসোলে ডেটা দেখুন
  useEffect(() => {
    console.log("Slider received in modal:", slider);
    console.log("Start date raw:", slider?.startDate);
    console.log("End date raw:", slider?.endDate);

    // ফর্ম ডেটা সেট করুন যখন slider পরিবর্তন হয়
    if (slider) {
      setFormData({
        title: slider.title || "",
        titleBn: slider.titleBn || "",
        subtitle: slider.subtitle || "",
        subtitleBn: slider.subtitleBn || "",
        buttonText: slider.buttonText || "Shop Now",
        buttonTextBn: slider.buttonTextBn || "কিনুন এখন",
        buttonLink: slider.buttonLink || "/shop",
        textColor: slider.textColor || "text-white",
        highlightColor: slider.highlightColor || "text-lime-400",
        gradient: slider.gradient || "from-black/50 via-black/20 to-transparent",
        order: slider.order || 0,
        startDate: slider.startDate ? formatDateForInputBD(slider.startDate) : "",
        endDate: slider.endDate ? formatDateForInputBD(slider.endDate) : "",
      });

      // ইমেজ প্রিভিউ সেট করুন
      if (slider.bgImage) setBgImagePreview(slider.bgImage);
      if (slider.mobileImage) setMobileImagePreview(slider.mobileImage);
      if (slider.bgVideo) {
        setBgVideoPreview(slider.bgVideo);
        setMediaType("video");
      }
    }
  }, [slider]);

  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    subtitle: "",
    subtitleBn: "",
    buttonText: "Shop Now",
    buttonTextBn: "কিনুন এখন",
    buttonLink: "/shop",
    textColor: "text-white",
    highlightColor: "text-lime-400",
    gradient: "from-black/50 via-black/20 to-transparent",
    order: 0,
    startDate: "",
    endDate: "",
  });

  const [bgImage, setBgImage] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState(slider?.bgImage || "");
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState(slider?.mobileImage || "");
  const [bgVideo, setBgVideo] = useState<File | null>(null);
  const [bgVideoPreview, setBgVideoPreview] = useState(slider?.bgVideo || "");
  const [mediaType, setMediaType] = useState<"image" | "video">(
    slider?.bgVideo ? "video" : "image"
  );
  const [loading, setLoading] = useState(false);

  const bgImageRef = useRef<HTMLInputElement>(null);
  const mobileImageRef = useRef<HTMLInputElement>(null);
  const bgVideoRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") => {
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
      if (type === "desktop") {
        setBgImage(file);
        const previewUrl = URL.createObjectURL(file);
        setBgImagePreview(previewUrl);
      } else {
        setMobileImage(file);
        const previewUrl = URL.createObjectURL(file);
        setMobileImagePreview(previewUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      const value = (formData as any)[key];
      if (value !== undefined && value !== null && value !== "") {
        submitData.append(key, String(value));
      }
    });

    submitData.append("mediaType", mediaType);

    if (bgImage) submitData.append("bgImage", bgImage);
    if (mobileImage) submitData.append("mobileImage", mobileImage);
    if (bgVideo) submitData.append("bgVideo", bgVideo);

    if (slider?._id) submitData.append("id", slider._id);

    // ডিবাগিং জন্য লগ করুন
    console.log("Submitting dates:", {
      startDate: formData.startDate,
      endDate: formData.endDate
    });

    try {
      const res = await fetch("/api/slider", {
        method: slider?._id ? "PUT" : "POST",
        body: submitData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(slider ? "Updated!" : "Created!");
        onSuccess();
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save slider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                {slider ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {slider
                  ? language === 'bn' ? "ব্যানার এডিট করুন" : "Edit Slider"
                  : language === 'bn' ? "নতুন ব্যানার তৈরি করুন" : "Create New Slider"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="p-6">
            <Tabs.List className="flex gap-2 border-b border-gray-200 mb-6">
              <Tabs.Trigger
                value="content"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition"
              >
                {language === 'bn' ? "কন্টেন্ট" : "Content"}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="media"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition"
              >
                {language === 'bn' ? "মিডিয়া" : "Media"}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="styling"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition"
              >
                {language === 'bn' ? "স্টাইলিং" : "Styling"}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="schedule"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition"
              >
                {language === 'bn' ? "সময়সূচি" : "Schedule"}
              </Tabs.Trigger>
            </Tabs.List>

            <form onSubmit={handleSubmit}>
              <Tabs.Content value="content" className="space-y-6">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="শিরোনাম লিখুন"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle (English)
                    </label>
                    <textarea
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter subtitle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle (বাংলা)
                    </label>
                    <textarea
                      name="subtitleBn"
                      value={formData.subtitleBn}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="উপশিরোনাম লিখুন"
                    />
                  </div>
                </div>

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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="/shop"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
                    min="0"
                  />
                </div>
              </Tabs.Content>

              <Tabs.Content value="media" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bn' ? "মিডিয়া টাইপ" : "Media Type"}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="mediaType"
                        value="image"
                        checked={mediaType === "image"}
                        onChange={(e) => setMediaType(e.target.value as "image")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">{language === 'bn' ? "ইমেজ" : "Image"}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="mediaType"
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

                {mediaType === "image" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desktop Background Image *
                      </label>
                      <div
                        onClick={() => bgImageRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition group"
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
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload desktop background image</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB • Recommended: 1920x1080</p>
                          </>
                        )}
                      </div>
                      <input
                        ref={bgImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, "desktop")}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Image (Optional)
                      </label>
                      <div
                        onClick={() => mobileImageRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition group"
                      >
                        {mobileImagePreview ? (
                          <div className="relative">
                            <img
                              src={mobileImagePreview}
                              alt="Mobile preview"
                              className="w-32 h-32 object-cover rounded mx-auto"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMobileImagePreview("");
                                setMobileImage(null);
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload mobile image</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 750x1334</p>
                          </>
                        )}
                      </div>
                      <input
                        ref={mobileImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, "mobile")}
                        className="hidden"
                      />
                    </div>
                  </>
                )}

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
                          <Play className="w-10 h-10 text-gray-400 mx-auto mb-2" />
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
                  </div>
                )}
              </Tabs.Content>

              <Tabs.Content value="styling" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {textColorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, textColor: color.value }))}
                          className={`p-2 rounded-lg border transition ${formData.textColor === color.value
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <div className={`w-full h-6 rounded ${color.bgHint} flex items-center justify-center`}>
                            <span className={`text-xs font-medium ${color.value}`}>Aa</span>
                          </div>
                          <p className="text-xs text-center mt-1">{color.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Highlight Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {highlightColorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, highlightColor: color.value }))}
                          className={`p-2 rounded-lg border transition ${formData.highlightColor === color.value
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <div className={`w-full h-6 rounded bg-gray-800 flex items-center justify-center`}>
                            <span className={`text-xs font-bold ${color.value}`}>★</span>
                          </div>
                          <p className="text-xs text-center mt-1">{color.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gradient Overlay
                    </label>
                    <select
                      name="gradient"
                      value={formData.gradient}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {gradientOptions.map((gradient) => (
                        <option key={gradient.value} value={gradient.value}>
                          {gradient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </h3>
                  <div className="relative rounded-lg overflow-hidden h-64 bg-gradient-to-r from-gray-800 to-gray-900">
                    {bgImagePreview && (
                      <img
                        src={bgImagePreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-r ${formData.gradient}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-6 max-w-lg">
                        <p className={`text-sm font-semibold mb-2 ${formData.highlightColor}`}>
                          {formData.subtitle || (language === 'bn' ? "উপশিরোনাম" : "Subtitle")}
                        </p>
                        <h2 className={`text-3xl font-bold mb-4 ${formData.textColor}`}>
                          {formData.title || (language === 'bn' ? "শিরোনাম" : "Title")}
                        </h2>
                        <button className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition">
                          {formData.buttonText || "Button"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="schedule" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.startDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {new Date(formData.startDate).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      End Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.endDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {new Date(formData.endDate).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date Validation */}
                {formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      End date must be after start date!
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Set start and end dates to automatically activate/deactivate this slider at specific times.</span>
                  </p>
                </div>
              </Tabs.Content>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  {language === 'bn' ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {slider
                    ? (language === 'bn' ? "আপডেট করুন" : "Update Slider")
                    : (language === 'bn' ? "তৈরি করুন" : "Create Slider")}
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Helper function for video selection (to be added)
function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>, setBgVideo: any, setBgVideoPreview: any) {
  const file = e.target.files?.[0];
  if (file) {
    if (!file.type.startsWith("video/")) {
      toast.error("Only video files are supported");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video size must be less than 50MB");
      return;
    }
    setBgVideo(file);
    const previewUrl = URL.createObjectURL(file);
    setBgVideoPreview(previewUrl);
  }
}