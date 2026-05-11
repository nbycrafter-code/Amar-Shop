// app/model/category-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  nameBn: string;
  icon: string;
  iconColor?: string;
  image?: string;
  slug: string;
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
    },
    iconColor: {
      type: String,
      default: "#3B82F6",  // ডিফল্ট কালার (ব্লু)
      trim: true,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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

// Create index for better search performance
categorySchema.index({ name: 1, slug: 1 });
categorySchema.index({ iconColor: 1 });

export const Category = (mongoose.models.Category as Model<ICategory>) || 
  mongoose.model<ICategory>("Category", categorySchema);