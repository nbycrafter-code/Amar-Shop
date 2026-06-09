// components/admin/settings/SeoSettings.tsx
"use client";

import React from "react";
import { SettingsData } from "../page";

interface SeoSettingsProps {
  settings: SettingsData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const SeoSettings: React.FC<SeoSettingsProps> = ({ settings, onInputChange }) => {
  return (
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
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="G-XXXXXXXXXX"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Facebook Pixel ID
        </label>
        <input
          type="text"
          name="facebookPixelId"
          value={settings.facebookPixelId}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="123456789012345"
        />
      </div>
    </div>
  );
};