import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "agent", "user"],
      default: "user",
    },
    profilePicture: { required: false, type: String },

    // Agent
    agentId: {
      type: String,
      required: function () {
        return this.role === "agent";
      },
    },
    agentName: { type: String, required: false },
    commissionRate: {
      type: String,
      required: function () {
        return this.role === "agent";
      },
      default: "15",
    },
    maxUsers: {
      type: String,
      required: function () {
        return this.role === "agent";
      },
      default: "50",
    },

    // User
    userId: {
      type: String,
      required: function () {
        return this.role === "user";
      },
    },
    maxFiles: {
      type: String,
      required: function () {
        return this.role === "user";
      },
      default: "10",
    },
    dailyLimit: {
      type: String,
      required: function () {
        return this.role === "user";
      },
      default: "5",
    },
    visaTypes: {
      type: [String],
      default: [],
    },
    preferredCenters: {
      type: [String],
      default: ["Dhaka"],
    },

    notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },

    
    created_by: {
      type: String,
      default: null,
    },
    updated_by: {
      type: String,
      default: null,
    },
    deleted_by: {
      type: String,
      default: null,
    },
    created_date: { type: String, default: null },
    created_at: { type: String, default: null },
    updated_at: { type: String, default: null },
    deleted_at: { type: String, default: null },
  },
);

// ✅ Prevent OverwriteModelError in hot-reloading (Next.js dev)
export const User = mongoose.models.User || mongoose.model("User", userSchema);
