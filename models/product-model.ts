import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  nameBn: string;
  price: number;
  oldPrice: number;
  discount: number;
  discountType: string;
  stock: number;
  categoryId: mongoose.Types.ObjectId;
  subCategoryId: mongoose.Types.ObjectId | null;
  brandId: mongoose.Types.ObjectId;
  sizeIds: mongoose.Types.ObjectId[];
  colorIds: mongoose.Types.ObjectId[];
  shortDescription: string;
  shortDescriptionBn: string;
  longDescription: string;
  longDescriptionBn: string;
  image: string;
  multiImages: string[];
  video: string;
  slug: string;
  section: string;
  badge: string;
  productType: string;
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
    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
      default: 'percentage',
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      default: null,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    sizeIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Size',
    }],
    colorIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Color',
    }],
    shortDescription: {
      type: String,
      default: "",
    },
    shortDescriptionBn: {
      type: String,
      default: "",
    },
    longDescription: {
      type: String,
      default: "",
    },
    longDescriptionBn: {
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
    section: {
      type: String,
      default: "none",
    },
    badge: {
      type: String,
      default: "none",
    },
    productType: {
      type: String,
      enum: ['simple', 'variable', 'digital', 'service', 'affiliate'],
      default: 'simple',
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
productSchema.index({ categoryId: 1, subCategoryId: 1, brandId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ created_at: -1 });
productSchema.index({ discount: 1, discountType: 1 });
productSchema.index({ section: 1, badge: 1 });

export const Product = (mongoose.models.Product as Model<IProduct>) || 
  mongoose.model<IProduct>("Product", productSchema);