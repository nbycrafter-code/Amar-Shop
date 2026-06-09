// app/queries/categories.ts
import { Category } from "@/models/category-model";
import { SubCategory } from "@/models/subcategory-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";

// Types
export interface CategoryData {
  _id?: string;
  name: string;
  nameBn: string;
  description?: string;
  descriptionBn?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  bannerImage?: string;
  slug?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  nameBn: string;
  description?: string;
  descriptionBn?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  bannerImage?: string;
  slug: string;
  active: boolean;
  itemCount?: number;
  subCategoriesCount?: number;
  created_at: Date;
  updated_at: Date;
}

// Helper function to add item count to single category
async function addItemCountToCategory(category: any): Promise<any> {
  if (!category) return null;
  const itemCount = await Category.aggregate([
    { $match: { _id: category._id } },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: { products: 0 }
    }
  ]);
  return {
    ...category,
    itemCount: itemCount[0]?.itemCount || 0
  };
}

// Get all categories with item count
export async function getAllCategories(): Promise<CategoryResponse[]> {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        products: 0
      }
    },
    {
      $sort: { created_at: -1 }
    }
  ]);
  
  return replaceMongoIdInArray(categories) as CategoryResponse[];
}

// Get active categories only (without item count - for performance)
export async function getCategories(): Promise<CategoryResponse[]> {
  const categories = await Category.find({ active: true }).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(categories) as CategoryResponse[];
}

// Get active categories with item count (for frontend)
export async function getCategoriesWithItemCount(): Promise<CategoryResponse[]> {
  const categories = await Category.aggregate([
    { $match: { active: true } },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "products"
      }
    },
    {
      $addFields: {
        itemCount: { $size: "$products" }
      }
    },
    {
      $project: {
        products: 0
      }
    },
    {
      $sort: { name: 1 }
    }
  ]);
  
  return replaceMongoIdInArray(categories) as CategoryResponse[];
}

// Get category details by ID with item count
export async function getCategoryDetails(categoryId: string): Promise<CategoryResponse | null> {
  try {
    const category = await Category.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products"
        }
      },
      {
        $addFields: {
          itemCount: { $size: "$products" }
        }
      },
      {
        $project: {
          products: 0
        }
      }
    ]);
    
    if (!category || category.length === 0) return null;
    return replaceMongoIdInObject(category[0]) as CategoryResponse | null;
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
    const categoryObj = category.toObject();
    return replaceMongoIdInObject(categoryObj) as CategoryResponse;
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
      { new: true, runValidators: true }
    ).lean();
    return replaceMongoIdInObject(category) as CategoryResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update category");
  }
}

// Delete category
export async function deleteCategoryQuery(categoryId: string): Promise<boolean> {
  try {
    // First, check if category has any subcategories
    const subCategoriesCount = await SubCategory.countDocuments({ categoryId });
    if (subCategoriesCount > 0) {
      throw new Error("Cannot delete category with existing subcategories. Please delete subcategories first.");
    }
    
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

// Get categories with subcategories (for frontend navbar)
export async function getCategoriesWithSubCategory() {
  try {
    const categories = await Category.aggregate([
      {
        $match: { active: true }
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "categoryId",
          as: "subCategories",
          pipeline: [
            {
              $match: { active: true }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                nameBn: 1,
                slug: 1,
                icon: 1,
                iconColor: 1,
                iconBgColor: 1,
                image: 1
              }
            },
            {
              $sort: { name: 1 }
            }
          ]
        }
      },
      {
        $addFields: {
          subCategoriesCount: { $size: "$subCategories" }
        }
      },
      {
        $project: {
          __v: 0
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);
    
    return replaceMongoIdInArray(categories);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get categories with subcategories");
  }
}

// Get single category with its subcategories
export async function getCategoryWithSubCategories(categoryId: string) {
  try {
    const category = await Category.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(categoryId), active: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "categoryId",
          as: "subCategories",
          pipeline: [
            {
              $match: { active: true }
            },
            {
              $sort: { name: 1 }
            }
          ]
        }
      },
      {
        $addFields: {
          subCategoriesCount: { $size: "$subCategories" }
        }
      }
    ]);
    
    if (!category || category.length === 0) return null;
    return replaceMongoIdInObject(category[0]);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get category with subcategories");
  }
}