// app/model/page-content-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageContent extends Document {
  pageType: "about" | "contact" | "privacy" | "terms" | "faq";
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  metaTitle: string;
  metaTitleBn: string;
  metaDescription: string;
  metaDescriptionBn: string;
  metaKeywords: string;
  metaKeywordsBn: string;
  
  // Contact page specific fields
  email?: string;
  phone?: string;
  address?: string;
  addressBn?: string;
  googleMapUrl?: string;
  workingHours?: string;
  workingHoursBn?: string;
  
  // About page specific fields
  mission?: string;
  missionBn?: string;
  vision?: string;
  visionBn?: string;
  history?: string;
  historyBn?: string;
  
  // Images
  bannerImage?: string;
  aboutImage?: string;
  
  // Social Links
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  
  // SEO
  schemaMarkup?: string;
  canonicalUrl?: string;
  
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const pageContentSchema = new Schema<IPageContent>(
  {
    pageType: {
      type: String,
      enum: ["about", "contact", "privacy", "terms", "faq"],
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleBn: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentBn: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaTitleBn: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaDescriptionBn: {
      type: String,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "",
    },
    metaKeywordsBn: {
      type: String,
      default: "",
    },
    
    // Contact page specific
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    addressBn: { type: String, default: "" },
    googleMapUrl: { type: String, default: "" },
    workingHours: { type: String, default: "" },
    workingHoursBn: { type: String, default: "" },
    
    // About page specific
    mission: { type: String, default: "" },
    missionBn: { type: String, default: "" },
    vision: { type: String, default: "" },
    visionBn: { type: String, default: "" },
    history: { type: String, default: "" },
    historyBn: { type: String, default: "" },
    
    // Images
    bannerImage: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
    
    // Social Links
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    
    // SEO
    schemaMarkup: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    
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

// Create indexes
pageContentSchema.index({ pageType: 1 });
pageContentSchema.index({ active: 1 });

export const PageContent = (mongoose.models.PageContent as Model<IPageContent>) || 
  mongoose.model<IPageContent>("PageContent", pageContentSchema);