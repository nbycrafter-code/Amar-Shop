// models/slider-model.ts
import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleBn: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  subtitleBn: {
    type: String,
    default: "",
  },
  buttonText: {
    type: String,
    default: "Shop Now",
  },
  buttonTextBn: {
    type: String,
    default: "কিনুন এখন",
  },
  buttonLink: {
    type: String,
    default: "/shop",
  },
  bgImage: {
    type: String,
    required: true,
  },
  mobileImage: {
    type: String,
  },
  bgVideo: {
    type: String,
  },
  textColor: {
    type: String,
    default: "text-white",
  },
  highlightColor: {
    type: String,
    default: "text-lime-400",
  },
  gradient: {
    type: String,
    default: "from-black/50 via-black/20 to-transparent",
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const Slider = mongoose.models.Slider || mongoose.model("Slider", sliderSchema);