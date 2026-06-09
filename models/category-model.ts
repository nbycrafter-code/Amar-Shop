// app/models/category-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  nameBn: string;
  icon: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  bannerImage?: string;
  slug: string;
  description: string;
  descriptionBn: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const categorySchema = new Schema<ICategory>(
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
    icon: {
      type: String,
      required: true,
      default: "ShoppingBag",
    },
    iconColor: {
      type: String,
      default: "#3B82F6",
      trim: true,
    },
    iconBgColor: {
      type: String,
      default: "#EFF6FF",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    imageBgColor: {
      type: String,
      default: "#F8FAFC",
      trim: true,
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

categorySchema.index({ name: 1, slug: 1 });
categorySchema.index({ iconColor: 1 });
categorySchema.index({ iconBgColor: 1 });

export const Category = (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>("Category", categorySchema);