// app/api/subcategory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubCategory } from "@/models/subcategory-model";
import { Category } from "@/models/category-model";
import { getSlug } from "@/lib/convertData";
import { 
  getSubCategories,
  getSubCategoryById,
  createSubCategoryQuery,
  updateSubCategoryQuery,
  deleteSubCategoryQuery,
  toggleSubCategoryStatusQuery,
  getSubCategoriesByCategory
} from "@/queries/subcategories";
import fs from "fs";
import path from "path";

// Helper to save image
async function saveImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `subcategory-${timestamp}-${randomString}.${ext}`;
  
  const uploadDir = path.join(process.cwd(), "public/assets/uploads/subcategories/");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/assets/uploads/subcategories/${filename}`;
}

// GET: Fetch subcategories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const active = searchParams.get('active');
    
    if (id) {
      const subCategory = await getSubCategoryById(id);
      if (!subCategory) {
        return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: subCategory });
    }
    
    if (categoryId) {
      const subCategories = await getSubCategoriesByCategory(categoryId);
      return NextResponse.json({ success: true, data: subCategories });
    }
    
    let query = {};
    if (active === 'true') {
      query = { active: true };
    }
    const subCategories = await getSubCategories(query);
    return NextResponse.json({ success: true, data: subCategories });
    
  } catch (error) {
    console.error("❌ Error in GET /api/subcategory:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}

// POST: Create subcategory
export async function POST(request: NextRequest) {
  try {
    let name, nameBn, categoryId, icon, iconColor, iconBgColor, image, imageBgColor;
    
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      categoryId = formData.get("categoryId") as string;
      const imageFile = formData.get("image") as File;
      imageBgColor = formData.get("imageBgColor") as string || "#F8FAFC";
      
      if (!categoryId) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
      }
      
      const imageUrl = await saveImage(imageFile);
      image = imageUrl;
    } else {
      const body = await request.json();
      name = body.name;
      nameBn = body.nameBn;
      categoryId = body.categoryId;
      icon = body.icon || "Folder";
      iconColor = body.iconColor || "#3B82F6";
      iconBgColor = body.iconBgColor || "#EFF6FF";
      image = "";
      imageBgColor = "";
    }
    
    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Subcategory name (English) is required" }, { status: 400 });
    }
    if (!nameBn?.trim()) {
      return NextResponse.json({ error: "Subcategory name (Bangla) is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }
    
    // Check if category exists
    const category = await Category.findById(categoryId).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    // Check if subcategory already exists
    const existingSubCategory = await SubCategory.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      categoryId: categoryId
    }).lean();
    
    if (existingSubCategory) {
      return NextResponse.json({ error: "Subcategory with this name already exists in this category" }, { status: 409 });
    }
    
    const slug = getSlug(name.trim());
    
    const subCategoryData = {
      name: name.trim(),
      nameBn: nameBn.trim(),
      categoryId,
      slug,
      icon,
      iconColor,
      iconBgColor,
      image,
      imageBgColor,
      active: true,
    };
    
    const newSubCategory = await createSubCategoryQuery(subCategoryData);
    
    return NextResponse.json({
      success: true,
      message: "Subcategory created successfully!",
      data: newSubCategory,
    });
    
  } catch (error) {
    console.error("❌ Error in POST /api/subcategory:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create subcategory" },
      { status: 500 }
    );
  }
}

// PUT: Update subcategory
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, nameBn, categoryId, icon, iconColor, iconBgColor, image, imageBgColor, active } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Subcategory ID is required" }, { status: 400 });
    }
    
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (nameBn) updateData.nameBn = nameBn.trim();
    if (categoryId) updateData.categoryId = categoryId;
    if (icon) updateData.icon = icon;
    if (iconColor) updateData.iconColor = iconColor;
    if (iconBgColor) updateData.iconBgColor = iconBgColor;
    if (image) updateData.image = image;
    if (imageBgColor) updateData.imageBgColor = imageBgColor;
    if (active !== undefined) updateData.active = active;
    
    if (name) updateData.slug = getSlug(name.trim());
    
    const updated = await updateSubCategoryQuery(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Subcategory updated successfully!",
      data: updated,
    });
    
  } catch (error) {
    console.error("❌ Error in PUT /api/subcategory:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

// DELETE: Delete subcategory
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Subcategory ID is required" }, { status: 400 });
    }
    
    const deleted = await deleteSubCategoryQuery(id);
    if (!deleted) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Subcategory deleted successfully",
    });
    
  } catch (error) {
    console.error("❌ Error in DELETE /api/subcategory:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}

// PATCH: Toggle subcategory status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Subcategory ID is required" }, { status: 400 });
    }
    
    const updated = await toggleSubCategoryStatusQuery(id, active !== undefined ? active : false);
    if (!updated) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Subcategory status updated successfully",
      active: updated.active,
    });
    
  } catch (error) {
    console.error("❌ Error in PATCH /api/subcategory:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update subcategory status" },
      { status: 500 }
    );
  }
}