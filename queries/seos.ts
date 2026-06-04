// lib/queries/seo-queries.ts
import { Seo } from "@/models/seo-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Types } from "mongoose";

// Types
export interface SeoData {
  _id?: string;
  productId?: string;
  pageId?: string;
  categoryId?: string;
  brandId?: string;
  sizeId?: string;
  colorId?: string;
  pageType?: "product" | "category" | "brand" | "size" | "color" | "page" | "blog" | "home";
  seoTitle?: string;
  seoTitleBn?: string;
  seoDescription?: string;
  seoDescriptionBn?: string;
  seoTags?: string[];
  seoTagsBn?: string[];
  primaryKeyword?: string;
  primaryKeywordBn?: string;
  secondaryKeywords?: string[];
  secondaryKeywordsBn?: string[];
  canonicalUrl?: string;
  schemaMarkup?: any;
  robotsMeta?: string;
  ogTitle?: string;
  ogTitleBn?: string;
  ogDescription?: string;
  ogDescriptionBn?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterTitleBn?: string;
  twitterDescription?: string;
  twitterDescriptionBn?: string;
  twitterImage?: string;
  twitterSite?: string;
  focusKeyword?: string;
  focusKeywordBn?: string;
  slug?: string;
  isActive?: boolean;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  avgPosition?: number;
  isIndexed?: boolean;
  lastIndexedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeoResponse {
  _id: string;
  id: string;
  productId?: string;
  pageId?: string;
  categoryId?: string;
  brandId?: string;
  sizeId?: string;
  colorId?: string;
  pageType: string;
  seoTitle: string;
  seoTitleBn: string;
  seoDescription: string;
  seoDescriptionBn: string;
  seoTags: string[];
  seoTagsBn: string[];
  primaryKeyword: string;
  primaryKeywordBn: string;
  secondaryKeywords: string[];
  secondaryKeywordsBn: string[];
  canonicalUrl: string;
  schemaMarkup: any;
  robotsMeta: string;
  ogTitle?: string;
  ogTitleBn?: string;
  ogDescription?: string;
  ogDescriptionBn?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterTitleBn?: string;
  twitterDescription?: string;
  twitterDescriptionBn?: string;
  twitterImage?: string;
  twitterSite?: string;
  focusKeyword?: string;
  focusKeywordBn?: string;
  slug?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
  isActive: boolean;
  isIndexed: boolean;
  lastIndexedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Get all SEO data
export async function getAllSeo(): Promise<SeoResponse[]> {
  try {
    const seo = await Seo.find({}).sort({ createdAt: -1 }).lean();
    return replaceMongoIdInArray(seo) as SeoResponse[];
  } catch (error) {
    console.error("Error getting all SEO:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get all SEO");
  }
}

// Get active SEO data
export async function getSeo(): Promise<SeoResponse[]> {
  try {
    const seo = await Seo.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return replaceMongoIdInArray(seo) as SeoResponse[];
  } catch (error) {
    console.error("Error getting SEO:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO");
  }
}

// Get SEO by ID
export async function getSeoDetails(seoId: string): Promise<SeoResponse | null> {
  try {
    if (!Types.ObjectId.isValid(seoId)) return null;
    const seo = await Seo.findById(seoId).lean();
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error getting SEO details:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO details");
  }
}

// Get SEO by Product ID
export async function getSeoByProductId(productId: string): Promise<SeoResponse | null> {
  try {
    if (!productId) return null;
    const seo = await Seo.findOne({ productId, pageType: "product" }).lean();
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error getting SEO by product ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO by product ID");
  }
}

// Get SEO by Page ID (for custom pages like about, contact, etc.)
export async function getSeoByPageId(pageId: string): Promise<SeoResponse | null> {
  try {
    if (!pageId) return null;
    const seo = await Seo.findOne({ pageId, pageType: "page" }).lean();
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error getting SEO by page ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO by page ID");
  }
}

// Get SEO by Category ID
export async function getSeoByCategoryId(categoryId: string): Promise<SeoResponse | null> {
  try {
    if (!categoryId) return null;
    const seo = await Seo.findOne({ categoryId, pageType: "category" }).lean();
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error getting SEO by category ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO by category ID");
  }
}

// Get SEO by Brand ID
export async function getSeoByBrandId(brandId: string): Promise<SeoResponse | null> {
  try {
    if (!brandId) return null;
    const seo = await Seo.findOne({ brandId, pageType: "brand" }).lean();
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error getting SEO by brand ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO by brand ID");
  }
}

// Get SEO by Slug
export async function getSeoBySlug(slug: string): Promise<SeoResponse | null> {
  try {
    if (!slug) return null;
    const seo = await Seo.findOne({ slug, isActive: true }).lean();
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error getting SEO by slug:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO by slug");
  }
}

// Create or Update SEO (Upsert)
export async function createOrUpdateSeoQuery(seoData: SeoData): Promise<SeoResponse> {
  try {
    // Build query based on what ID is provided
    let query: any = { pageType: seoData.pageType || "page" };
    
    if (seoData.productId) {
      query.productId = seoData.productId;
    } else if (seoData.pageId) {
      query.pageId = seoData.pageId;
    } else if (seoData.categoryId) {
      query.categoryId = seoData.categoryId;
    } else if (seoData.brandId) {
      query.brandId = seoData.brandId;
    } else {
      throw new Error("At least one identifier (productId, pageId, categoryId, or brandId) is required");
    }
    
    const updateData = {
      ...seoData,
      seoTags: seoData.seoTags || [],
      seoTagsBn: seoData.seoTagsBn || [],
      secondaryKeywords: seoData.secondaryKeywords || [],
      secondaryKeywordsBn: seoData.secondaryKeywordsBn || [],
      robotsMeta: seoData.robotsMeta || "index,follow",
      isActive: seoData.isActive !== undefined ? seoData.isActive : true,
      updatedAt: new Date(),
    };
    
    const seo = await Seo.findOneAndUpdate(
      query,
      { $set: updateData },
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ).lean();
    
    return replaceMongoIdInObject(seo) as SeoResponse;
  } catch (error) {
    console.error("Error creating/updating SEO:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create/update SEO");
  }
}

// Create SEO
export async function createSeoQuery(seoData: SeoData): Promise<SeoResponse> {
  try {
    // Check if SEO already exists
    let query: any = { pageType: seoData.pageType || "page" };
    if (seoData.productId) query.productId = seoData.productId;
    else if (seoData.pageId) query.pageId = seoData.pageId;
    else if (seoData.categoryId) query.categoryId = seoData.categoryId;
    else if (seoData.brandId) query.brandId = seoData.brandId;
    
    const existingSeo = await Seo.findOne(query);
    if (existingSeo) {
      throw new Error("SEO data already exists for this item");
    }
    
    const seo = await Seo.create({
      ...seoData,
      seoTags: seoData.seoTags || [],
      seoTagsBn: seoData.seoTagsBn || [],
      secondaryKeywords: seoData.secondaryKeywords || [],
      secondaryKeywordsBn: seoData.secondaryKeywordsBn || [],
      robotsMeta: seoData.robotsMeta || "index,follow",
      pageType: seoData.pageType || "page",
      isActive: seoData.isActive !== undefined ? seoData.isActive : true,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      avgPosition: 0,
      isIndexed: false,
    });
    
    return JSON.parse(JSON.stringify(seo)) as SeoResponse;
  } catch (error) {
    console.error("Error creating SEO:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create SEO");
  }
}

// Update SEO by ID
export async function updateSeoQuery(seoId: string, seoData: Partial<SeoData>): Promise<SeoResponse | null> {
  try {
    if (!Types.ObjectId.isValid(seoId)) return null;
    
    const seo = await Seo.findByIdAndUpdate(
      seoId,
      { ...seoData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error updating SEO:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update SEO");
  }
}

// Update SEO by Product ID
export async function updateSeoByProductIdQuery(productId: string, seoData: Partial<SeoData>): Promise<SeoResponse | null> {
  try {
    if (!productId) return null;
    
    const seo = await Seo.findOneAndUpdate(
      { productId, pageType: "product" },
      { ...seoData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error updating SEO by product ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update SEO by product ID");
  }
}

// Update SEO by Page ID
export async function updateSeoByPageIdQuery(pageId: string, seoData: Partial<SeoData>): Promise<SeoResponse | null> {
  try {
    if (!pageId) return null;
    
    const seo = await Seo.findOneAndUpdate(
      { pageId, pageType: "page" },
      { ...seoData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error updating SEO by page ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update SEO by page ID");
  }
}

// Delete SEO by ID
export async function deleteSeoQuery(seoId: string): Promise<boolean> {
  try {
    if (!Types.ObjectId.isValid(seoId)) return false;
    const result = await Seo.findByIdAndDelete(seoId);
    return !!result;
  } catch (error) {
    console.error("Error deleting SEO:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete SEO");
  }
}

// Delete SEO by Product ID
export async function deleteSeoByProductIdQuery(productId: string): Promise<boolean> {
  try {
    if (!productId) return false;
    const result = await Seo.findOneAndDelete({ productId, pageType: "product" });
    return !!result;
  } catch (error) {
    console.error("Error deleting SEO by product ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete SEO by product ID");
  }
}

// Delete SEO by Page ID
export async function deleteSeoByPageIdQuery(pageId: string): Promise<boolean> {
  try {
    if (!pageId) return false;
    const result = await Seo.findOneAndDelete({ pageId, pageType: "page" });
    return !!result;
  } catch (error) {
    console.error("Error deleting SEO by page ID:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete SEO by page ID");
  }
}

// Get SEO by page type
export async function getSeoByPageType(pageType: string, limit: number | null = null): Promise<SeoResponse[]> {
  try {
    const query = Seo.find({ pageType, isActive: true }).sort({ createdAt: -1 });
    if (limit) {
      query.limit(limit);
    }
    const seo = await query.lean();
    return replaceMongoIdInArray(seo) as SeoResponse[];
  } catch (error) {
    console.error("Error getting SEO by page type:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO by page type");
  }
}

// Toggle SEO status
export async function toggleSeoStatusQuery(seoId: string, isActive: boolean): Promise<SeoResponse | null> {
  try {
    if (!Types.ObjectId.isValid(seoId)) return null;
    
    const seo = await Seo.findByIdAndUpdate(
      seoId,
      { isActive, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    return replaceMongoIdInObject(seo) as SeoResponse | null;
  } catch (error) {
    console.error("Error toggling SEO status:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to toggle SEO status");
  }
}

// Get SEO with pagination
export async function getSeoPaginated(
  page: number = 1,
  limit: number = 10,
  filter?: { pageType?: string; isActive?: boolean; search?: string }
): Promise<{ seos: SeoResponse[]; total: number; page: number; totalPages: number }> {
  try {
    const query: any = {};
    if (filter?.pageType) query.pageType = filter.pageType;
    if (filter?.isActive !== undefined) query.isActive = filter.isActive;
    
    if (filter?.search) {
      query.$or = [
        { seoTitle: { $regex: filter.search, $options: "i" } },
        { seoTitleBn: { $regex: filter.search, $options: "i" } },
        { primaryKeyword: { $regex: filter.search, $options: "i" } },
        { primaryKeywordBn: { $regex: filter.search, $options: "i" } },
        { seoTags: { $in: [new RegExp(filter.search, "i")] } },
        { seoTagsBn: { $in: [new RegExp(filter.search, "i")] } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [seos, total] = await Promise.all([
      Seo.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Seo.countDocuments(query),
    ]);
    
    return {
      seos: replaceMongoIdInArray(seos) as SeoResponse[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error getting paginated SEO:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get paginated SEO");
  }
}

// Get SEO statistics
export async function getSeoStatisticsQuery(): Promise<{
  total: number;
  active: number;
  indexed: number;
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  byPageType: Record<string, number>;
}> {
  try {
    const [total, active, indexed, analytics, byPageType] = await Promise.all([
      Seo.countDocuments(),
      Seo.countDocuments({ isActive: true }),
      Seo.countDocuments({ isIndexed: true }),
      Seo.aggregate([
        {
          $group: {
            _id: null,
            totalClicks: { $sum: "$clicks" },
            totalImpressions: { $sum: "$impressions" },
            avgCtr: { $avg: "$ctr" }
          }
        }
      ]),
      Seo.aggregate([
        {
          $group: {
            _id: "$pageType",
            count: { $sum: 1 }
          }
        }
      ])
    ]);
    
    const pageTypeMap: Record<string, number> = {};
    byPageType.forEach((item: any) => {
      pageTypeMap[item._id] = item.count;
    });
    
    return {
      total,
      active,
      indexed,
      totalClicks: analytics[0]?.totalClicks || 0,
      totalImpressions: analytics[0]?.totalImpressions || 0,
      avgCtr: analytics[0]?.avgCtr || 0,
      byPageType: pageTypeMap,
    };
  } catch (error) {
    console.error("Error getting SEO statistics:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get SEO statistics");
  }
}

// Export all functions as default object
export default {
  getAllSeo,
  getSeo,
  getSeoDetails,
  getSeoByProductId,
  getSeoByPageId,
  getSeoByCategoryId,
  getSeoByBrandId,
  getSeoBySlug,
  createOrUpdateSeoQuery,
  createSeoQuery,
  updateSeoQuery,
  updateSeoByProductIdQuery,
  updateSeoByPageIdQuery,
  deleteSeoQuery,
  deleteSeoByProductIdQuery,
  deleteSeoByPageIdQuery,
  getSeoByPageType,
  toggleSeoStatusQuery,
  getSeoPaginated,
  getSeoStatisticsQuery,
};