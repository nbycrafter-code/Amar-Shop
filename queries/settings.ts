// queries/settings.ts
import { Settings } from "@/models/settings-model";

export interface SettingsType {
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
  tiktok: string;
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
}

// Get all settings
export async function getSetting(): Promise<SettingsType | null> {
  try {
    const settings = await Settings.findOne({ active: true }).lean();
    return settings as SettingsType;
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
}

// Get single setting by key
export async function getSettingByKey(key: keyof SettingsType): Promise<string | null> {
  try {
    const settings = await Settings.findOne({ active: true }).lean();
    return settings ? (settings[key] as string) : null;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return null;
  }
}

// Update settings
export async function updateSettings(updateData: Partial<SettingsType>): Promise<SettingsType | null> {
  try {
    const settings = await Settings.findOneAndUpdate(
      { active: true },
      { $set: { ...updateData, updated_at: new Date() } },
      { new: true, upsert: true }
    ).lean();
    return settings as SettingsType;
  } catch (error) {
    console.error("Error updating settings:", error);
    return null;
  }
}

// Update single setting
export async function updateSingleSetting(key: keyof SettingsType, value: string): Promise<SettingsType | null> {
  try {
    const updateData = { [key]: value, updated_at: new Date() };
    const settings = await Settings.findOneAndUpdate(
      { active: true },
      { $set: updateData },
      { new: true }
    ).lean();
    return settings as SettingsType;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return null;
  }
}

// Reset to default settings
export async function resetSettings(): Promise<SettingsType> {
  try {
    await Settings.deleteMany({});
    
    const defaultSettings = await Settings.create({
      siteName: "My Store",
      siteNameBn: "মাই স্টোর",
      siteTitle: "My Store - Best Online Shop",
      siteTitleBn: "মাই স্টোর - সেরা অনলাইন শপ",
      siteDescription: "Welcome to our online store",
      siteDescriptionBn: "আমাদের অনলাইন স্টোরে স্বাগতম",
      copyright: "© 2024 All rights reserved",
      copyrightBn: "© ২০২৪ সর্বস্বত্ব সংরক্ষিত",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      active: true,
    });
    
    return defaultSettings;
  } catch (error) {
    console.error("Error resetting settings:", error);
    throw error;
  }
}

// Check if settings exist
export async function settingsExist(): Promise<boolean> {
  try {
    const count = await Settings.countDocuments({ active: true });
    return count > 0;
  } catch (error) {
    console.error("Error checking settings:", error);
    return false;
  }
}

// Get public settings (for frontend)
export async function getPublicSettings() {
  try {
    const settings = await Settings.findOne({ active: true })
      .select("siteName siteNameBn siteTitle siteTitleBn siteDescription siteDescriptionBn logo favicon footerText footerTextBn copyright copyrightBn primaryColor secondaryColor facebook twitter instagram linkedin tiktok youtube whatsapp email phone address addressBn")
      .lean();
    return settings;
  } catch (error) {
    console.error("Error getting public settings:", error);
    return null;
  }
}

// Get social links only
export async function getSocialLinks() {
  try {
    const settings = await Settings.findOne({ active: true })
      .select("facebook twitter instagram linkedin tiktok youtube whatsapp")
      .lean();
    return settings;
  } catch (error) {
    console.error("Error getting social links:", error);
    return null;
  }
}

// Get contact info only
export async function getContactInfo() {
  try {
    const settings = await Settings.findOne({ active: true })
      .select("email phone address addressBn")
      .lean();
    return settings;
  } catch (error) {
    console.error("Error getting contact info:", error);
    return null;
  }
}

// Get SEO settings only
export async function getSEOSettings() {
  try {
    const settings = await Settings.findOne({ active: true })
      .select("metaKeywords metaKeywordsBn googleAnalyticsId facebookPixelId siteTitle siteTitleBn siteDescription siteDescriptionBn")
      .lean();
    return settings;
  } catch (error) {
    console.error("Error getting SEO settings:", error);
    return null;
  }
}