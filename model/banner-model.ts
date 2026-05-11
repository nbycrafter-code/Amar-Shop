// app/model/banner-model.ts
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
  textColor: string;
  highlightColor: string;
  gradient: string;
  order: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  created_at: Date;
  updated_at: Date;
}

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
      required: true,
      trim: true,
    },
    subtitleBn: {
      type: String,
      required: true,
      trim: true,
    },
    buttonText: {
      type: String,
      required: true,
      default: "Shop Now",
    },
    buttonTextBn: {
      type: String,
      required: true,
      default: "কিনুন এখন",
    },
    buttonLink: {
      type: String,
      required: true,
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

// Create indexes
bannerSchema.index({ order: 1, active: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

export const Banner = (mongoose.models.Banner as Model<IBanner>) || 
  mongoose.model<IBanner>("Banner", bannerSchema);