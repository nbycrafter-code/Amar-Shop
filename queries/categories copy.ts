// app/queries/categories.ts
import { Category } from "@/model/category-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";

// Types
export interface CategoryData {
  _id?: string;
  name: string;
  nameBn: string;
  icon?: string;
  image?: string;
  slug?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  nameBn: string;
  icon: string;
  image?: string;
  slug: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Get all categories
export async function getAllCategories(): Promise<CategoryResponse[]> {
  const categories = await Category.find({}).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(categories) as CategoryResponse[];
}

// Get active categories only
export async function getCategories(): Promise<CategoryResponse[]> {
  const categories = await Category.find({ active: true }).sort({ name: 1 }).lean();
  return replaceMongoIdInArray(categories) as CategoryResponse[];
}

// Get category details by ID
export async function getCategoryDetails(categoryId: string): Promise<CategoryResponse | null> {
  try {
    const category = await Category.findById(categoryId).lean();
    return replaceMongoIdInObject(category) as CategoryResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get category details");
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<CategoryResponse | null> {
  try {
    const category = await Category.findOne({ slug }).lean();
    return replaceMongoIdInObject(category) as CategoryResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get category by slug");
  }
}

// Create new category
export async function createCategoryQuery(categoryData: CategoryData): Promise<CategoryResponse> {
  try {
    const category = await Category.create(categoryData);
    return JSON.parse(JSON.stringify(category)) as CategoryResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create category");
  }
}

// Update category
export async function updateCategoryQuery(categoryId: string, categoryData: Partial<CategoryData>): Promise<CategoryResponse | null> {
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { ...categoryData, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(category) as CategoryResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update category");
  }
}

// Delete category
export async function deleteCategoryQuery(categoryId: string): Promise<boolean> {
  try {
    const result = await Category.findByIdAndDelete(categoryId);
    return !!result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete category");
  }
}

// Toggle category status
export async function toggleCategoryStatusQuery(categoryId: string, active: boolean): Promise<CategoryResponse | null> {
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { active, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(category) as CategoryResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to toggle category status");
  }
}



















// // queries/categories.ts অথবা যেখানে ফাংশনটি আছে

// export async function getAllCategories(): Promise<CategoryResponse[]> {
//   const categories = await Category.aggregate([
//     {
//       $match: {} // সব ক্যাটাগরি
//     },
//     {
//       $lookup: {
//         from: "products", // আপনার products collection এর নাম
//         localField: "_id",
//         foreignField: "categoryId", // product এ categoryId ফিল্ডের নাম
//         as: "products"
//       }
//     },
//     {
//       $addFields: {
//         itemCount: { $size: "$products" }
//       }
//     },
//     {
//       $project: {
//         products: 0 // products array বাদ দিন
//       }
//     },
//     {
//       $sort: { created_at: -1 }
//     }
//   ]);
  
//   return replaceMongoIdInArray(categories) as CategoryResponse[];
// }

// // অথবা, যদি শুধু active ক্যাটাগরি চান:
// export async function getActiveCategoriesWithCount(): Promise<CategoryResponse[]> {
//   const categories = await Category.aggregate([
//     {
//       $match: { active: true } // শুধু active ক্যাটাগরি
//     },
//     {
//       $lookup: {
//         from: "products",
//         localField: "_id",
//         foreignField: "categoryId",
//         as: "products"
//       }
//     },
//     {
//       $addFields: {
//         itemCount: { $size: "$products" }
//       }
//     },
//     {
//       $project: {
//         products: 0
//       }
//     },
//     {
//       $sort: { created_at: -1 }
//     }
//   ]);
  
//   return replaceMongoIdInArray(categories) as CategoryResponse[];
// }

// // একক ক্যাটাগরির জন্য আইটেম কাউন্ট সহ
// export async function getCategoryWithCount(id: string): Promise<CategoryResponse | null> {
//   const categories = await Category.aggregate([
//     {
//       $match: { _id: new mongoose.Types.ObjectId(id) }
//     },
//     {
//       $lookup: {
//         from: "products",
//         localField: "_id",
//         foreignField: "categoryId",
//         as: "products"
//       }
//     },
//     {
//       $addFields: {
//         itemCount: { $size: "$products" }
//       }
//     },
//     {
//       $project: {
//         products: 0
//       }
//     }
//   ]);
  
//   if (categories.length === 0) return null;
//   return replaceMongoIdInObject(categories[0]) as CategoryResponse;
// }