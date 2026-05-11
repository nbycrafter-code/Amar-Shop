// app/model/color-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IColor extends Document {
  name: string;
  nameBn: string;
  hex: string;
  slug: string;
  active: boolean;
  page_set: string[];
  created_at: Date;
  updated_at: Date;
}

const colorSchema = new Schema<IColor>(
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
    hex: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
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
    page_set: [{
      type: String,
      enum: ["homepage", "product-page", "checkout-page"],
      default: [],
    }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create index for better search performance
colorSchema.index({ name: 1, slug: 1, hex: 1 });

export const Color = (mongoose.models.Color as Model<IColor>) || 
  mongoose.model<IColor>("Color", colorSchema);