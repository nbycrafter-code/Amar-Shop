// context/SettingsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface SettingsType {
  _id?: string;
  siteName: string;
  siteNameBn: string;
  siteTitle: string;
  siteTitleBn: string;
  siteDescription: string;
  siteDescriptionBn: string;
  favicon: string;
  logo: string;
  footerLogo: string;
  footerText: string;
  footerTextBn: string;
  copyright: string;
  copyrightBn: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  addressBn: string;
  metaKeywords: string;
  metaKeywordsBn: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  primaryColor: string;
  secondaryColor: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SettingsContextType {
  settings: SettingsType | null;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (formData: FormData) => Promise<boolean>;
  updateSingleSetting: (key: keyof SettingsType, value: string) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  getSetting: (key: keyof SettingsType) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings");
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        console.error("Failed to fetch settings:", data.error);
        toast.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // Update all settings (with images)
  const updateSettings = async (formData: FormData): Promise<boolean> => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        toast.success("Settings saved successfully!");
        return true;
      } else {
        toast.error(data.error || "Failed to save settings");
        return false;
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to save settings");
      return false;
    }
  };

  // Update single setting
  const updateSingleSetting = async (key: keyof SettingsType, value: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        toast.success(`${key} updated successfully!`);
        return true;
      } else {
        toast.error(data.error || "Failed to update setting");
        return false;
      }
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
      return false;
    }
  };

  // Reset settings to default
  const resetSettings = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/settings", {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        toast.success("Settings reset to default!");
        return true;
      } else {
        toast.error(data.error || "Failed to reset settings");
        return false;
      }
    } catch (error) {
      console.error("Error resetting settings:", error);
      toast.error("Failed to reset settings");
      return false;
    }
  };

  // Get single setting value
  const getSetting = (key: keyof SettingsType): string => {
    if (!settings) return "";
    return settings[key] as string || "";
  };

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
    settings,
    loading,
    fetchSettings,
    updateSettings,
    updateSingleSetting,
    resetSettings,
    getSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};