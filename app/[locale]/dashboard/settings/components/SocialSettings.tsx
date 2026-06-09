// components/admin/settings/SocialSettings.tsx
"use client";

import React from "react";
import { useLanguage } from '@/context/LanguageContext';
import { SettingsData } from "../page";

interface SocialSettingsProps {
  settings: SettingsData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const SocialSettings: React.FC<SocialSettingsProps> = ({ settings, onInputChange }) => {
  const { language } = useLanguage();

  const socialLinks = [
    { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage", icon: "📘" },
    { name: "twitter", label: "Twitter", placeholder: "https://twitter.com/yourprofile", icon: "🐦" },
    { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourprofile", icon: "📸" },
    { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourcompany", icon: "🔗" },
    { name: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourprofile", icon: "🎵" },
    { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/c/yourchannel", icon: "📺" },
    { name: "whatsapp", label: "WhatsApp", placeholder: "+8801XXXXXXXXX", icon: "💬" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {language === 'bn' ? "সোশ্যাল মিডিয়া লিংক" : "Social Media Links"}
      </h2>

      <div className="space-y-4">
        {socialLinks.map((social) => (
          <div key={social.name}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <span>{social.icon}</span>
              {social.label}
            </label>
            <input
              type="url"
              name={social.name}
              value={settings[social.name as keyof SettingsData] as string}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={social.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};