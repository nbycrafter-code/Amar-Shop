// app/admin/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { Save } from "lucide-react";
import { SettingsTabs } from './components/SettingsTabs';
import { GeneralSettings } from './components/GeneralSettings';
import { ImageSettings } from './components/ImageSettings';
import { SocialSettings } from './components/SocialSettings';
import { ContactSettings } from './components/ContactSettings';
import { SeoSettings } from './components/SeoSettings';
import { ThemeSettings } from './components/ThemeSettings';

export interface SettingsData {
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
  activeTheme?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  baseFontSize?: string;
  layoutStyle?: string;
  borderRadius?: string;
  buttonStyle?: string;
  cardStyle?: string;
  customCSS?: string;
  customJS?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: string;
  borderColor?: string;
  cardBackground?: string;
  headingColor?: string;
}

export default function SettingsPage() {
  const { language } = useLanguage();
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings settings={settings} onInputChange={handleInputChange} />;
      case "images":
        return <ImageSettings settings={settings} setSettings={setSettings} />;
      case "social":
        return <SocialSettings settings={settings} onInputChange={handleInputChange} />;
      case "contact":
        return <ContactSettings settings={settings} onInputChange={handleInputChange} />;
      case "seo":
        return <SeoSettings settings={settings} onInputChange={handleInputChange} />;
      case "theme":
        return <ThemeSettings settings={settings} setSettings={setSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'bn' ? "সাইট সেটিংস" : "Site Settings"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {language === 'bn' ? "আপনার সাইটের সকল সেটিংস এখানে পরিচালনা করুন" : "Manage all your site settings here"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6">
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {renderActiveTab()}
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
              {language === 'bn' ? "সেভ করুন" : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}