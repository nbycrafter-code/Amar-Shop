// app/queries/colors.ts
import { Color } from "@/model/color-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";

// Types
export interface ColorData {
  _id?: string;
  name: string;
  nameBn: string;
  hex: string;
  slug?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ColorResponse {
  _id: string;
  name: string;
  nameBn: string;
  hex: string;
  slug: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Get all colors
export async function getAllColors(): Promise<ColorResponse[]> {
  const colors = await Color.find({}).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(colors) as ColorResponse[];
}

// Get active colors only
export async function getColors(): Promise<ColorResponse[]> {
  const colors = await Color.find({ active: true }).sort({ name: 1 }).lean();
  return replaceMongoIdInArray(colors) as ColorResponse[];
}

// Get color details by ID
export async function getColorDetails(colorId: string): Promise<ColorResponse | null> {
  try {
    const color = await Color.findById(colorId).lean();
    return replaceMongoIdInObject(color) as ColorResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get color details");
  }
}

// Get color by slug
export async function getColorBySlug(slug: string): Promise<ColorResponse | null> {
  try {
    const color = await Color.findOne({ slug }).lean();
    return replaceMongoIdInObject(color) as ColorResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get color by slug");
  }
}

// Get color by hex code
export async function getColorByHex(hex: string): Promise<ColorResponse | null> {
  try {
    const color = await Color.findOne({ hex: hex.toUpperCase() }).lean();
    return replaceMongoIdInObject(color) as ColorResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get color by hex");
  }
}

// Create new color
export async function createColorQuery(colorData: ColorData): Promise<ColorResponse> {
  try {
    const color = await Color.create(colorData);
    return JSON.parse(JSON.stringify(color)) as ColorResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create color");
  }
}

// Update color
export async function updateColorQuery(colorId: string, colorData: Partial<ColorData>): Promise<ColorResponse | null> {
  try {
    const color = await Color.findByIdAndUpdate(
      colorId,
      { ...colorData, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(color) as ColorResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update color");
  }
}

// Delete color
export async function deleteColorQuery(colorId: string): Promise<boolean> {
  try {
    const result = await Color.findByIdAndDelete(colorId);
    return !!result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete color");
  }
}

// Get colors by page name
export async function getPageShowColors(pageName: string, limit: number | null = null): Promise<ColorResponse[]> {
  try {
    const query = Color.find({ page_set: pageName, active: true });
    if (limit) {
      query.limit(limit);
    }
    const colors = await query.lean();
    return replaceMongoIdInArray(colors) as ColorResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get page colors");
  }
}

// Get colors by names
export async function getColorsByNames(colorNames: string[]): Promise<ColorResponse[]> {
  try {
    const colors = await Color.find({ 
      name: { $in: colorNames },
      active: true 
    }).lean();
    return replaceMongoIdInArray(colors) as ColorResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get colors by names");
  }
}

// Toggle color status (active/inactive)
export async function toggleColorStatusQuery(colorId: string, active: boolean): Promise<ColorResponse | null> {
  try {
    const color = await Color.findByIdAndUpdate(
      colorId,
      { active, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(color) as ColorResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to toggle color status");
  }
}

// Bulk delete colors
export async function bulkDeleteColorsQuery(colorIds: string[]): Promise<{ deletedCount: number }> {
  try {
    const result = await Color.deleteMany({ _id: { $in: colorIds } });
    return { deletedCount: result.deletedCount };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to bulk delete colors");
  }
}

// Bulk update color status
export async function bulkUpdateColorStatusQuery(colorIds: string[], active: boolean): Promise<{ modifiedCount: number }> {
  try {
    const result = await Color.updateMany(
      { _id: { $in: colorIds } },
      { active, updated_at: new Date() }
    );
    return { modifiedCount: result.modifiedCount };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to bulk update color status");
  }
}

// Get colors by IDs
export async function getColorsByIds(colorIds: string[]): Promise<ColorResponse[]> {
  try {
    const colors = await Color.find({ 
      _id: { $in: colorIds },
      active: true 
    }).lean();
    return replaceMongoIdInArray(colors) as ColorResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get colors by IDs");
  }
}

// Get color count
export async function getColorsCount(activeOnly: boolean = false): Promise<number> {
  try {
    const filter = activeOnly ? { active: true } : {};
    return await Color.countDocuments(filter);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get colors count");
  }
}

// Search colors by name
export async function searchColors(query: string): Promise<ColorResponse[]> {
  try {
    const colors = await Color.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { nameBn: { $regex: query, $options: 'i' } }
      ],
      active: true
    }).limit(20).lean();
    return replaceMongoIdInArray(colors) as ColorResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to search colors");
  }
}