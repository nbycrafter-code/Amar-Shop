// components/admin/settings/ImageSettings.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { SettingsData } from "../page";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ImageSettingsProps {
  settings: SettingsData;
  setSettings: React.Dispatch<React.SetStateAction<SettingsData>>;
}

export const ImageSettings: React.FC<ImageSettingsProps> = ({ settings, setSettings }) => {
  const { language } = useLanguage();
  const faviconRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const footerLogoRef = useRef<HTMLInputElement>(null);

  const [faviconPreview, setFaviconPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [footerLogoPreview, setFooterLogoPreview] = useState("");

  useEffect(() => {
    setFaviconPreview(settings.favicon);
    setLogoPreview(settings.logo);
    setFooterLogoPreview(settings.footerLogo);
  }, [settings.favicon, settings.logo, settings.footerLogo]);

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

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {language === 'bn' ? "ছবি সেটিংস" : "Image Settings"}
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
  );
};