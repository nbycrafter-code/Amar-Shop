// app/admin/pages/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import { 
  Save, 
  Upload, 
  X, 
  Globe, 
//   Facebook, 
//   Twitter, 
//   Instagram, 
//   Linkedin, 
//   Youtube, 
  Phone, 
  Mail, 
  MapPin,
  Image as ImageIcon,
  Clock,
  Target,
  Eye,
  EyeOff,
  Code
} from "lucide-react";

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
  const { isBn } = useApp();
  const [activePage, setActivePage] = useState("about");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const pages = [
    { id: "about", name: isBn ? "আমাদের সম্পর্কে" : "About Us", icon: Globe },
    { id: "contact", name: isBn ? "যোগাযোগ" : "Contact Us", icon: Phone },
    { id: "privacy", name: isBn ? "গোপনীয়তা নীতি" : "Privacy Policy", icon: Eye },
    { id: "terms", name: isBn ? "শর্তাবলী" : "Terms & Conditions", icon: FileText },
    { id: "faq", name: "FAQ", icon: HelpCircle },
  ];

  useEffect(() => {
    fetchPageContent();
  }, [activePage]);

  const fetchPageContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/page-content?pageType=${activePage}`);
      const data = await res.json();
      if (data.success) {
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
        });
      }
    } catch (error) {
      console.error("Error fetching page content:", error);
      toast.error("Failed to load page content");
    } finally {
      setLoading(false);
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
        toast.error(isBn ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(isBn ? "ইমেজ সাইজ 5MB এর কম হতে হবে" : "Image size must be less than 5MB");
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
      if (formData[key as keyof PageContentType] && typeof formData[key as keyof PageContentType] === 'string') {
        submitData.append(key, formData[key as keyof PageContentType] as string);
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
        toast.success(isBn ? "পৃষ্ঠার কন্টেন্ট সেভ হয়েছে!" : "Page content saved successfully!");
        fetchPageContent();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error saving page content:", error);
      toast.error(isBn ? "কন্টেন্ট সেভ করতে ব্যর্থ" : "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isBn ? "পৃষ্ঠার কন্টেন্ট ম্যানেজমেন্ট" : "Page Content Management"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isBn ? "About, Contact এবং অন্যান্য পৃষ্ঠার কন্টেন্ট এডিট করুন" : "Edit About, Contact and other page contents"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
              {pages.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                      activePage === page.id
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {page.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
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
                    <div className="relative">
                      <img
                        src={bannerImagePreview}
                        alt="Banner preview"
                        className="w-full h-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBannerImagePreview("");
                          setBannerImage(null);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
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
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (বাংলা) *
                  </label>
                  <textarea
                    name="contentBn"
                    value={formData.contentBn}
                    onChange={handleInputChange}
                    rows={10}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="কন্টেন্ট লিখুন..."
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
                      <textarea
                        name="mission"
                        value={formData.mission || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Our mission..."
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Target className="w-4 h-4" />
                        Mission (বাংলা)
                      </label>
                      <textarea
                        name="missionBn"
                        value={formData.missionBn || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="আমাদের মিশন..."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Eye className="w-4 h-4" />
                        Vision (English)
                      </label>
                      <textarea
                        name="vision"
                        value={formData.vision || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Our vision..."
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <Eye className="w-4 h-4" />
                        Vision (বাংলা)
                      </label>
                      <textarea
                        name="visionBn"
                        value={formData.visionBn || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="আমাদের ভিশন..."
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
                        <div className="relative">
                          <img
                            src={aboutImagePreview}
                            alt="About preview"
                            className="w-full h-48 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAboutImagePreview("");
                              setAboutImage(null);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
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

              {/* Social Links (for both pages) */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isBn ? "সোশ্যাল মিডিয়া লিংক" : "Social Media Links"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      {/* <Facebook className="w-4 h-4 text-blue-600" /> */}
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
                      {/* <Twitter className="w-4 h-4 text-blue-400" /> */}
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
                      {/* <Instagram className="w-4 h-4 text-pink-600" /> */}
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
                      {/* <Linkedin className="w-4 h-4 text-blue-700" /> */}
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
                      {/* <Youtube className="w-4 h-4 text-red-600" /> */}
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
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  SEO Settings
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title (English)
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title (বাংলা)
                    </label>
                    <input
                      type="text"
                      name="metaTitleBn"
                      value={formData.metaTitleBn || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description (English)
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription || ""}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description (বাংলা)
                    </label>
                    <textarea
                      name="metaDescriptionBn"
                      value={formData.metaDescriptionBn || ""}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Keywords (English)
                    </label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Keywords (বাংলা)
                    </label>
                    <input
                      type="text"
                      name="metaKeywordsBn"
                      value={formData.metaKeywordsBn || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="কিওয়ার্ড১, কীওয়ার্ড২, কীওয়ার্ড৩"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      name="canonicalUrl"
                      value={formData.canonicalUrl || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://example.com/about"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Code className="w-4 h-4" />
                      Schema Markup (JSON-LD)
                    </label>
                    <textarea
                      name="schemaMarkup"
                      value={formData.schemaMarkup || ""}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder='{"@context":"https://schema.org",...}'
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <Save className="w-4 h-4" />
                  {isBn ? "সেভ করুন" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing imports
function FileText(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}

function HelpCircle(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}