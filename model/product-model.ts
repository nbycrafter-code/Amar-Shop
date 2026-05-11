// app/model/product-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  nameBn: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  description: string;
  descriptionBn: string;
  image: string;
  multiImages: string[];
  video: string;
  slug: string;
  active: boolean;
  sales: number;
  created_at: Date;
  updated_at: Date;
}

const productSchema = new Schema<IProduct>(
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    sizes: [{
      type: String,
      trim: true,
    }],
    colors: [{
      type: String,
      trim: true,
    }],
    description: {
      type: String,
      default: "",
    },
    descriptionBn: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    multiImages: [{
      type: String,
    }],
    video: {
      type: String,
      default: "",
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
    sales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create indexes for better search performance
productSchema.index({ name: 1, slug: 1 });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ created_at: -1 });

export const Product = (mongoose.models.Product as Model<IProduct>) || 
  mongoose.model<IProduct>("Product", productSchema);