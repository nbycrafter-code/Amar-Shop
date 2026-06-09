// app/models/brand-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrand extends Document {
  name: string;
  nameBn: string;
  country: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  bannerImage?: string;
  image?: string;
  imageBgColor?: string;
  slug: string;
  description: string;
  descriptionBn: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nameBn: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "Building2",
    },
    iconColor: {
      type: String,
      default: "#3B82F6",
    },
    iconBgColor: {
      type: String,
      default: "#EFF6FF",
    },
    image: {
      type: String,
      default: "",
    },
    imageBgColor: {
      type: String,
      default: "#F8FAFC",
    },
    bannerImage: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: null,
    },
    descriptionBn: {
      type: String,
      default: null,
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

// Create index for better search performance
brandSchema.index({ name: 1, slug: 1 });
brandSchema.index({ active: 1 });

export const Brand = (mongoose.models.Brand as Model<IBrand>) ||
  mongoose.model<IBrand>("Brand", brandSchema);