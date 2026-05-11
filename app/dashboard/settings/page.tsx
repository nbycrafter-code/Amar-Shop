// app/admin/settings/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import { 
  Save, 
  Upload, 
  X, 
  Globe, 
//   FacebookIcon, 
//   TwitterIcon, 
//   InstagramIcon, 
//   LinkedinIcon, 
//   YoutubeIcon, 
  Phone, 
  Mail, 
  MapPin,
  Palette,
  Code,
  Eye,
  EyeOff,
  Share2
} from "lucide-react";
import Image from "next/image";

interface SettingsData {
  // Basic Info
  siteName: string;
  siteNameBn: string;
  siteTitle: string;
  siteTitleBn: string;
  siteDescription: string;
  siteDescriptionBn: string;
  
  // Images
  favicon: string;
  logo: string;
  footerLogo: string;
  
  // Footer
  footerText: string;
  footerTextBn: string;
  copyright: string;
  copyrightBn: string;
  
  // Social Links
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
  
  // Contact Info
  email: string;
  phone: string;
  address: string;
  addressBn: string;
  
  // SEO
  metaKeywords: string;
  metaKeywordsBn: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  
  // Theme
  primaryColor: string;
  secondaryColor: string;
}

export default function SettingsPage() {
  const { isBn } = useApp();
  const [settings, setSettings] = useState<SettingsData>({
    siteName: "", siteNameBn: "", siteTitle: "", siteTitleBn: "",
    siteDescription: "", siteDescriptionBn: "", footerText: "", footerTextBn: "",
    copyright: "", copyrightBn: "", favicon: "", logo: "", footerLogo: "",
    facebook: "", twitter: "", instagram: "", linkedin: "", tiktok: "", youtube: "", whatsapp: "",
    email: "", phone: "", address: "", addressBn: "", metaKeywords: "", metaKeywordsBn: "",
    googleAnalyticsId: "", facebookPixelId: "", primaryColor: "#3B82F6", secondaryColor: "#10B981"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // File input refs
  const faviconRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const footerLogoRef = useRef<HTMLInputElement>(null);
  
  // Preview states
  const [faviconPreview, setFaviconPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [footerLogoPreview, setFooterLogoPreview] = useState("");
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        setFaviconPreview(data.data.favicon);
        setLogoPreview(data.data.logo);
        setFooterLogoPreview(data.data.footerLogo);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };
  
  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string>>,
    field: keyof SettingsData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are supported");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Update settings with file (will be sent via FormData)
      setSettings(prev => ({ ...prev, [field]: file as any }));
    }
  };
  
  const removeImage = (
    setPreview: React.Dispatch<React.SetStateAction<string>>,
    field: keyof SettingsData
  ) => {
    setPreview("");
    setSettings(prev => ({ ...prev, [field]: "" }));
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData();
    
    // Append all text fields
    Object.keys(settings).forEach(key => {
      const value = settings[key as keyof SettingsData];
      if (value && typeof value === "string") {
        formData.append(key, value);
      } else if (value instanceof File) {
        formData.append(key, value);
      }
    });
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Settings saved successfully!");
        fetchSettings();
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const tabs = [
    { id: "general", name: isBn ? "সাধারণ" : "General", icon: Globe },
    { id: "images", name: isBn ? "ছবি" : "Images", icon: Upload },
    { id: "social", name: isBn ? "সোশ্যাল" : "Social", icon: Share2 },
    { id: "contact", name: isBn ? "যোগাযোগ" : "Contact", icon: Phone },
    { id: "seo", name: "SEO", icon: Code },
    { id: "theme", name: isBn ? "থিম" : "Theme", icon: Palette },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isBn ? "সাইট সেটিংস" : "Site Settings"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isBn ? "আপনার সাইটের সকল সেটিংস এখানে পরিচালনা করুন" : "Manage all your site settings here"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isBn ? "সাধারণ সেটিংস" : "General Settings"}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Name (English)
                        </label>
                        <input
                          type="text"
                          name="siteName"
                          value={settings.siteName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="My Store"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Name (বাংলা)
                        </label>
                        <input
                          type="text"
                          name="siteNameBn"
                          value={settings.siteNameBn}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="মাই স্টোর"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Title (English)
                        </label>
                        <input
                          type="text"
                          name="siteTitle"
                          value={settings.siteTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="My Store - Best Online Shop"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site Title (বাংলা)
                        </label>
                        <input
                          type="text"
                          name="siteTitleBn"
                          value={settings.siteTitleBn}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="মাই স্টোর - সেরা অনলাইন শপ"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Description (English)
                      </label>
                      <textarea
                        name="siteDescription"
                        value={settings.siteDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your site..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Description (বাংলা)
                      </label>
                      <textarea
                        name="siteDescriptionBn"
                        value={settings.siteDescriptionBn}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="আপনার সাইটের বিবরণ..."
                      />
                    </div>
                  </div>
                )}
                
                {/* Images Settings */}
                {activeTab === "images" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isBn ? "ছবি সেটিংস" : "Image Settings"}
                    </h2>
                    
                    {/* Favicon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon
                      </label>
                      <div className="flex items-center gap-4">
                        {faviconPreview && (
                          <div className="relative">
                            <img
                              src={faviconPreview}
                              alt="Favicon"
                              className="w-12 h-12 object-contain border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(setFaviconPreview, "favicon")}
                              className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => faviconRef.current?.click()}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Upload Favicon
                        </button>
                        <input
                          ref={faviconRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e, setFaviconPreview, "favicon")}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 32x32px or 64x64px
                      </p>
                    </div>
                    
                    {/* Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo
                      </label>
                      <div className="flex items-center gap-4">
                        {logoPreview && (
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className="w-32 h-16 object-contain border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(setLogoPreview, "logo")}
                              className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => logoRef.current?.click()}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Upload Logo
                        </button>
                        <input
                          ref={logoRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e, setLogoPreview, "logo")}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 200x60px
                      </p>
                    </div>
                    
                    {/* Footer Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Footer Logo
                      </label>
                      <div className="flex items-center gap-4">
                        {footerLogoPreview && (
                          <div className="relative">
                            <img
                              src={footerLogoPreview}
                              alt="Footer Logo"
                              className="w-32 h-16 object-contain border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(setFooterLogoPreview, "footerLogo")}
                              className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => footerLogoRef.current?.click()}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Upload Footer Logo
                        </button>
                        <input
                          ref={footerLogoRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e, setFooterLogoPreview, "footerLogo")}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Social Settings */}
                {activeTab === "social" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isBn ? "সোশ্যাল মিডিয়া লিংক" : "Social Media Links"}
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          {/* <FacebookIcon className="w-4 h-4 text-blue-600" /> */}
                          FacebookIcon
                        </label>
                        <input
                          type="url"
                          name="facebook"
                          value={settings.facebook}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://facebook.com/yourpage"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          {/* <TwitterIcon className="w-4 h-4 text-blue-400" /> */}
                          TwitterIcon
                        </label>
                        <input
                          type="url"
                          name="twitter"
                          value={settings.twitter}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://twitter.com/yourprofile"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          {/* <InstagramIcon className="w-4 h-4 text-pink-600" /> */}
                          InstagramIcon
                        </label>
                        <input
                          type="url"
                          name="instagram"
                          value={settings.instagram}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://instagram.com/yourprofile"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          {/* <LinkedinIcon className="w-4 h-4 text-blue-700" /> */}
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={settings.linkedin}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://linkedin.com/company/yourcompany"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          {/* <TikTokIcon className="w-4 h-4 text-red-600" /> */}
                          TikTok
                        </label>
                        <input
                          type="url"
                          name="tiktok"
                          value={settings.tiktok}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://tiktok.com/@yourprofile"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          {/* <YoutubeIcon className="w-4 h-4 text-red-600" /> */}
                          YouTube
                        </label>
                        <input
                          type="url"
                          name="youtube"
                          value={settings.youtube}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://youtube.com/c/yourchannel"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          WhatsApp
                        </label>
                        <input
                          type="text"
                          name="whatsapp"
                          value={settings.whatsapp}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="+8801XXXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Contact Settings */}
                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isBn ? "যোগাযোগের তথ্য" : "Contact Information"}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={settings.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="info@yourstore.com"
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
                          value={settings.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="+8801XXXXXXXXX"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="w-4 h-4" />
                        Address (English)
                      </label>
                      <textarea
                        name="address"
                        value={settings.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Your address here..."
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="w-4 h-4" />
                        Address (বাংলা)
                      </label>
                      <textarea
                        name="addressBn"
                        value={settings.addressBn}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="আপনার ঠিকানা..."
                      />
                    </div>
                    
                    {/* Footer Settings */}
                    <div className="pt-4 border-t">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">
                        {isBn ? "ফুটার সেটিংস" : "Footer Settings"}
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Footer Text (English)
                        </label>
                        <textarea
                          name="footerText"
                          value={settings.footerText}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Footer text..."
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Footer Text (বাংলা)
                        </label>
                        <textarea
                          name="footerTextBn"
                          value={settings.footerTextBn}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="ফুটার টেক্সট..."
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Copyright (English)
                          </label>
                          <input
                            type="text"
                            name="copyright"
                            value={settings.copyright}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="© 2024 All rights reserved"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Copyright (বাংলা)
                          </label>
                          <input
                            type="text"
                            name="copyrightBn"
                            value={settings.copyrightBn}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="© ২০২৪ সর্বস্বত্ব সংরক্ষিত"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* SEO Settings */}
                {activeTab === "seo" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      SEO Settings
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Keywords (English)
                      </label>
                      <textarea
                        name="metaKeywords"
                        value={settings.metaKeywords}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate keywords with commas
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Keywords (বাংলা)
                      </label>
                      <textarea
                        name="metaKeywordsBn"
                        value={settings.metaKeywordsBn}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="কিওয়ার্ড১, কীওয়ার্ড২, কীওয়ার্ড৩"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        name="googleAnalyticsId"
                        value={settings.googleAnalyticsId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        FacebookIcon Pixel ID
                      </label>
                      <input
                        type="text"
                        name="facebookPixelId"
                        value={settings.facebookPixelId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="123456789012345"
                      />
                    </div>
                  </div>
                )}
                
                {/* Theme Settings */}
                {activeTab === "theme" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isBn ? "থিম সেটিংস" : "Theme Settings"}
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="#10B981"
                        />
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                      <div className="space-y-2">
                        <button
                          className="px-4 py-2 rounded-lg text-white"
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                          Primary Button
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg text-white ml-2"
                          style={{ backgroundColor: settings.secondaryColor }}
                        >
                          Secondary Button
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="fixed bottom-8 right-8">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-lg transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isBn ? "সেভ করুন" : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}