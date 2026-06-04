// app/queries/subcategories.ts
import { SubCategory, ISubCategory } from "@/models/subcategory-model";
import { Category } from "@/models/category-model";
import { getSlug } from "@/lib/convertData";
import mongoose from "mongoose";

export interface SubCategoryData {
  name: string;
  nameBn: string;
  categoryId: string;
  slug: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
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
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Helper to populate subcategory with category info
async function populateSubCategory(subCategory: any): Promise<SubCategoryResponse | null> {
  if (!subCategory) return null;
  
  const subCategoryObj = subCategory.toObject ? subCategory.toObject() : subCategory;
  
  let categoryName = '', categoryNameBn = '';
  if (subCategoryObj.categoryId) {
    const category = await Category.findById(subCategoryObj.categoryId).lean();
    if (category) {
      categoryName = category.name;
      categoryNameBn = category.nameBn;
    }
  }
  
  return {
    ...subCategoryObj,
    _id: subCategoryObj._id.toString(),
    categoryId: subCategoryObj.categoryId?.toString(),
    categoryName,
    categoryNameBn,
  };
}

// Get all subcategories
export async function getSubCategories(filter: any = {}): Promise<SubCategoryResponse[]> {
  const subCategories = await SubCategory.find(filter).sort({ name: 1 }).lean();
  const populated = await Promise.all(subCategories.map(sc => populateSubCategory(sc)));
  return populated.filter(sc => sc !== null) as SubCategoryResponse[];
}

// Get subcategories by category
export async function getSubCategoriesByCategory(categoryId: string): Promise<SubCategoryResponse[]> {
  const subCategories = await SubCategory.find({ 
    categoryId: new mongoose.Types.ObjectId(categoryId),
    active: true 
  }).sort({ name: 1 }).lean();
  const populated = await Promise.all(subCategories.map(sc => populateSubCategory(sc)));
  return populated.filter(sc => sc !== null) as SubCategoryResponse[];
}

// Get single subcategory by ID
export async function getSubCategoryById(id: string): Promise<SubCategoryResponse | null> {
  const subCategory = await SubCategory.findById(id).lean();
  if (!subCategory) return null;
  return await populateSubCategory(subCategory);
}

// Get single subcategory by slug
export async function getSubCategoryBySlug(slug: string): Promise<SubCategoryResponse | null> {
  const subCategory = await SubCategory.findOne({ slug }).lean();
  if (!subCategory) return null;
  return await populateSubCategory(subCategory);
}

// Create subcategory
export async function createSubCategoryQuery(data: SubCategoryData): Promise<SubCategoryResponse> {
  const subCategory = await SubCategory.create({
    ...data,
    categoryId: new mongoose.Types.ObjectId(data.categoryId),
  });
  const populated = await populateSubCategory(subCategory);
  return populated!;
}

// Update subcategory
export async function updateSubCategoryQuery(id: string, data: Partial<SubCategoryData>): Promise<SubCategoryResponse | null> {
  const updateData: any = { ...data, updated_at: new Date() };
  
  if (data.categoryId) {
    updateData.categoryId = new mongoose.Types.ObjectId(data.categoryId);
  }
  
  const subCategory = await SubCategory.findByIdAndUpdate(id, updateData, { new: true }).lean();
  if (!subCategory) return null;
  return await populateSubCategory(subCategory);
}

// Delete subcategory
export async function deleteSubCategoryQuery(id: string): Promise<boolean> {
  const result = await SubCategory.findByIdAndDelete(id);
  return !!result;
}

// Toggle subcategory status
export async function toggleSubCategoryStatusQuery(id: string, active: boolean): Promise<SubCategoryResponse | null> {
  const subCategory = await SubCategory.findByIdAndUpdate(
    id,
    { active, updated_at: new Date() },
    { new: true }
  ).lean();
  if (!subCategory) return null;
  return await populateSubCategory(subCategory);
}