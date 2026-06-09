// app/models/subcategory-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  nameBn: string;
  categoryId: mongoose.Types.ObjectId;
  slug: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  bannerImage?: string;
  description: string;
  descriptionBn: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameBn: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "Folder",
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

subCategorySchema.index({ name: 1, slug: 1 });
subCategorySchema.index({ categoryId: 1 });

export const SubCategory = (mongoose.models.SubCategory as Model<ISubCategory>) ||
  mongoose.model<ISubCategory>("SubCategory", subCategorySchema);