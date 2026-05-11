// app/model/order-model.ts - Fixed version
import mongoose, { Schema, models } from "mongoose";

export interface OrderItem {
  productId: string;
  name: string;
  nameBn: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image?: string;
}

export interface Order extends Document {
  _id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Function to generate order ID
function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}${day}${hours}${minutes}${seconds}-${random}`;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  nameBn: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, default: null },
  selectedColor: { type: String, default: null },
  image: { type: String, default: null },
});

const OrderSchema = new Schema(
  {
    orderId: { 
      type: String, 
      required: true, 
      unique: true,
      // Remove default here - we'll set it manually
    },
    customerName: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      enum: ["cash_on_delivery", "online"], 
      default: "cash_on_delivery" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "failed"], 
      default: "pending" 
    },
    orderStatus: { 
      type: String, 
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], 
      default: "pending" 
    },
    specialInstructions: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// REMOVE any pre-save or pre-validate middleware that might be causing issues
// If you have any, comment them out:

// OrderSchema.pre('save', function(next) {
//   if (!this.orderId) {
//     this.orderId = generateOrderId();
//   }
//   next();
// });

export const Order = models.Order || mongoose.model<Order>("Order", OrderSchema);