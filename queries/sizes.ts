import { Size } from "@/model/size-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";

// Types
export interface SizeData {
  _id?: string;
  name: string;
  nameBn?: string;
  active?: boolean;
  page_set?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface SizeResponse {
  _id: string;
  name: string;
  nameBn?: string;
  active: boolean;
  page_set: string[];
  created_at: Date;
  updated_at: Date;
}

export async function getAllSizes(): Promise<SizeResponse[]> {
  const sizes = await Size.find({}).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(sizes) as SizeResponse[];
}

export async function getSizes(): Promise<SizeResponse[]> {
  const sizes = await Size.find({ active: true }).lean();
  return replaceMongoIdInArray(sizes) as SizeResponse[];
}

export async function getSizeDetails(sizeId: string): Promise<SizeResponse | null> {
  try {
    const size = await Size.findById(sizeId).lean();
    return replaceMongoIdInObject(size) as SizeResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get size details");
  }
}

export async function createSizeQuery(sizeData: SizeData): Promise<SizeResponse> {
  try {
    const size = await Size.create(sizeData);
    return JSON.parse(JSON.stringify(size)) as SizeResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create size");
  }
}

export async function updateSizeQuery(sizeId: string, sizeData: Partial<SizeData>): Promise<SizeResponse | null> {
  try {
    const size = await Size.findByIdAndUpdate(
      sizeId,
      { ...sizeData, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(size) as SizeResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update size");
  }
}

export async function deleteSizeQuery(sizeId: string): Promise<boolean> {
  try {
    const result = await Size.findByIdAndDelete(sizeId);
    return !!result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete size");
  }
}

export async function getPageShowSizes(pageName: string, limit: number | null = null): Promise<SizeResponse[]> {
  try {
    const query = Size.find({ page_set: pageName, active: true });
    if (limit) {
      query.limit(limit);
    }
    const sizes = await query.lean();
    return replaceMongoIdInArray(sizes) as SizeResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get page sizes");
  }
}

export async function getSizesByNames(sizeNames: string[]): Promise<SizeResponse[]> {
  try {
    const sizes = await Size.find({ 
      name: { $in: sizeNames },
      active: true 
    }).lean();
    return replaceMongoIdInArray(sizes) as SizeResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get sizes by names");
  }
}

export async function toggleSizeStatusQuery(sizeId: string, active: boolean): Promise<SizeResponse | null> {
  try {
    const size = await Size.findByIdAndUpdate(
      sizeId,
      { active, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(size) as SizeResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to toggle size status");
  }
}