// components/admin/settings/SettingsTabs.tsx
"use client";

import React from "react";
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Upload, Share2, Phone, Code, Palette } from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  const { language } = useLanguage();

  const tabs = [
    { id: "general", name: language === 'bn' ? "সাধারণ" : "General", icon: Globe },
    { id: "images", name: language === 'bn' ? "ছবি" : "Images", icon: Upload },
    { id: "social", name: language === 'bn' ? "সোশ্যাল" : "Social", icon: Share2 },
    { id: "contact", name: language === 'bn' ? "যোগাযোগ" : "Contact", icon: Phone },
    { id: "seo", name: "SEO", icon: Code },
    { id: "theme", name: language === 'bn' ? "থিম" : "Theme", icon: Palette },
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
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
  );
};