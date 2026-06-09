// app/queries/subcategories.ts
import { SubCategory, ISubCategory } from "@/models/subcategory-model";
import { Category } from "@/models/category-model";
import { getSlug } from "@/lib/convertData";
import mongoose from "mongoose";
import { Product } from "@/models/product-model";

export interface SubCategoryData {
  name: string;
  nameBn: string;
  categoryId: string;
  slug?: string;
  description?: string;
  descriptionBn?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  bannerImage?: string;
  active?: boolean;
}

export interface SubCategoryResponse {
  _id: string;
  name: string;
  nameBn: string;
  categoryId: string;
  categoryName: string;
  categoryNameBn: string;
  slug: string;
  description?: string;
  descriptionBn?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  bannerImage?: string;
  active: boolean;
  itemCount?: number;
  created_at: Date;
  updated_at: Date;
}

// Helper to populate subcategory with category info and item count (Optimized with aggregation)
async function populateSubCategory(subCategory: any): Promise<SubCategoryResponse | null> {
  if (!subCategory) return null;

  const subCategoryObj = subCategory.toObject ? subCategory.toObject() : subCategory;
  const subCategoryId = subCategoryObj._id;

  // Use aggregation for better performance
  const result = await SubCategory.aggregate([
    { $match: { _id: subCategoryId } },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "subCategoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
        categoryNameBn: { $arrayElemAt: ["$categoryInfo.nameBn", 0] },
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        categoryInfo: 0,
        products: 0
      }
    }
  ]);

  if (!result || result.length === 0) return null;

  const populated = result[0];
  
  return {
    ...populated,
    _id: populated._id.toString(),
    categoryId: populated.categoryId?.toString(),
    itemCount: populated.itemCount || 0,
  } as SubCategoryResponse;
}

// Get all subcategories (with optional filter)
export async function getSubCategories(filter: any = {}): Promise<SubCategoryResponse[]> {
  const subCategories = await SubCategory.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "subCategoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
        categoryNameBn: { $arrayElemAt: ["$categoryInfo.nameBn", 0] },
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        categoryInfo: 0,
        products: 0
      }
    },
    { $sort: { name: 1 } }
  ]);

  return subCategories.map(sub => ({
    ...sub,
    _id: sub._id.toString(),
    categoryId: sub.categoryId?.toString(),
    itemCount: sub.itemCount || 0,
  })) as SubCategoryResponse[];
}

// Get active subcategories only
export async function getActiveSubCategories(): Promise<SubCategoryResponse[]> {
  return getSubCategories({ active: true });
}

// Get subcategories by category (with item count)
export async function getSubCategoriesByCategory(categoryId: string): Promise<SubCategoryResponse[]> {
  const subCategories = await SubCategory.aggregate([
    { 
      $match: { 
        categoryId: new mongoose.Types.ObjectId(categoryId),
        active: true 
      } 
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "subCategoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
        categoryNameBn: { $arrayElemAt: ["$categoryInfo.nameBn", 0] },
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        categoryInfo: 0,
        products: 0
      }
    },
    { $sort: { name: 1 } }
  ]);

  return subCategories.map(sub => ({
    ...sub,
    _id: sub._id.toString(),
    categoryId: sub.categoryId?.toString(),
    itemCount: sub.itemCount || 0,
  })) as SubCategoryResponse[];
}

// Get single subcategory by ID (with item count)
export async function getSubCategoryById(id: string): Promise<SubCategoryResponse | null> {
  const result = await SubCategory.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "subCategoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
        categoryNameBn: { $arrayElemAt: ["$categoryInfo.nameBn", 0] },
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        categoryInfo: 0,
        products: 0
      }
    }
  ]);

  if (!result || result.length === 0) return null;

  return {
    ...result[0],
    _id: result[0]._id.toString(),
    categoryId: result[0].categoryId?.toString(),
    itemCount: result[0].itemCount || 0,
  } as SubCategoryResponse;
}

// Get single subcategory by slug
export async function getSubCategoryBySlug(slug: string): Promise<SubCategoryResponse | null> {
  const result = await SubCategory.aggregate([
    { $match: { slug } },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "subCategoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
        categoryNameBn: { $arrayElemAt: ["$categoryInfo.nameBn", 0] },
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        categoryInfo: 0,
        products: 0
      }
    }
  ]);

  if (!result || result.length === 0) return null;

  return {
    ...result[0],
    _id: result[0]._id.toString(),
    categoryId: result[0].categoryId?.toString(),
    itemCount: result[0].itemCount || 0,
  } as SubCategoryResponse;
}

// Create subcategory
export async function createSubCategoryQuery(data: SubCategoryData): Promise<SubCategoryResponse> {
  // Generate slug if not provided
  const slug = data.slug || getSlug(data.name);
  
  // Check if slug already exists
  const existingSlug = await SubCategory.findOne({ slug });
  if (existingSlug) {
    throw new Error("Subcategory with this name already exists");
  }
  
  // Check if category exists
  const categoryExists = await Category.findById(data.categoryId);
  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const subCategory = await SubCategory.create({
    ...data,
    slug,
    categoryId: new mongoose.Types.ObjectId(data.categoryId),
  });
  
  return (await getSubCategoryById(subCategory._id.toString()))!;
}

// Update subcategory
export async function updateSubCategoryQuery(id: string, data: Partial<SubCategoryData>): Promise<SubCategoryResponse | null> {
  const updateData: any = { ...data, updated_at: new Date() };

  // Generate new slug if name changed
  if (data.name) {
    updateData.slug = getSlug(data.name);
    
    // Check if new slug conflicts with another subcategory
    const existingSlug = await SubCategory.findOne({ 
      slug: updateData.slug, 
      _id: { $ne: new mongoose.Types.ObjectId(id) } 
    });
    if (existingSlug) {
      throw new Error("Subcategory with this name already exists");
    }
  }

  if (data.categoryId) {
    // Check if category exists
    const categoryExists = await Category.findById(data.categoryId);
    if (!categoryExists) {
      throw new Error("Category not found");
    }
    updateData.categoryId = new mongoose.Types.ObjectId(data.categoryId);
  }

  const subCategory = await SubCategory.findByIdAndUpdate(id, updateData, { new: true });
  if (!subCategory) return null;
  
  return await getSubCategoryById(subCategory._id.toString());
}

// Delete subcategory (with product check)
export async function deleteSubCategoryQuery(id: string): Promise<boolean> {
  // Check if subcategory has any products
  const productCount = await Product.countDocuments({ subCategoryId: new mongoose.Types.ObjectId(id) });
  
  if (productCount > 0) {
    throw new Error(`Cannot delete subcategory with ${productCount} associated products. Please delete or reassign products first.`);
  }
  
  const result = await SubCategory.findByIdAndDelete(id);
  return !!result;
}

// Toggle subcategory status
export async function toggleSubCategoryStatusQuery(id: string, active: boolean): Promise<SubCategoryResponse | null> {
  const subCategory = await SubCategory.findByIdAndUpdate(
    id,
    { active, updated_at: new Date() },
    { new: true }
  );
  if (!subCategory) return null;
  
  return await getSubCategoryById(subCategory._id.toString());
}

// Get subcategories with pagination
export async function getSubCategoriesPaginated(
  page: number = 1,
  limit: number = 10,
  filter: any = {}
): Promise<{ data: SubCategoryResponse[]; total: number; page: number; totalPages: number }> {
  const skip = (page - 1) * limit;
  
  const [subCategories, total] = await Promise.all([
    SubCategory.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "subCategoryId",
          as: "products"
        }
      },
      {
        $addFields: {
          categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
          categoryNameBn: { $arrayElemAt: ["$categoryInfo.nameBn", 0] },
          itemCount: { $size: "$products" }
        }
      },
      {
        $project: {
          categoryInfo: 0,
          products: 0
        }
      },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]),
    SubCategory.countDocuments(filter)
  ]);

  const data = subCategories.map(sub => ({
    ...sub,
    _id: sub._id.toString(),
    categoryId: sub.categoryId?.toString(),
    itemCount: sub.itemCount || 0,
  })) as SubCategoryResponse[];

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

// Search subcategories
export async function searchSubCategories(query: string): Promise<SubCategoryResponse[]> {
  const subCategories = await SubCategory.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { nameBn: { $regex: query, $options: 'i' } }
        ],
        active: true
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "subCategoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
        categoryNameBn: { $arrayElemAt: ["$categoryInfo.nameBn", 0] },
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        categoryInfo: 0,
        products: 0
      }
    },
    { $limit: 20 }
  ]);

  return subCategories.map(sub => ({
    ...sub,
    _id: sub._id.toString(),
    categoryId: sub.categoryId?.toString(),
    itemCount: sub.itemCount || 0,
  })) as SubCategoryResponse[];
}