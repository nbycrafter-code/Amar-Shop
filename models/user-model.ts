// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       minlength: [2, "Name must be at least 2 characters"],
//       maxlength: [50, "Name must be less than 50 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
//     },
//     password: {
//       type: String,
//       required: [false, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin", "moderator"],
//       default: "user",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     lastLogin: {
//       type: Date,
//       default: null,
//     },
//     resetPasswordToken: {
//       type: String,
//       select: false,
//     },
//     resetPasswordExpires: {
//       type: Date,
//       select: false,
//     },
//   },
//   {
//     timestamps: {
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   }
// );

// // Remove password when converting to JSON
// userSchema.set("toJSON", {
//   transform: (doc, ret) => {
//     delete ret.password;
//     delete ret.resetPasswordToken;
//     delete ret.resetPasswordExpires;
//     return ret;
//   },
// });

// // Index for faster queries
// userSchema.index({ email: 1 });
// userSchema.index({ role: 1 });

// export const User = mongoose.models.User || mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // OAuth user এর জন্য password প্রয়োজন হবে না
    },
    image: { type: String, default: null },
    provider: {
      type: String,
      required: false,
    },
    providerId: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    verificationToken: String,
    lastLogin: Date,
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    billingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "Bangladesh" },
      phone: String,
      email: String,
    },
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "Bangladesh" },
      phone: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);