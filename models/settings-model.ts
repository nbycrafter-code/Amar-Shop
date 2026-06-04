// app/model/settings-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

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
  
  // Theme
  primaryColor: string;
  secondaryColor: string;
  
  // Status
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    // Basic Info
    siteName: {
      type: String,
      required: true,
      default: "My Store",
      trim: true,
    },
    siteNameBn: {
      type: String,
      required: true,
      default: "মাই স্টোর",
      trim: true,
    },
    siteTitle: {
      type: String,
      required: true,
      default: "My Store - Best Online Shop",
      trim: true,
    },
    siteTitleBn: {
      type: String,
      required: true,
      default: "মাই স্টোর - সেরা অনলাইন শপ",
      trim: true,
    },
    siteDescription: {
      type: String,
      default: "Welcome to our online store. Find the best products at affordable prices.",
      trim: true,
    },
    siteDescriptionBn: {
      type: String,
      default: "আমাদের অনলাইন স্টোরে স্বাগতম। সাশ্রয়ী মূল্যে সেরা পণ্য খুঁজুন।",
      trim: true,
    },
    
    // Images
    favicon: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    footerLogo: {
      type: String,
      default: "",
    },
    
    // Footer
    footerText: {
      type: String,
      default: "",
      trim: true,
    },
    footerTextBn: {
      type: String,
      default: "",
      trim: true,
    },
    copyright: {
      type: String,
      default: "© 2024 All rights reserved",
      trim: true,
    },
    copyrightBn: {
      type: String,
      default: "© ২০২৪ সর্বস্বত্ব সংরক্ষিত",
      trim: true,
    },
    
    // Social Links
    facebook: {
      type: String,
      default: "",
      trim: true,
    },
    twitter: {
      type: String,
      default: "",
      trim: true,
    },
    instagram: {
      type: String,
      default: "",
      trim: true,
    },
    linkedin: {
      type: String,
      default: "",
      trim: true,
    },
    tiktok: {
      type: String,
      default: "",
      trim: true,
    },
    youtube: {
      type: String,
      default: "",
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },
    
    // Contact Info
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    addressBn: {
      type: String,
      default: "",
      trim: true,
    },
    
    // SEO
    metaKeywords: {
      type: String,
      default: "",
      trim: true,
    },
    metaKeywordsBn: {
      type: String,
      default: "",
      trim: true,
    },
    googleAnalyticsId: {
      type: String,
      default: "",
      trim: true,
    },
    facebookPixelId: {
      type: String,
      default: "",
      trim: true,
    },
    
    // Theme
    primaryColor: {
      type: String,
      default: "#3B82F6",
      trim: true,
    },
    secondaryColor: {
      type: String,
      default: "#10B981",
      trim: true,
    },
    
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create indexes for better performance
settingsSchema.index({ siteName: 1 });
settingsSchema.index({ active: 1 });

export const Settings = (mongoose.models.Settings as Model<ISettings>) || 
  mongoose.model<ISettings>("Settings", settingsSchema);