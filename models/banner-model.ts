// app/models/banner-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  buttonText: string;
  buttonTextBn: string;
  buttonLink: string;
  bgImage: string;
  bgVideo: string;
  mediaType: string;
  textColor: string;
  highlightColor: string;
  gradient: string;
  order: number;
  active: boolean;
  pageType: string;
  pagePosition: string;
  startDate?: Date;
  endDate?: Date;
  created_at: Date;
  updated_at: Date;
}

// Page type options
export const pageTypeOptions = [
  "homepage",
  "shop", 
  "product-details",
  "category",
  "cart",
  "checkout",
  "about",
  "contact",
  "blog",
  "all"
] as const;

// Page position options
export const pagePositionOptions = [
  "hero",
  "banner-grid-1",
  "banner-grid-2",
  "banner-grid-3",
  "banner-grid-4",
  "promo",
  "category",
  "bottom",
  "sidebar",
  "popup"
] as const;

const bannerSchema = new Schema<IBanner>(
  {
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
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    subtitleBn: {
      type: String,
      default: "",
      trim: true,
    },
    buttonText: {
      type: String,
      default: "Shop Now",
    },
    buttonTextBn: {
      type: String,
      default: "কিনুন এখন",
    },
    buttonLink: {
      type: String,
      default: "/shop",
    },
    bgImage: {
      type: String,
      default: "",
    },
    bgVideo: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    textColor: {
      type: String,
      default: "text-white",
    },
    highlightColor: {
      type: String,
      default: "text-lime-300",
    },
    gradient: {
      type: String,
      default: "from-black/30 via-black/15 to-transparent",
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    pageType: {
      type: String,
      required: true,
      default: "homepage",
      enum: pageTypeOptions,
    },
    pagePosition: {
      type: String,
      required: true,
      default: "hero",
      enum: pagePositionOptions,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create indexes for better query performance
bannerSchema.index({ order: 1, active: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });
bannerSchema.index({ pageType: 1, pagePosition: 1, active: 1 });
bannerSchema.index({ pageType: 1, order: 1 });

export const Banner = (mongoose.models.Banner as Model<IBanner>) || 
  mongoose.model<IBanner>("Banner", bannerSchema);