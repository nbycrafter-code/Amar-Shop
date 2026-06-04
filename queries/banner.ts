// queries/banner.ts
import { Banner } from "@/models/banner-model";

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
  bgVideo?: string;
  mobileImage?: string;
  mediaType?: string;
  textColor: string;
  highlightColor: string;
  gradient: string;
  order: number;
  active: boolean;
  pageType: string;
  pagePosition: string;
  startDate?: Date;
  endDate?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Get banners by page type and position
export async function getBannersByPageAndPosition(
  pageType: string, 
  pagePosition?: string,
  activeOnly: boolean = true
): Promise<BannerType[]> {
  try {
    let query: any = {};
    
    if (activeOnly) {
      const now = new Date();
      query.active = true;
      query.$or = [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ];
      query.$and = [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
          ]
        }
      ];
    }
    
    // Add page type filter
    if (pageType && pageType !== 'all') {
      query.pageType = pageType;
    }
    
    // Add page position filter
    if (pagePosition) {
      query.pagePosition = pagePosition;
    }
    
    const banners = await Banner.find(query)
      .sort({ order: 1, created_at: -1 })
      .lean();
    
    return banners as BannerType[];
  } catch (error) {
    console.error("Error fetching banners by page and position:", error);
    return [];
  }
}

// Get all active banners (for backward compatibility)
export async function getActiveBanners(): Promise<BannerType[]> {
  try {
    const now = new Date();
    const banners = await Banner.find({
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
          ]
        }
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

// Get active banners by page type
export async function getActiveBannersByPageType(pageType: string): Promise<BannerType[]> {
  try {
    const now = new Date();
    const banners = await Banner.find({
      active: true,
      pageType: pageType,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
          ]
        }
      ]
    })
    .sort({ order: 1, created_at: -1 })
    .lean();
    
    return banners as BannerType[];
  } catch (error) {
    console.error(`Error fetching active banners for page ${pageType}:`, error);
    return [];
  }
}

// Get banners by specific position on a page
export async function getBannersByPosition(
  pageType: string, 
  pagePosition: string,
  activeOnly: boolean = true
): Promise<BannerType[]> {
  try {
    let query: any = {
      pageType: pageType,
      pagePosition: pagePosition
    };
    
    if (activeOnly) {
      const now = new Date();
      query.active = true;
      query.$or = [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ];
      query.$and = [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
          ]
        }
      ];
    }
    
    const banners = await Banner.find(query)
      .sort({ order: 1, created_at: -1 })
      .lean();
    
    return banners as BannerType[];
  } catch (error) {
    console.error(`Error fetching banners for position ${pagePosition} on ${pageType}:`, error);
    return [];
  }
}

// Get hero banners for homepage (convenience function)
export async function getHomepageHeroBanners(): Promise<BannerType[]> {
  return getBannersByPosition('homepage', 'hero', true);
}

// Get banner grid for homepage (convenience function)
export async function getHomepageGridBanners(position: string): Promise<BannerType[]> {
  return getBannersByPosition('homepage', position, true);
}

// Get all banners (admin)
export async function getAllBanners(filters?: {
  pageType?: string;
  pagePosition?: string;
  active?: boolean;
}): Promise<BannerType[]> {
  try {
    let query: any = {};
    
    if (filters?.pageType && filters.pageType !== 'all') {
      query.pageType = filters.pageType;
    }
    
    if (filters?.pagePosition) {
      query.pagePosition = filters.pagePosition;
    }
    
    if (filters?.active !== undefined) {
      query.active = filters.active;
    }
    
    const banners = await Banner.find(query)
      .sort({ order: 1, created_at: -1 })
      .lean();
    
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
    const banner = await Banner.create({
      ...data,
      pageType: data.pageType || "homepage",
      pagePosition: data.pagePosition || "hero",
      mediaType: data.mediaType || "image",
      created_at: new Date(),
      updated_at: new Date()
    });
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
      { new: true, runValidators: true }
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
        update: { $set: { order: item.order, updated_at: new Date() } },
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

// Get distinct page types (for filters)
export async function getDistinctPageTypes(): Promise<string[]> {
  try {
    const pageTypes = await Banner.distinct("pageType");
    return pageTypes;
  } catch (error) {
    console.error("Error fetching distinct page types:", error);
    return [];
  }
}

// Get distinct page positions (for filters)
export async function getDistinctPagePositions(pageType?: string): Promise<string[]> {
  try {
    let query = {};
    if (pageType) {
      query = { pageType };
    }
    const pagePositions = await Banner.distinct("pagePosition", query);
    return pagePositions;
  } catch (error) {
    console.error("Error fetching distinct page positions:", error);
    return [];
  }
}

// Get banners statistics
export async function getBannerStats() {
  try {
    const total = await Banner.countDocuments();
    const active = await Banner.countDocuments({ active: true });
    const inactive = await Banner.countDocuments({ active: false });
    const byPageType = await Banner.aggregate([
      {
        $group: {
          _id: "$pageType",
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] }
          }
        }
      }
    ]);
    
    return {
      total,
      active,
      inactive,
      byPageType
    };
  } catch (error) {
    console.error("Error fetching banner stats:", error);
    return null;
  }
}












// // কোনো কম্পোনেন্টে ব্যবহার করার জন্য:

// // 1. হোমপেজের হিরো ব্যানার
// const heroBanners = await getBannersByPosition('homepage', 'hero');

// // 2. হোমপেজের গ্রিড পজিশন 1
// const gridBanner1 = await getBannersByPosition('homepage', 'banner-grid-1');

// // 3. শুধু শপ পৃষ্ঠার সক্রিয় ব্যানার
// const shopBanners = await getActiveBannersByPageType('shop');

// // 4. কাস্টম কুয়েরি
// const customBanners = await getBannersByPageAndPosition('product-details', 'promo');

// // 5. অ্যাডমিন প্যানেলে সব ব্যানার ফিল্টার সহ
// const adminBanners = await getAllBanners({ 
//   pageType: 'homepage', 
//   pagePosition: 'hero',
//   active: true 
// });