// components/admin/settings/GeneralSettings.tsx
"use client";

import React from "react";
import { useLanguage } from '@/context/LanguageContext';
import { SettingsData } from "../page";

interface GeneralSettingsProps {
  settings: SettingsData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onInputChange }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {language === 'bn' ? "সাধারণ সেটিংস" : "General Settings"}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="আপনার সাইটের বিবরণ..."
        />
      </div>
    </div>
  );
};