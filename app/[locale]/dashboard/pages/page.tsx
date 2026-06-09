// app/admin/pages/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import {
  Save,
  Upload,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Target,
  Eye,
  EyeOff,
  Code,
  HelpCircle,
  FileText,
  ShoppingBag,
  Search,
  Grid,
  Tag,
  Layers,
  Newspaper,
  BookOpen,
  ShoppingCart,
  CreditCard,
  Sparkles,
  Gift,
  CheckCircle,
  Truck,
  Globe,
} from "lucide-react";
import SeoForm from "../components/SeoForm";
import TipTapEditor from "@/components/TipTapEditor";

interface PageContentType {
  _id?: string;
  pageType: string;
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  metaTitle: string;
  metaTitleBn: string;
  metaDescription: string;
  metaDescriptionBn: string;
  metaKeywords: string;
  metaKeywordsBn: string;
  email?: string;
  phone?: string;
  address?: string;
  addressBn?: string;
  googleMapUrl?: string;
  workingHours?: string;
  workingHoursBn?: string;
  mission?: string;
  missionBn?: string;
  vision?: string;
  visionBn?: string;
  history?: string;
  historyBn?: string;
  bannerImage?: string;
  aboutImage?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  schemaMarkup?: string;
  canonicalUrl?: string;
}

export default function AdminPages() {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const [activePage, setActivePage] = useState("about");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSeoForm, setShowSeoForm] = useState(false);
  const [existingSeo, setExistingSeo] = useState<any>(null);
  const [seoLoading, setSeoLoading] = useState(false);
  const [formData, setFormData] = useState<PageContentType>({
    pageType: "about",
    title: "",
    titleBn: "",
    content: "",
    contentBn: "",
    metaTitle: "",
    metaTitleBn: "",
    metaDescription: "",
    metaDescriptionBn: "",
    metaKeywords: "",
    metaKeywordsBn: "",
  });

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState("");
  const [aboutImage, setAboutImage] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState("");

  const bannerImageRef = useRef<HTMLInputElement>(null);
  const aboutImageRef = useRef<HTMLInputElement>(null);

  // All pages list with icons
  const pages = [
    { id: "about", name: language === 'bn' ? "আমাদের সম্পর্কে" : "About Us", icon: Globe, hasContent: true },
    { id: "contact", name: language === 'bn' ? "যোগাযোগ" : "Contact Us", icon: Phone, hasContent: true },
    { id: "privacy", name: language === 'bn' ? "গোপনীয়তা নীতি" : "Privacy Policy", icon: Eye, hasContent: true },
    { id: "terms", name: language === 'bn' ? "শর্তাবলী" : "Terms & Conditions", icon: FileText, hasContent: true },
    { id: "return", name: language === 'bn' ? "রিটার্ন পলিসি" : "Return Policy", icon: RefreshCw, hasContent: true },
    { id: "faq", name: "FAQ", icon: HelpCircle, hasContent: true },
    { id: "shop", name: language === 'bn' ? "শপ" : "Shop", icon: ShoppingBag, hasContent: false },
    { id: "product-search", name: language === 'bn' ? "পণ্য অনুসন্ধান" : "Product Search", icon: Search, hasContent: false },
    { id: "products", name: language === 'bn' ? "সকল পণ্য" : "All Products", icon: Grid, hasContent: false },
    { id: "product-category", name: language === 'bn' ? "পণ্যের ক্যাটাগরি" : "Product Category", icon: Tag, hasContent: false },
    { id: "category-products", name: language === 'bn' ? "ক্যাটাগরি ভিত্তিক পণ্য" : "Category Wise Products", icon: Layers, hasContent: false },
    { id: "blogs", name: language === 'bn' ? "ব্লগ" : "Blogs", icon: Newspaper, hasContent: false },
    { id: "category-blogs", name: language === 'bn' ? "ক্যাটাগরি ভিত্তিক ব্লগ" : "Category Wise Blogs", icon: BookOpen, hasContent: false },
    { id: "cart", name: language === 'bn' ? "কার্ট" : "Cart", icon: ShoppingCart, hasContent: false },
    { id: "checkout", name: language === 'bn' ? "চেকআউট" : "Checkout", icon: CreditCard, hasContent: false },
    { id: "new-arrival", name: language === 'bn' ? "নতুন আগমন" : "New Arrival", icon: Sparkles, hasContent: false },
    { id: "offers", name: language === 'bn' ? "অফার" : "Offers", icon: Gift, hasContent: false },
    { id: "order-success", name: language === 'bn' ? "অর্ডার সফল" : "Order Success", icon: CheckCircle, hasContent: false },
    { id: "order-tracking", name: language === 'bn' ? "অর্ডার ট্র্যাকিং" : "Order Tracking", icon: Truck, hasContent: false },
  ];

  // Load data when page changes
  useEffect(() => {
    fetchPageContent();
    fetchSeoData();
    // Reset SEO form visibility when page changes
    setShowSeoForm(false);
  }, [activePage]);

  const fetchPageContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/page-content?pageType=${activePage}`);
      const data = await res.json();
      if (data.success && data.data) {
        setFormData(data.data);
        setBannerImagePreview(data.data.bannerImage || "");
        setAboutImagePreview(data.data.aboutImage || "");
      } else {
        // Reset form for new page
        setFormData({
          pageType: activePage,
          title: "",
          titleBn: "",
          content: "",
          contentBn: "",
          metaTitle: "",
          metaTitleBn: "",
          metaDescription: "",
          metaDescriptionBn: "",
          metaKeywords: "",
          metaKeywordsBn: "",
          email: "",
          phone: "",
          address: "",
          addressBn: "",
          googleMapUrl: "",
          workingHours: "",
          workingHoursBn: "",
          mission: "",
          missionBn: "",
          vision: "",
          visionBn: "",
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          youtube: "",
        });
        setBannerImagePreview("");
        setAboutImagePreview("");
      }
    } catch (error) {
      console.error("Error fetching page content:", error);
      toast.error(language === 'bn' ? "পৃষ্ঠার কন্টেন্ট লোড করতে ব্যর্থ" : "Failed to load page content");
    } finally {
      setLoading(false);
    }
  };

  const fetchSeoData = async () => {
    setSeoLoading(true);
    try {
      // Create a proper pageId for SEO
      const seoPageId = `page_${activePage}`;
      const res = await fetch(`/api/seo?pageId=${seoPageId}&pageType=page`);
      const data = await res.json();

      console.log("SEO Data fetched for", activePage, data);

      if (data.success && data.data) {
        setExistingSeo(data.data);
      } else {
        setExistingSeo(null);
      }
    } catch (error) {
      console.error("Error fetching SEO data:", error);
      setExistingSeo(null);
    } finally {
      setSeoLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
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
      setFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const submitData = new FormData();
    submitData.append("pageType", activePage);

    // Append all form data
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof PageContentType];
      if (value && typeof value === 'string') {
        submitData.append(key, value);
      }
    });

    if (bannerImage) {
      submitData.append("bannerImage", bannerImage);
    }
    if (aboutImage) {
      submitData.append("aboutImage", aboutImage);
    }

    try {
      const res = await fetch("/api/page-content", {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(language === 'bn' ? "পৃষ্ঠার কন্টেন্ট সেভ হয়েছে!" : "Page content saved successfully!");
        fetchPageContent();
      } else {
        toast.error(data.error || (language === 'bn' ? "কন্টেন্ট সেভ করতে ব্যর্থ" : "Failed to save content"));
      }
    } catch (error) {
      console.error("Error saving page content:", error);
      toast.error(language === 'bn' ? "কন্টেন্ট সেভ করতে ব্যর্থ" : "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleSeoSuccess = () => {
    fetchSeoData();
    setShowSeoForm(false);
    // toast.success(language === 'bn' ? "SEO ডাটা সফলভাবে সেভ হয়েছে" : "SEO data saved successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get current page info
  const currentPage = pages.find(p => p.id === activePage);
  const hasContent = currentPage?.hasContent || false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'bn' ? "পৃষ্ঠার কন্টেন্ট ম্যানেজমেন্ট" : "Page Content Management"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {language === 'bn' ? "সকল পৃষ্ঠার কন্টেন্ট ও SEO ম্যানেজ করুন" : "Manage all page content and SEO"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {language === 'bn' ? "মেনু" : "Menu"}
                </h3>
              </div>
              <div className="p-2">
                {pages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.id}
                      onClick={() => {
                        setActivePage(page.id);
                        // Reset image states
                        setBannerImage(null);
                        setAboutImage(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${activePage === page.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{page.name}</span>
                      {!page.hasContent && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          SEO Only
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* SEO Toggle Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowSeoForm(!showSeoForm)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${showSeoForm
                    ? "bg-gray-200 text-gray-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {showSeoForm ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    {language === 'bn' ? "কন্টেন্ট ফর্ম দেখান" : "Show Content Form"}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    {language === 'bn' ? "SEO ফর্ম দেখান" : "Show SEO Form"}
                  </>
                )}
              </button>
            </div>

            {/* Loading indicator for SEO */}
            {showSeoForm && seoLoading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading SEO data...</p>
              </div>
            )}

            {/* Content Form */}
            {!showSeoForm && hasContent && (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {/* Page Title Display */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <h2 className="text-lg font-semibold text-blue-800">
                    {currentPage?.name} - {language === 'bn' ? "কন্টেন্ট এডিটর" : "Content Editor"}
                  </h2>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="শিরোনাম লিখুন"
                    />
                  </div>
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image
                  </label>
                  <div
                    onClick={() => bannerImageRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition"
                  >
                    {bannerImagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={bannerImagePreview}
                          alt="Banner preview"
                          className="max-h-48 rounded object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBannerImagePreview("");
                            setBannerImage(null);
                            // Also clear the existing banner image URL from formData
                            setFormData(prev => ({ ...prev, bannerImage: "" }));
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to upload banner image</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={bannerImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, setBannerImagePreview, setBannerImage)}
                    className="hidden"
                  />
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (English) *
                    </label>
                    {/* <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={10}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter content..."
                    /> */}
                    <TipTapEditor
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Enter content..."
                      minHeight="100px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (বাংলা) *
                    </label>
                    {/* <textarea
                      name="contentBn"
                      value={formData.contentBn}
                      onChange={handleInputChange}
                      rows={10}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="কন্টেন্ট লিখুন..."
                    /> */}
                    <TipTapEditor
                      name="contentBn"
                      value={formData.contentBn}
                      onChange={handleInputChange}
                      placeholder="কন্টেন্ট লিখুন..."
                      minHeight="100px"
                    />
                  </div>
                </div>

                {/* About Page Specific Fields */}
                {activePage === "about" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Target className="w-4 h-4" />
                          Mission (English)
                        </label>
                        {/* <textarea
                          name="mission"
                          value={formData.mission || ""}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Our mission..."
                        /> */}
                        <TipTapEditor
                          name="mission"
                          value={formData.mission}
                          onChange={handleInputChange}
                          placeholder="Our mission..."
                          minHeight="100px"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Target className="w-4 h-4" />
                          Mission (বাংলা)
                        </label>
                        {/* <textarea
                          name="missionBn"
                          value={formData.missionBn || ""}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="আমাদের মিশন..."
                        /> */}
                        <TipTapEditor
                          name="missionBn"
                          value={formData.missionBn}
                          onChange={handleInputChange}
                          placeholder="আমাদের মিশন..."
                          minHeight="100px"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Eye className="w-4 h-4" />
                          Vision (English)
                        </label>
                        {/* <textarea
                          name="vision"
                          value={formData.vision || ""}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Our vision..."
                        /> */}
                        <TipTapEditor
                          name="vision"
                          value={formData.vision}
                          onChange={handleInputChange}
                          placeholder="Our vision..."
                          minHeight="100px"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Eye className="w-4 h-4" />
                          Vision (বাংলা)
                        </label>
                        {/* <textarea
                          name="visionBn"
                          value={formData.visionBn || ""}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="আমাদের ভিশন..."
                        /> */}
                        <TipTapEditor
                          name="visionBn"
                          value={formData.visionBn}
                          onChange={handleInputChange}
                          placeholder="আমাদের ভিশন..."
                          minHeight="100px"
                        />
                      </div>
                    </div>

                    {/* About Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        About Section Image
                      </label>
                      <div
                        onClick={() => aboutImageRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition"
                      >
                        {aboutImagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={aboutImagePreview}
                              alt="About preview"
                              className="max-h-48 rounded object-contain"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAboutImagePreview("");
                                setAboutImage(null);
                                setFormData(prev => ({ ...prev, aboutImage: "" }));
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload about image</p>
                          </>
                        )}
                      </div>
                      <input
                        ref={aboutImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, setAboutImagePreview, setAboutImage)}
                        className="hidden"
                      />
                    </div>
                  </>
                )}

                {/* Contact Page Specific Fields */}
                {activePage === "contact" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="info@example.com"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Phone className="w-4 h-4" />
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="+8801XXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <MapPin className="w-4 h-4" />
                          Address (English)
                        </label>
                        <textarea
                          name="address"
                          value={formData.address || ""}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Your address..."
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <MapPin className="w-4 h-4" />
                          Address (বাংলা)
                        </label>
                        <textarea
                          name="addressBn"
                          value={formData.addressBn || ""}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="আপনার ঠিকানা..."
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Clock className="w-4 h-4" />
                          Working Hours (English)
                        </label>
                        <input
                          type="text"
                          name="workingHours"
                          value={formData.workingHours || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Sat-Thu: 10AM - 8PM"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Clock className="w-4 h-4" />
                          Working Hours (বাংলা)
                        </label>
                        <input
                          type="text"
                          name="workingHoursBn"
                          value={formData.workingHoursBn || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="শনি-বৃহস্পতি: সকাল ১০টা - রাত ৮টা"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        Google Map URL
                      </label>
                      <input
                        type="text"
                        name="googleMapUrl"
                        value={formData.googleMapUrl || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </>
                )}

                {/* Social Links */}
                {/* <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'bn' ? "সোশ্যাল মিডিয়া লিংক" : "Social Media Links"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <input
                        type="url"
                        name="facebook"
                        value={formData.facebook || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        Twitter
                      </label>
                      <input
                        type="url"
                        name="twitter"
                        value={formData.twitter || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="https://twitter.com/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <input
                        type="url"
                        name="instagram"
                        value={formData.instagram || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        YouTube
                      </label>
                      <input
                        type="url"
                        name="youtube"
                        value={formData.youtube || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="https://youtube.com/c/yourchannel"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    <Save className="w-4 h-4" />
                    {language === 'bn' ? "সেভ করুন" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Content form for pages without content (SEO only) */}
            {!showSeoForm && !hasContent && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'bn' ? "এই পৃষ্ঠায় কোনো কন্টেন্ট নেই" : "No Content for this Page"}
                </h3>
                <p className="text-gray-500">
                  {language === 'bn'
                    ? "এই পৃষ্ঠাটি শুধুমাত্র SEO অপটিমাইজেশনের জন্য। উপরের SEO ফর্ম বাটনে ক্লিক করে SEO মেটাডাটা যোগ করুন।"
                    : "This page is for SEO optimization only. Click the SEO Form button above to add SEO metadata."}
                </p>
              </div>
            )}

            {/* SEO Form */}
            {showSeoForm && !seoLoading && (
              <SeoForm
                key={activePage} // Force re-render when page changes
                pageId={`page_${activePage}`}
                pageName={currentPage?.name || activePage}
                productName={formData.title}
                productNameBn={formData.titleBn}
                pageType="page"
                existingSeo={existingSeo}
                isEdit={!!existingSeo}
                onSuccess={handleSeoSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon components
function RefreshCw(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
}