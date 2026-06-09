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
async function saveImage(file: File, type: "subcategory" | "banner" = "subcategory"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${randomString}.${ext}`;
  
  let uploadDir: string;
  let urlPath: string;
  
  if (type === "banner") {
    uploadDir = path.join(process.cwd(), "public/uploads/categories/subcategories/banner");
    urlPath = `/uploads/categories/subcategories/banner/${filename}`;
  } else {
    uploadDir = path.join(process.cwd(), "public/uploads/categories/subcategories");
    urlPath = `/uploads/categories/subcategories/${filename}`;
  }
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return urlPath;
}

// Helper to delete image
async function deleteImage(imagePath: string | null | undefined) {
  if (imagePath && (imagePath.startsWith('/uploads/categories/subcategories/') || imagePath.startsWith('/uploads/'))) {
    const fullPath = path.join(process.cwd(), "public", imagePath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log("✅ Deleted image:", imagePath);
      } catch (deleteError) {
        console.error("⚠️ Error deleting image:", deleteError);
      }
    }
  }
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
    let name, nameBn, categoryId, description, descriptionBn, icon, iconColor, iconBgColor, image, imageBgColor, bannerImage;
    
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      categoryId = formData.get("categoryId") as string;
      description = formData.get("description") as string;
      descriptionBn = formData.get("descriptionBn") as string;
      const imageFile = formData.get("image") as File;
      const bannerFile = formData.get("bannerImage") as File;
      imageBgColor = formData.get("imageBgColor") as string || "#F8FAFC";
      
      if (!categoryId) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
      }
      
      // Validate category image if provided
      if (imageFile && imageFile.size > 0) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
        if (!validTypes.includes(imageFile.type)) {
          return NextResponse.json(
            { error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed" },
            { status: 400 }
          );
        }
        
        if (imageFile.size > 2 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Image file size must be less than 2MB" },
            { status: 400 }
          );
        }
        
        const imageUrl = await saveImage(imageFile, "subcategory");
        image = imageUrl;
      }
      
      // Save banner image if provided
      if (bannerFile && bannerFile.size > 0) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
        if (!validTypes.includes(bannerFile.type)) {
          return NextResponse.json(
            { error: "Invalid banner file type. Only JPEG, PNG, WEBP, and GIF are allowed" },
            { status: 400 }
          );
        }
        
        if (bannerFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Banner file size must be less than 5MB" },
            { status: 400 }
          );
        }
        
        bannerImage = await saveImage(bannerFile, "banner");
      }
    } else {
      const body = await request.json();
      name = body.name;
      nameBn = body.nameBn;
      categoryId = body.categoryId;
      description = body.description || "";
      descriptionBn = body.descriptionBn || "";
      icon = body.icon || "Folder";
      iconColor = body.iconColor || "#3B82F6";
      iconBgColor = body.iconBgColor || "#EFF6FF";
      image = "";
      imageBgColor = "";
      bannerImage = body.bannerImage || "";
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
      description: description && description.trim() ? description.trim() : "",
      descriptionBn: descriptionBn && descriptionBn.trim() ? descriptionBn.trim() : "",
      icon,
      iconColor,
      iconBgColor,
      image: image || "",
      imageBgColor: imageBgColor || "",
      bannerImage: bannerImage || "",
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
    let id, name, nameBn, categoryId, description, descriptionBn, icon, iconColor, iconBgColor, image, imageBgColor, bannerImage;
    
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = formData.get("id") as string;
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      categoryId = formData.get("categoryId") as string;
      description = formData.get("description") as string;
      descriptionBn = formData.get("descriptionBn") as string;
      const imageFile = formData.get("image") as File | null;
      const bannerFile = formData.get("bannerImage") as File | null;
      imageBgColor = formData.get("imageBgColor") as string;
      icon = formData.get("icon") as string;
      iconColor = formData.get("iconColor") as string;
      iconBgColor = formData.get("iconBgColor") as string;
      
      const existingSubCategory = await getSubCategoryById(id);
      
      // Handle subcategory image upload
      if (imageFile && imageFile.size > 0) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
        if (!validTypes.includes(imageFile.type)) {
          return NextResponse.json(
            { error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed" },
            { status: 400 }
          );
        }
        
        if (imageFile.size > 2 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Image file size must be less than 2MB" },
            { status: 400 }
          );
        }
        
        // Delete old image
        await deleteImage(existingSubCategory?.image);
        
        // Save new image
        image = await saveImage(imageFile, "subcategory");
      }
      
      // Handle banner image upload
      if (bannerFile && bannerFile.size > 0) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
        if (!validTypes.includes(bannerFile.type)) {
          return NextResponse.json(
            { error: "Invalid banner file type. Only JPEG, PNG, WEBP, and GIF are allowed" },
            { status: 400 }
          );
        }
        
        if (bannerFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Banner file size must be less than 5MB" },
            { status: 400 }
          );
        }
        
        // Delete old banner
        await deleteImage(existingSubCategory?.bannerImage);
        
        // Save new banner
        bannerImage = await saveImage(bannerFile, "banner");
      } else if (bannerFile && bannerFile.size === 0) {
        // If empty file is sent, user wants to delete the banner
        await deleteImage(existingSubCategory?.bannerImage);
        bannerImage = "";
      }
    } else {
      const body = await request.json();
      id = body.id;
      name = body.name;
      nameBn = body.nameBn;
      categoryId = body.categoryId;
      description = body.description;
      descriptionBn = body.descriptionBn;
      icon = body.icon;
      iconColor = body.iconColor;
      iconBgColor = body.iconBgColor;
      image = body.image;
      imageBgColor = body.imageBgColor;
      bannerImage = body.bannerImage;
    }
    
    if (!id) {
      return NextResponse.json({ error: "Subcategory ID is required" }, { status: 400 });
    }
    
    const existingSubCategory = await getSubCategoryById(id);
    if (!existingSubCategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }
    
    const updateData: any = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (nameBn && nameBn.trim()) updateData.nameBn = nameBn.trim();
    if (categoryId) updateData.categoryId = categoryId;
    
    // Handle description fields
    if (description !== undefined) {
      updateData.description = description && description.trim() ? description.trim() : "";
    }
    
    if (descriptionBn !== undefined) {
      updateData.descriptionBn = descriptionBn && descriptionBn.trim() ? descriptionBn.trim() : "";
    }
    
    if (icon) updateData.icon = icon;
    if (iconColor) updateData.iconColor = iconColor;
    if (iconBgColor) updateData.iconBgColor = iconBgColor;
    if (image !== undefined) updateData.image = image;
    if (imageBgColor) updateData.imageBgColor = imageBgColor;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
    
    if (name) updateData.slug = getSlug(name.trim());
    updateData.updated_at = new Date();
    
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
    
    // Get subcategory to delete images
    const subCategory = await getSubCategoryById(id);
    
    // Delete associated images
    await deleteImage(subCategory?.image);
    await deleteImage(subCategory?.bannerImage);
    
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