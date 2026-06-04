// app/queries/brands.ts
import { Brand } from "@/models/brand-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";

// Types
export interface BrandData {
  _id?: string;
  name: string;
  nameBn: string;
  country: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  slug?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface BrandResponse {
  _id: string;
  name: string;
  nameBn: string;
  country: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  slug: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Get all brands
export async function getAllBrands(): Promise<BrandResponse[]> {
  const brands = await Brand.find({}).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(brands) as BrandResponse[];
}

// Get active brands only
export async function getBrands(): Promise<BrandResponse[]> {
  const brands = await Brand.find({ active: true }).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(brands) as BrandResponse[];
}

// Get brand details by ID
export async function getBrandDetails(brandId: string): Promise<BrandResponse | null> {
  try {
    const brand = await Brand.findById(brandId).lean();
    return replaceMongoIdInObject(brand) as BrandResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get brand details");
  }
}

// Get brand by slug
export async function getBrandBySlug(slug: string): Promise<BrandResponse | null> {
  try {
    const brand = await Brand.findOne({ slug }).lean();
    return replaceMongoIdInObject(brand) as BrandResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get brand by slug");
  }
}

// Create new brand
export async function createBrandQuery(brandData: BrandData): Promise<BrandResponse> {
  try {
    const brand = await Brand.create(brandData);
    const brandObj = brand.toObject();
    return replaceMongoIdInObject(brandObj) as BrandResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create brand");
  }
}

// Update brand
export async function updateBrandQuery(brandId: string, brandData: Partial<BrandData>): Promise<BrandResponse | null> {
  try {
    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { ...brandData, updated_at: new Date() },
      { new: true, runValidators: true }
    ).lean();
    return replaceMongoIdInObject(brand) as BrandResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update brand");
  }
}

// Delete brand
export async function deleteBrandQuery(brandId: string): Promise<boolean> {
  try {
    const result = await Brand.findByIdAndDelete(brandId);
    return !!result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete brand");
  }
}

// Toggle brand status
export async function toggleBrandStatusQuery(brandId: string, active: boolean): Promise<BrandResponse | null> {
  try {
    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { active, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(brand) as BrandResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to toggle brand status");
  }
}

// Get brands by names
export async function getBrandsByNames(brandNames: string[]): Promise<BrandResponse[]> {
  try {
    const brands = await Brand.find({ 
      name: { $in: brandNames },
      active: true 
    }).lean();
    return replaceMongoIdInArray(brands) as BrandResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get brands by names");
  }
}

// Search brands
export async function searchBrands(query: string): Promise<BrandResponse[]> {
  try {
    const brands = await Brand.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { nameBn: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } }
      ],
      active: true
    }).limit(20).lean();
    return replaceMongoIdInArray(brands) as BrandResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to search brands");
  }
}