// components/admin/settings/ContactSettings.tsx
"use client";

import React from "react";
import { useLanguage } from '@/context/LanguageContext';
import { SettingsData } from "../page";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactSettingsProps {
  settings: SettingsData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ContactSettings: React.FC<ContactSettingsProps> = ({ settings, onInputChange }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {language === 'bn' ? "যোগাযোগের তথ্য" : "Contact Information"}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="আপনার ঠিকানা..."
        />
      </div>

      {/* Footer Settings */}
      <div className="pt-4 border-t">
        <h3 className="text-md font-semibold text-gray-900 mb-4">
          {language === 'bn' ? "ফুটার সেটিংস" : "Footer Settings"}
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Footer Text (English)
          </label>
          <textarea
            name="footerText"
            value={settings.footerText}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="© ২০২৪ সর্বস্বত্ব সংরক্ষিত"
            />
          </div>
        </div>
      </div>
    </div>
  );
};