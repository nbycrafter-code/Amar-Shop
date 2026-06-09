// components/admin/settings/ThemeSettings.tsx
"use client";

import React, { useState } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { SettingsData } from "@/app/admin/settings/page";
import { Palette, Type, Layout, Grid, Code, Eye, Check, RefreshCw } from "lucide-react";
import { themePresets } from '@/lib/themePresets';
import { toast } from "sonner";
import Link from "next/link";

interface ThemeSettingsProps {
  settings: SettingsData;
  setSettings: React.Dispatch<React.SetStateAction<SettingsData>>;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ settings, setSettings }) => {
  const { language } = useLanguage();
  const [showPreview, setShowPreview] = useState(false);
  const [activeSubtab, setActiveSubtab] = useState('themes');

  const subtabs = [
    { id: 'themes', name: language === 'bn' ? 'থিম গ্যালারি' : 'Theme Gallery', icon: Palette },
    { id: 'colors', name: language === 'bn' ? 'রং' : 'Colors', icon: Palette },
    { id: 'typography', name: 'Typography', icon: Type },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'components', name: 'Components', icon: Grid },
    { id: 'custom', name: 'Custom CSS/JS', icon: Code },
  ];

  const applyThemePreset = (themeKey: string) => {
    const preset = themePresets[themeKey as keyof typeof themePresets];
    if (preset) {
      setSettings({
        ...settings,
        activeTheme: themeKey,
        ...preset.settings
      });
      toast.success(`${language === 'bn' ? preset.nameBn : preset.name} ${language === 'bn' ? 'থিম প্রয়োগ করা হয়েছে!' : 'theme applied!'}`);
    }
  };

  const resetToDefault = () => {
    const defaultColors = {
      primaryColor: '#f58f19',
      secondaryColor: '#c06e11',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      headingColor: '#111827',
      borderRadius: '0.5rem',
      cardStyle: 'elevated',
      buttonStyle: 'rounded',
      headerStyle: 'default',
      footerStyle: 'default',
      hoverEffect: 'scale',
      gradientStart: '#c06e11',
      gradientEnd: '#dba260',
      gradientDirection: 'to-r',
      buttonPrimary: '#f58f19',
      buttonPrimaryHover: '#c06e11',
      buttonSecondary: '#bdad95',
      buttonSecondaryHover: '#f79d49',
      linkColor: '#f58f19',
      linkHover: '#c06e11',
      successColor: '#10B981',
      errorColor: '#EF4444',
      warningColor: '#F59E0B',
      infoColor: '#70a3f7',
      headerBackground: '#FFFFFF',
      footerBackground: '#ffffff',
      cardBackground: '#FFFFFF',
      borderColor: '#E5E7EB',
      gray50: '#F9FAFB',
      gray100: '#F3F4F6',
      gray200: '#E5E7EB',
      gray300: '#D1D5DB',
      gray400: '#9CA3AF',
      gray500: '#6B7280',
      gray600: '#4B5563',
      gray700: '#374151',
      gray800: '#1F2937',
      gray900: '#111827',
    };
    setSettings({ ...settings, ...defaultColors });
    toast.success(language === 'bn' ? 'সব রং ডিফল্টে রিসেট করা হয়েছে' : 'All colors reset to default');
  };

  return (
    <div className="space-y-6">
      {/* Theme Preview Banner */}
      <div
        className="rounded-xl p-6 text-white"
        style={{
          background: `linear-gradient(${settings?.gradientDirection || 'to-r'}, ${settings?.gradientStart || '#3B82F6'}, ${settings?.gradientEnd || '#10B981'})`
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {language === 'bn' ? 'লাইভ থিম প্রিভিউ' : 'Live Theme Preview'}
            </h3>
            <p className="text-sm opacity-90 mt-1">
              {language === 'bn'
                ? 'আপনার নির্বাচিত থিম কিভাবে দেখাবে তা প্রিভিউ করুন'
                : 'Preview how your selected theme will look'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetToDefault}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          {language === 'bn' ? 'ডিফল্ট রং রিসেট করুন' : 'Reset to Default Colors'}
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {subtabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubtab(tab.id)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${activeSubtab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Render Sub-tab Content */}
      {activeSubtab === 'themes' && (
        <ThemeGallery settings={settings} applyThemePreset={applyThemePreset} language={language} />
      )}
      {activeSubtab === 'colors' && (
        <ColorSettings settings={settings} setSettings={setSettings} language={language} />
      )}
      {activeSubtab === 'typography' && (
        <TypographySettings settings={settings} setSettings={setSettings} language={language} />
      )}
      {activeSubtab === 'layout' && (
        <LayoutSettings settings={settings} setSettings={setSettings} language={language} />
      )}
      {activeSubtab === 'components' && (
        <ComponentSettings settings={settings} setSettings={setSettings} language={language} />
      )}
      {activeSubtab === 'custom' && (
        <CustomCodeSettings settings={settings} setSettings={setSettings} language={language} />
      )}

      {/* Live Preview Modal */}
      {showPreview && (
        <ThemePreviewModal settings={settings} onClose={() => setShowPreview(false)} language={language} />
      )}
    </div>
  );
};

// Theme Gallery Sub-component
const ThemeGallery: React.FC<{ settings: SettingsData; applyThemePreset: (key: string) => void; language: string }> =
  ({ settings, applyThemePreset, language }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(themePresets).map(([key, theme]) => (
        <div
          key={key}
          className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden ${
            settings?.activeTheme === key
              ? 'border-blue-500 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
          }`}
          onClick={() => applyThemePreset(key)}
          style={{
            backgroundImage: `url(${theme.themeImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                applyThemePreset(key);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'bn' ? 'এই থিম সিলেক্ট করুন' : 'Select This Theme'}
            </button>
            <p className="text-white/80 text-xs text-center px-4">
              {language === 'bn' 
                ? `${theme.nameBn} থিমটি সিলেক্ট করতে ক্লিক করুন`
                : `Click to select ${theme.name} theme`}
            </p>
          </div>

          {/* Content */}
          <div className="p-4 relative z-0 transition-all duration-300 group-hover:blur-sm group-hover:scale-95">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{theme.icon}</span>
              {settings?.activeTheme === key && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full shadow-md">
                  Active
                </span>
              )}
            </div>
            <h4 className="font-semibold text-gray-900">
              {language === 'bn' ? theme.nameBn : theme.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'bn' ? theme.descriptionBn : theme.description}
            </p>

            <div className="mt-4 h-20 rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(${theme.settings?.gradientDirection || 'to-r'}, ${theme.settings?.gradientStart || '#3B82F6'}, ${theme.settings?.gradientEnd || '#10B981'})`
              }}
            >
              <div className="p-2">
                <div className="w-8 h-2 bg-white/50 rounded"></div>
                <div className="flex gap-1 mt-2">
                  <div className="w-4 h-4 bg-white/50 rounded"></div>
                  <div className="w-4 h-4 bg-white/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Badge Icon */}
          {settings?.activeTheme === key && (
            <div className="absolute top-2 right-2 z-20">
              <Check className="w-5 h-5 text-blue-500 bg-white rounded-full shadow-md" />
            </div>
          )}

          {/* Hover Border Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );

// Complete Color Settings Sub-component
const ColorSettings: React.FC<{ settings: SettingsData; setSettings: React.Dispatch<React.SetStateAction<SettingsData>>; language: string }> =
  ({ settings, setSettings, language }) => {
    const colorGroups = [
      {
        title: language === 'bn' ? 'প্রাথমিক রং' : 'Primary Colors',
        colors: [
          { key: 'primaryColor', label: 'Primary Color', labelBn: 'প্রাথমিক রং', default: '#3B82F6' },
          { key: 'secondaryColor', label: 'Secondary Color', labelBn: 'সেকেন্ডারি রং', default: '#10B981' },
        ]
      },
      {
        title: language === 'bn' ? 'ব্যাকগ্রাউন্ড রং' : 'Background Colors',
        colors: [
          { key: 'backgroundColor', label: 'Background Color', labelBn: 'ব্যাকগ্রাউন্ড রং', default: '#FFFFFF' },
          { key: 'cardBackground', label: 'Card Background', labelBn: 'কার্ড ব্যাকগ্রাউন্ড', default: '#FFFFFF' },
          { key: 'headerBackground', label: 'Header Background', labelBn: 'হেডার ব্যাকগ্রাউন্ড', default: '#FFFFFF' },
          { key: 'footerBackground', label: 'Footer Background', labelBn: 'ফুটার ব্যাকগ্রাউন্ড', default: '#1F2937' },
        ]
      },
      {
        title: language === 'bn' ? 'টেক্সট রং' : 'Text Colors',
        colors: [
          { key: 'textColor', label: 'Primary Text', labelBn: 'প্রাথমিক টেক্সট', default: '#1F2937' },
          { key: 'headingColor', label: 'Heading Text', labelBn: 'হেডিং টেক্সট', default: '#111827' },
          { key: 'textSecondary', label: 'Secondary Text', labelBn: 'সেকেন্ডারি টেক্সট', default: '#6B7280' },
          { key: 'textMuted', label: 'Muted Text', labelBn: 'মিউটেড টেক্সট', default: '#9CA3AF' },
        ]
      },
      {
        title: language === 'bn' ? 'বর্ডার ও ডিভাইডার রং' : 'Border & Divider Colors',
        colors: [
          { key: 'borderColor', label: 'Border Color', labelBn: 'বর্ডার রং', default: '#E5E7EB' },
          { key: 'borderHover', label: 'Border Hover', labelBn: 'হোভার বর্ডার', default: '#D1D5DB' },
          { key: 'dividerColor', label: 'Divider Color', labelBn: 'ডিভাইডার রং', default: '#F3F4F6' },
        ]
      },
      {
        title: language === 'bn' ? 'গ্রেডিয়েন্ট রং' : 'Gradient Colors',
        colors: [
          { key: 'gradientStart', label: 'Gradient Start', labelBn: 'গ্রেডিয়েন্ট শুরু', default: '#3B82F6' },
          { key: 'gradientEnd', label: 'Gradient End', labelBn: 'গ্রেডিয়েন্ট শেষ', default: '#10B981' },
        ]
      },
      {
        title: language === 'bn' ? 'বাটন রং' : 'Button Colors',
        colors: [
          { key: 'buttonPrimary', label: 'Primary Button', labelBn: 'প্রাথমিক বাটন', default: '#3B82F6' },
          { key: 'buttonPrimaryHover', label: 'Primary Button Hover', labelBn: 'প্রাথমিক বাটন হোভার', default: '#2563EB' },
          { key: 'buttonSecondary', label: 'Secondary Button', labelBn: 'সেকেন্ডারি বাটন', default: '#10B981' },
          { key: 'buttonSecondaryHover', label: 'Secondary Button Hover', labelBn: 'সেকেন্ডারি বাটন হোভার', default: '#059669' },
          { key: 'buttonDanger', label: 'Danger Button', labelBn: 'ডেঞ্জার বাটন', default: '#EF4444' },
          { key: 'buttonWarning', label: 'Warning Button', labelBn: 'ওয়ার্নিং বাটন', default: '#F59E0B' },
          { key: 'buttonSuccess', label: 'Success Button', labelBn: 'সাকসেস বাটন', default: '#10B981' },
        ]
      },
      {
        title: language === 'bn' ? 'লিংক ও হোভার রং' : 'Link & Hover Colors',
        colors: [
          { key: 'linkColor', label: 'Link Color', labelBn: 'লিংক রং', default: '#3B82F6' },
          { key: 'linkHover', label: 'Link Hover', labelBn: 'লিংক হোভার', default: '#2563EB' },
          { key: 'hoverBackground', label: 'Hover Background', labelBn: 'হোভার ব্যাকগ্রাউন্ড', default: '#F3F4F6' },
        ]
      },
      {
        title: language === 'bn' ? 'স্টেটস রং' : 'Status Colors',
        colors: [
          { key: 'successColor', label: 'Success', labelBn: 'সফল', default: '#10B981' },
          { key: 'errorColor', label: 'Error', labelBn: 'ত্রুটি', default: '#EF4444' },
          { key: 'warningColor', label: 'Warning', labelBn: 'সতর্কতা', default: '#F59E0B' },
          { key: 'infoColor', label: 'Info', labelBn: 'তথ্য', default: '#3B82F6' },
        ]
      }
    ];

    return (
      <div className="space-y-8">
        {colorGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              {group.title}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.colors.map((color) => (
                <div key={color.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'bn' ? color.labelBn : color.label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings?.[color.key as keyof SettingsData] as string || color.default}
                      onChange={(e) => setSettings({
                        ...settings,
                        [color.key]: e.target.value
                      })}
                      className="w-12 h-12 rounded-lg border cursor-pointer shadow-sm"
                    />
                    <input
                      type="text"
                      value={settings?.[color.key as keyof SettingsData] as string || color.default}
                      onChange={(e) => setSettings({
                        ...settings,
                        [color.key]: e.target.value
                      })}
                      className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                      placeholder={color.default}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Gradient Direction */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            {language === 'bn' ? 'গ্রেডিয়েন্ট ডিরেকশন' : 'Gradient Direction'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'to-r', label: 'Left to Right', labelBn: 'বাম থেকে ডানে' },
              { value: 'to-l', label: 'Right to Left', labelBn: 'ডান থেকে বামে' },
              { value: 'to-t', label: 'Top to Bottom', labelBn: 'উপর থেকে নিচে' },
              { value: 'to-b', label: 'Bottom to Top', labelBn: 'নিচ থেকে উপরে' },
              { value: 'to-tr', label: 'Top Right', labelBn: 'উপর ডানে' },
              { value: 'to-tl', label: 'Top Left', labelBn: 'উপর বামে' },
              { value: 'to-br', label: 'Bottom Right', labelBn: 'নিচ ডানে' },
              { value: 'to-bl', label: 'Bottom Left', labelBn: 'নিচ বামে' },
            ].map((dir) => (
              <button
                key={dir.value}
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  gradientDirection: dir.value
                })}
                className={`p-3 border rounded-lg text-sm font-medium transition-all ${settings?.gradientDirection === dir.value
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                {language === 'bn' ? dir.labelBn : dir.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            {language === 'bn' ? 'লাইভ প্রিভিউ' : 'Live Preview'}
          </h3>
          <div
            className="p-6 rounded-xl transition-all duration-300"
            style={{
              backgroundColor: settings?.backgroundColor || '#FFFFFF',
              color: settings?.textColor || '#1F2937',
              border: `1px solid ${settings?.borderColor || '#E5E7EB'}`
            }}
          >
            <div
              className="p-4 rounded-lg mb-4"
              style={{
                background: `linear-gradient(${settings?.gradientDirection || 'to-r'}, ${settings?.gradientStart || '#3B82F6'}, ${settings?.gradientEnd || '#10B981'})`
              }}
            >
              <h4 className="text-white font-bold">Gradient Preview</h4>
            </div>

            <div className="flex gap-3 mb-4 flex-wrap">
              <button
                type="button"
                className="px-4 py-2 text-white rounded-lg transition-all"
                style={{
                  backgroundColor: settings?.buttonPrimary || settings?.primaryColor || '#3B82F6',
                  borderRadius: settings?.buttonStyle === 'pill' ? '9999px' :
                    settings?.buttonStyle === 'rounded' ? '0.5rem' : '0px'
                }}
              >
                Primary
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: settings?.buttonSecondary || settings?.secondaryColor || '#10B981',
                  color: settings?.buttonSecondary || settings?.secondaryColor || '#10B981',
                  borderRadius: settings?.buttonStyle === 'pill' ? '9999px' :
                    settings?.buttonStyle === 'rounded' ? '0.5rem' : '0px'
                }}
              >
                Secondary
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white rounded-lg transition-all"
                style={{
                  backgroundColor: settings?.buttonDanger || '#EF4444',
                  borderRadius: settings?.buttonStyle === 'pill' ? '9999px' :
                    settings?.buttonStyle === 'rounded' ? '0.5rem' : '0px'
                }}
              >
                Danger
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-lg shadow-sm"
                style={{
                  backgroundColor: settings?.cardBackground || '#FFFFFF',
                  border: `1px solid ${settings?.borderColor || '#E5E7EB'}`,
                  borderRadius: settings?.borderRadius || '0.5rem'
                }}
              >
                <h5 style={{ color: settings?.headingColor || '#111827' }} className="font-semibold mb-2">
                  Card Title
                </h5>
                <p style={{ color: settings?.textSecondary || '#6B7280' }} className="text-sm">
                  Sample card showing your color scheme.
                </p>
              </div>
              <div
                className="p-4 rounded-lg shadow-sm"
                style={{
                  backgroundColor: settings?.cardBackground || '#FFFFFF',
                  border: `1px solid ${settings?.borderColor || '#E5E7EB'}`,
                  borderRadius: settings?.borderRadius || '0.5rem'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: settings?.successColor || '#10B981' }}
                  ></div>
                  <span style={{ color: settings?.headingColor || '#111827' }} className="font-semibold">
                    Status: Active
                  </span>
                </div>
                <p style={{ color: settings?.textMuted || '#9CA3AF' }} className="text-sm">
                  Interactive states preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Typography Settings
const TypographySettings: React.FC<{ settings: SettingsData; setSettings: React.Dispatch<React.SetStateAction<SettingsData>>; language: string }> =
  ({ settings, setSettings, language }) => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'bn' ? 'বডি ফন্ট' : 'Body Font'}
          </label>
          <select
            value={settings?.fontFamily || "Inter"}
            onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Poppins">Poppins</option>
            <option value="Noto Sans Bengali">Noto Sans Bengali</option>
            <option value="Hind Siliguri">Hind Siliguri</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'bn' ? 'বেস ফন্ট সাইজ' : 'Base Font Size'}
          </label>
          <select
            value={settings?.baseFontSize || "16px"}
            onChange={(e) => setSettings({ ...settings, baseFontSize: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="14px">Small (14px)</option>
            <option value="16px">Normal (16px)</option>
            <option value="18px">Large (18px)</option>
            <option value="20px">Extra Large (20px)</option>
          </select>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p style={{ fontFamily: settings?.fontFamily, fontSize: settings?.baseFontSize }}>
          {language === 'bn' ? 'দ্রুত বাদামী শিয়াল অলস কুকুরের উপর লাফ দেয়।' : 'The quick brown fox jumps over the lazy dog.'}
        </p>
      </div>
    </div>
  );

// Layout Settings
const LayoutSettings: React.FC<{ settings: SettingsData; setSettings: React.Dispatch<React.SetStateAction<SettingsData>>; language: string }> =
  ({ settings, setSettings, language }) => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'bn' ? 'লেআউট স্টাইল' : 'Layout Style'}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, layoutStyle: 'full' })}
              className={`flex-1 p-3 border rounded-lg text-center ${settings?.layoutStyle === 'full' ? 'border-blue-500 bg-blue-50' : ''
                }`}
            >
              {language === 'bn' ? 'পূর্ণ প্রস্থ' : 'Full Width'}
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, layoutStyle: 'boxed' })}
              className={`flex-1 p-3 border rounded-lg text-center ${settings?.layoutStyle === 'boxed' ? 'border-blue-500 bg-blue-50' : ''
                }`}
            >
              {language === 'bn' ? 'বক্সড' : 'Boxed'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'bn' ? 'বর্ডার রেডিয়াস' : 'Border Radius'}
          </label>
          <select
            value={settings?.borderRadius || "0.5rem"}
            onChange={(e) => setSettings({ ...settings, borderRadius: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="0rem">{language === 'bn' ? 'কোনটি নয়' : 'None'}</option>
            <option value="0.25rem">{language === 'bn' ? 'ছোট' : 'Small'}</option>
            <option value="0.5rem">{language === 'bn' ? 'মাঝারি' : 'Medium'}</option>
            <option value="0.75rem">{language === 'bn' ? 'বড়' : 'Large'}</option>
            <option value="1rem">{language === 'bn' ? 'অতিরিক্ত বড়' : 'Extra Large'}</option>
          </select>
        </div>
      </div>
    </div>
  );

// Component Settings
const ComponentSettings: React.FC<{ settings: SettingsData; setSettings: React.Dispatch<React.SetStateAction<SettingsData>>; language: string }> =
  ({ settings, setSettings, language }) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'bn' ? 'বাটন স্টাইল' : 'Button Style'}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, buttonStyle: 'rounded' })}
              className={`px-4 py-2 rounded-md ${settings?.buttonStyle === 'rounded' ? 'bg-blue-500 text-white' : 'border'
                }`}
            >
              Rounded
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, buttonStyle: 'pill' })}
              className={`px-4 py-2 rounded-full ${settings?.buttonStyle === 'pill' ? 'bg-blue-500 text-white' : 'border'
                }`}
            >
              Pill
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, buttonStyle: 'square' })}
              className={`px-4 py-2 rounded-none ${settings?.buttonStyle === 'square' ? 'bg-blue-500 text-white' : 'border'
                }`}
            >
              Square
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'bn' ? 'কার্ড স্টাইল' : 'Card Style'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, cardStyle: 'flat' })}
              className={`p-2 border rounded-lg ${settings?.cardStyle === 'flat' ? 'border-blue-500 bg-blue-50' : ''
                }`}
            >
              Flat
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, cardStyle: 'elevated' })}
              className={`p-2 border rounded-lg ${settings?.cardStyle === 'elevated' ? 'border-blue-500 bg-blue-50' : ''
                }`}
            >
              Elevated
            </button>
          </div>
        </div>
      </div>
    </div>
  );

// Custom Code Settings
const CustomCodeSettings: React.FC<{ settings: SettingsData; setSettings: React.Dispatch<React.SetStateAction<SettingsData>>; language: string }> =
  ({ settings, setSettings, language }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom CSS
        </label>
        <textarea
          value={settings?.customCSS || ""}
          onChange={(e) => setSettings({ ...settings, customCSS: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  /* Your styles */&#10;}"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Custom JavaScript
        </label>
        <textarea
          value={settings?.customJS || ""}
          onChange={(e) => setSettings({ ...settings, customJS: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          placeholder="// Add your custom JavaScript here&#10;document.addEventListener('DOMContentLoaded', function() {&#10;  // Your code here&#10;});"
        />
      </div>
    </div>
  );

// Theme Preview Modal
const ThemePreviewModal: React.FC<{ settings: SettingsData; onClose: () => void; language: string }> = ({ settings, onClose, language }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <h3 className="font-semibold">{language === 'bn' ? 'থিম প্রিভিউ' : 'Theme Preview'}</h3>
        <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          ✕
        </button>
      </div>
      <div className="p-6">
        <div style={{
          backgroundColor: settings?.backgroundColor,
          color: settings?.textColor,
          fontFamily: settings?.fontFamily
        }}>
          <div className="space-y-4">
            <button type="button" style={{
              backgroundColor: settings?.primaryColor,
              borderRadius: settings?.buttonStyle === 'pill' ? '9999px' :
                settings?.buttonStyle === 'rounded' ? '0.5rem' : '0px',
              padding: '0.5rem 1rem'
            }} className="text-white">
              {language === 'bn' ? 'প্রাথমিক বাটন' : 'Primary Button'}
            </button>

            <div style={{
              border: `1px solid ${settings?.borderColor || '#E5E7EB'}`,
              borderRadius: settings?.borderRadius || '0.5rem',
              padding: '1rem',
              backgroundColor: settings?.cardBackground || '#FFFFFF'
            }}>
              <h3 style={{ color: settings?.headingColor || '#111827' }} className="font-semibold mb-2">
                {language === 'bn' ? 'নমুনা কার্ড' : 'Sample Card'}
              </h3>
              <p style={{ color: settings?.textSecondary || '#6B7280' }}>
                {language === 'bn' ? 'এটি একটি নমুনা কার্ড যা আপনার থিমের ডিজাইন দেখাচ্ছে।' : 'This is a sample card showing your theme design.'}
              </p>
              <Link
                href="#"
                style={{ color: settings?.linkColor || '#3B82F6' }}
                className="text-sm mt-2 inline-block hover:underline"
              >
                {language === 'bn' ? 'আরও জানুন →' : 'Learn More →'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);