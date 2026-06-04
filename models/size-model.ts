// app/model/size-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISize extends Document {
  name: string;
  slug: string;
  active: boolean;
  page_set: string[];
  created_at: Date;
  updated_at: Date;
}

const sizeSchema = new Schema<ISize>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
sizeSchema.index({ name: 1, slug: 1, hex: 1 });

export const Size = (mongoose.models.Size as Model<ISize>) || 
  mongoose.model<ISize>("Size", sizeSchema);