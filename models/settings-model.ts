// models/settings-model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
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
  
  // Theme - Basic Colors
  primaryColor: string;
  secondaryColor: string;
  activeTheme: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  baseFontSize: string;
  layoutStyle: string;
  borderRadius: string;
  buttonStyle: string;
  cardStyle: string;
  customCSS: string;
  customJS: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: string;
  borderColor: string;
  cardBackground: string;
  headingColor: string;
  
  // Extended Color Fields
  accentColor: string;
  textSecondary: string;
  textMuted: string;
  borderHover: string;
  dividerColor: string;
  headerBackground: string;
  footerBackground: string;
  headerStyle: string;
  footerStyle: string;
  hoverEffect: string;
  
  // Button Colors
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
  buttonDanger: string;
  buttonWarning: string;
  buttonSuccess: string;
  
  // Link & Hover Colors
  linkColor: string;
  linkHover: string;
  hoverBackground: string;
  
  // Status Colors
  successColor: string;
  errorColor: string;
  warningColor: string;
  infoColor: string;
  
  // Gray Scale
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
  
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const SettingsSchema = new Schema({
  // Basic Info
  siteName: { type: String, default: "My Store" },
  siteNameBn: { type: String, default: "মাই স্টোর" },
  siteTitle: { type: String, default: "My Store - Best Online Shop" },
  siteTitleBn: { type: String, default: "মাই স্টোর - সেরা অনলাইন শপ" },
  siteDescription: { type: String, default: "" },
  siteDescriptionBn: { type: String, default: "" },
  
  // Images
  favicon: { type: String, default: "" },
  logo: { type: String, default: "" },
  footerLogo: { type: String, default: "" },
  
  // Footer
  footerText: { type: String, default: "" },
  footerTextBn: { type: String, default: "" },
  copyright: { type: String, default: "" },
  copyrightBn: { type: String, default: "" },
  
  // Social Links
  facebook: { type: String, default: "" },
  twitter: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  tiktok: { type: String, default: "" },
  youtube: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  
  // Contact Info
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  addressBn: { type: String, default: "" },
  
  // SEO
  metaKeywords: { type: String, default: "" },
  metaKeywordsBn: { type: String, default: "" },
  googleAnalyticsId: { type: String, default: "" },
  facebookPixelId: { type: String, default: "" },
  
  // Theme - Basic Colors
  primaryColor: { type: String, default: "#3B82F6" },
  secondaryColor: { type: String, default: "#10B981" },
  activeTheme: { type: String, default: "modern" },
  backgroundColor: { type: String, default: "#FFFFFF" },
  textColor: { type: String, default: "#1F2937" },
  fontFamily: { type: String, default: "Inter" },
  baseFontSize: { type: String, default: "16px" },
  layoutStyle: { type: String, default: "full" },
  borderRadius: { type: String, default: "0.5rem" },
  buttonStyle: { type: String, default: "rounded" },
  cardStyle: { type: String, default: "elevated" },
  customCSS: { type: String, default: "" },
  customJS: { type: String, default: "" },
  gradientStart: { type: String, default: "#3B82F6" },
  gradientEnd: { type: String, default: "#8B5CF6" },
  gradientDirection: { type: String, default: "to-r" },
  borderColor: { type: String, default: "#E5E7EB" },
  cardBackground: { type: String, default: "#FFFFFF" },
  headingColor: { type: String, default: "#111827" },
  
  // Extended Color Fields
  accentColor: { type: String, default: "#F59E0B" },
  textSecondary: { type: String, default: "#6B7280" },
  textMuted: { type: String, default: "#9CA3AF" },
  borderHover: { type: String, default: "#D1D5DB" },
  dividerColor: { type: String, default: "#F3F4F6" },
  headerBackground: { type: String, default: "#FFFFFF" },
  footerBackground: { type: String, default: "#1F2937" },
  headerStyle: { type: String, default: "default" },
  footerStyle: { type: String, default: "default" },
  hoverEffect: { type: String, default: "scale" },
  
  // Button Colors
  buttonPrimary: { type: String, default: "#3B82F6" },
  buttonPrimaryHover: { type: String, default: "#2563EB" },
  buttonSecondary: { type: String, default: "#10B981" },
  buttonSecondaryHover: { type: String, default: "#059669" },
  buttonDanger: { type: String, default: "#EF4444" },
  buttonWarning: { type: String, default: "#F59E0B" },
  buttonSuccess: { type: String, default: "#10B981" },
  
  // Link & Hover Colors
  linkColor: { type: String, default: "#3B82F6" },
  linkHover: { type: String, default: "#2563EB" },
  hoverBackground: { type: String, default: "#F3F4F6" },
  
  // Status Colors
  successColor: { type: String, default: "#10B981" },
  errorColor: { type: String, default: "#EF4444" },
  warningColor: { type: String, default: "#F59E0B" },
  infoColor: { type: String, default: "#3B82F6" },
  
  // Gray Scale
  gray50: { type: String, default: "#F9FAFB" },
  gray100: { type: String, default: "#F3F4F6" },
  gray200: { type: String, default: "#E5E7EB" },
  gray300: { type: String, default: "#D1D5DB" },
  gray400: { type: String, default: "#9CA3AF" },
  gray500: { type: String, default: "#6B7280" },
  gray600: { type: String, default: "#4B5563" },
  gray700: { type: String, default: "#374151" },
  gray800: { type: String, default: "#1F2937" },
  gray900: { type: String, default: "#111827" },
  
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);