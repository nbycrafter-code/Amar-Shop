// queries/banner.ts
import { Banner } from "@/model/banner-model";

export interface BannerType {
  _id?: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  buttonText: string;
  buttonTextBn: string;
  buttonLink: string;
  bgImage: string;
  mobileImage?: string;
  textColor: string;
  highlightColor: string;
  gradient: string;
  order: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Get all active banners
export async function getActiveBanners(): Promise<BannerType[]> {
  try {
    const now = new Date();
    const banners = await Banner.find({
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    })
    .sort({ order: 1, created_at: -1 })
    .lean();
    
    return banners as BannerType[];
  } catch (error) {
    console.error("Error fetching active banners:", error);
    return [];
  }
}

// Get all banners (admin)
export async function getAllBanners(): Promise<BannerType[]> {
  try {
    const banners = await Banner.find({}).sort({ order: 1, created_at: -1 }).lean();
    return banners as BannerType[];
  } catch (error) {
    console.error("Error fetching all banners:", error);
    return [];
  }
}

// Get single banner by ID
export async function getBannerById(id: string): Promise<BannerType | null> {
  try {
    const banner = await Banner.findById(id).lean();
    return banner as BannerType;
  } catch (error) {
    console.error("Error fetching banner by ID:", error);
    return null;
  }
}

// Create new banner
export async function createBanner(data: Partial<BannerType>): Promise<BannerType | null> {
  try {
    const banner = await Banner.create(data);
    return banner.toObject() as BannerType;
  } catch (error) {
    console.error("Error creating banner:", error);
    return null;
  }
}

// Update banner
export async function updateBanner(id: string, data: Partial<BannerType>): Promise<BannerType | null> {
  try {
    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: { ...data, updated_at: new Date() } },
      { new: true }
    ).lean();
    return banner as BannerType;
  } catch (error) {
    console.error("Error updating banner:", error);
    return null;
  }
}

// Delete banner
export async function deleteBanner(id: string): Promise<boolean> {
  try {
    const result = await Banner.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error("Error deleting banner:", error);
    return false;
  }
}

// Update banner order
export async function updateBannerOrder(orders: { id: string; order: number }[]): Promise<boolean> {
  try {    
    const bulkOps = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));
    
    await Banner.bulkWrite(bulkOps);
    return true;
  } catch (error) {
    console.error("Error updating banner orders:", error);
    return false;
  }
}

// Toggle banner status
export async function toggleBannerStatus(id: string, active: boolean): Promise<BannerType | null> {
  try {
    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: { active, updated_at: new Date() } },
      { new: true }
    ).lean();
    return banner as BannerType;
  } catch (error) {
    console.error("Error toggling banner status:", error);
    return null;
  }
}