import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISeo extends Document {
  productId: string;
  pageId: string;
  pageType: string;
  slug?: string;
  seoTitle: string;
  seoDescription: string;
  seoTags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  seoTitleBn: string;
  seoDescriptionBn: string;
  seoTagsBn: string[];
  primaryKeywordBn: string;
  secondaryKeywordsBn: string[];
  canonicalUrl: string;
  schemaMarkup: any;
  robotsMeta: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const seoSchema = new Schema<ISeo>(
  {
    productId: {
      type: String,
      // index: true,
      // sparse: true,
    },
    pageId: {
      type: String,
      // index: true,
      // sparse: true,
    },
    pageType: {
      type: String,
      enum: ["product", "category", "brand", "size", "color", "page", "blog", "home"],
      default: "page",
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
    seoTags: [{ type: String, trim: true }],
    primaryKeyword: { type: String, trim: true, default: "" },
    secondaryKeywords: [{ type: String, trim: true }],
    seoTitleBn: { type: String, trim: true, default: "" },
    seoDescriptionBn: { type: String, trim: true, default: "" },
    seoTagsBn: [{ type: String, trim: true }],
    primaryKeywordBn: { type: String, trim: true, default: "" },
    secondaryKeywordsBn: [{ type: String, trim: true }],
    canonicalUrl: { type: String, trim: true, default: "" },
    schemaMarkup: { type: Schema.Types.Mixed, default: null },
    robotsMeta: { type: String, default: "index,follow" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Drop existing indexes if any and create new ones
// seoSchema.index({ productId: 1, pageType: 1 }, { unique: true, sparse: true });
// seoSchema.index({ pageId: 1, pageType: 1 }, { unique: true, sparse: true });

export const Seo = (mongoose.models.Seo as Model<ISeo>) || 
  mongoose.model<ISeo>("Seo", seoSchema);