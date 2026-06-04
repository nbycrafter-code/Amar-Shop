// app/model/test-model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITest extends Document {
  name: string;
  nameBn: string;
  country: string;
  slug: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const testSchema = new Schema<ITest>(
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
testSchema.index({ name: 1, slug: 1 });

export const Test = (mongoose.models.Test as Model<ITest>) || 
  mongoose.model<ITest>("Test", testSchema);