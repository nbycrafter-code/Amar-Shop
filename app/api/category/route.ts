// app/api/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/models/category-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getSlug } from "@/lib/convertData";
import { 
  createCategoryQuery, 
  updateCategoryQuery, 
  deleteCategoryQuery, 
  toggleCategoryStatusQuery,
  getCategoryDetails,
  getCategories
} from "@/queries/categories";
import fs from "fs";
import path from "path";

// Types
interface CategoryData {
  name: string;
  nameBn: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  image?: string;
  imageBgColor?: string;
  bannerImage?: string;
  slug: string;
  description?: string;
  descriptionBn?: string;
  active?: boolean;
}

// Helper function to save image
async function saveImage(file: File, type: "category" | "banner" = "category"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${randomString}.${ext}`;
  
  let uploadDir: string;
  let urlPath: string;
  
  if (type === "banner") {
    uploadDir = path.join(process.cwd(), "public/uploads/categories/banner");
    urlPath = `/uploads/categories/banner/${filename}`;
  } else {
    uploadDir = path.join(process.cwd(), "public/uploads/categories");
    urlPath = `/uploads/categories/${filename}`;
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
  if (imagePath && (imagePath.startsWith('/uploads/categories/') || imagePath.startsWith('/uploads/'))) {
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

// ==================== GET: Fetch category(s) ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const active = searchParams.get('active');
    
    if (id) {
      const category = await getCategoryDetails(id);
      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: category,
      });
    } else {
      const categories = await getCategories();
      return NextResponse.json({
        success: true,
        data: categories,
      });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create a new category ====================
export async function POST(request: NextRequest) {
  try {
    let name, nameBn, description, descriptionBn, icon, iconColor, iconBgColor, image, imageBgColor, bannerImage;
    
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      description = formData.get("description") as string;
      descriptionBn = formData.get("descriptionBn") as string;
      const imageFile = formData.get("image") as File;
      const bannerFile = formData.get("bannerImage") as File;
      imageBgColor = formData.get("imageBgColor") as string || "#F8FAFC";
      
      // Validation
      if (!name || name.trim() === "") {
        return NextResponse.json(
          { error: "Category name (English) is required" },
          { status: 400 }
        );
      }

      if (!nameBn || nameBn.trim() === "") {
        return NextResponse.json(
          { error: "Category name (Bangla) is required" },
          { status: 400 }
        );
      }

      // Check if either image or icon is provided
      if (!imageFile && !formData.get("icon")) {
        return NextResponse.json(
          { error: "Either category image or icon is required" },
          { status: 400 }
        );
      }

      // Handle image upload
      if (imageFile && imageFile.size > 0) {
        const imageUrl = await saveImage(imageFile, "category");
        image = imageUrl;
        icon = "";
        iconColor = "";
        iconBgColor = "";
      } else {
        // Handle icon data
        icon = formData.get("icon") as string || "ShoppingBag";
        iconColor = formData.get("iconColor") as string || "#3B82F6";
        iconBgColor = formData.get("iconBgColor") as string || "#EFF6FF";
        image = "";
        imageBgColor = "";
      }
      
      // Save banner image if provided
      if (bannerFile && bannerFile.size > 0) {
        bannerImage = await saveImage(bannerFile, "banner");
      }
      
    } else {
      const body = await request.json();
      name = body.name;
      nameBn = body.nameBn;
      description = body.description || "";
      descriptionBn = body.descriptionBn || "";
      icon = body.icon;
      iconColor = body.iconColor || "#3B82F6";
      iconBgColor = body.iconBgColor || "#EFF6FF";
      image = body.image || "";
      imageBgColor = body.imageBgColor || "";
      bannerImage = body.bannerImage || "";

      // Validation
      if (!name || name.trim() === "") {
        return NextResponse.json(
          { error: "Category name (English) is required" },
          { status: 400 }
        );
      }

      if (!nameBn || nameBn.trim() === "") {
        return NextResponse.json(
          { error: "Category name (Bangla) is required" },
          { status: 400 }
        );
      }

      // Check if either image or icon is provided
      if ((!image || image.trim() === "") && (!icon || icon.trim() === "")) {
        return NextResponse.json(
          { error: "Either category image or icon is required" },
          { status: 400 }
        );
      }
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } },
        { nameBn: { $regex: new RegExp(`^${nameBn.trim()}$`, 'i') } }
      ]
    }).lean();

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }

    // Prepare category data
    const slug = getSlug(name.trim());
    
    // Check if slug already exists
    const existingSlug = await Category.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json(
        { error: "Category with similar name already exists" },
        { status: 409 }
      );
    }

    const categoryData: CategoryData = {
      name: name.trim(),
      nameBn: nameBn.trim(),
      description: description && description.trim() ? description.trim() : "",
      descriptionBn: descriptionBn && descriptionBn.trim() ? descriptionBn.trim() : "",
      icon: icon || "",
      iconColor: iconColor || "#3B82F6",
      iconBgColor: iconBgColor || "#EFF6FF",
      image: image || "",
      imageBgColor: imageBgColor || "",
      bannerImage: bannerImage || "",
      slug: slug,
      active: true,
    };

    const newCategory = await createCategoryQuery(categoryData);
    console.log("✅ Category Created:", newCategory);

    return NextResponse.json({
      success: true,
      message: "Category created successfully!",
      data: newCategory,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/category:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create category" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update an existing category ====================
export async function PUT(request: NextRequest) {
  try {
    let id, name, nameBn, description, descriptionBn, icon, iconColor, iconBgColor, image, imageBgColor, bannerImage;
    
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = formData.get("id") as string;
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      description = formData.get("description") as string;
      descriptionBn = formData.get("descriptionBn") as string;
      const imageFile = formData.get("image") as File | null;
      const bannerFile = formData.get("bannerImage") as File | null;
      imageBgColor = formData.get("imageBgColor") as string;
      icon = formData.get("icon") as string;
      iconColor = formData.get("iconColor") as string;
      iconBgColor = formData.get("iconBgColor") as string;
      
      const existingCategory = await getCategoryDetails(id);
      
      // Handle category image upload
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
            { error: "File size must be less than 2MB" },
            { status: 400 }
          );
        }
        
        // Delete old image
        await deleteImage(existingCategory?.image);
        
        // Save new image
        image = await saveImage(imageFile, "category");
        
        // Clear icon data when image is uploaded
        icon = "";
        iconColor = "";
        iconBgColor = "";
      } else if (icon && icon.trim()) {
        // Using icon instead of image
        image = "";
        imageBgColor = "";
        
        // Delete old image if exists
        await deleteImage(existingCategory?.image);
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
        await deleteImage(existingCategory?.bannerImage);
        
        // Save new banner
        bannerImage = await saveImage(bannerFile, "banner");
      } else if (bannerFile && bannerFile.size === 0) {
        // If empty file is sent, user wants to delete the banner
        await deleteImage(existingCategory?.bannerImage);
        bannerImage = "";
      }
    } else {
      const body = await request.json();
      id = body.id;
      name = body.name;
      nameBn = body.nameBn;
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
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const existingCategory = await getCategoryDetails(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (name && name.trim()) {
      updateData.name = name.trim();
      updateData.slug = getSlug(name.trim());
    }
    
    if (nameBn && nameBn.trim()) {
      updateData.nameBn = nameBn.trim();
    }
    
    // Handle description fields
    if (description !== undefined) {
      updateData.description = description && description.trim() ? description.trim() : "";
    }
    
    if (descriptionBn !== undefined) {
      updateData.descriptionBn = descriptionBn && descriptionBn.trim() ? descriptionBn.trim() : "";
    }
    
    // Handle icon vs image logic - either one is fine, not both required
    if (image !== undefined && image.trim()) {
      // Using image
      updateData.image = image.trim();
      updateData.icon = "";
      updateData.iconColor = null;
      updateData.iconBgColor = null;
      if (imageBgColor) {
        updateData.imageBgColor = imageBgColor;
      }
    } else if (icon !== undefined && icon.trim()) {
      // Using icon
      updateData.icon = icon.trim();
      updateData.image = "";
      updateData.imageBgColor = null;
      
      if (iconColor && iconColor.trim()) {
        updateData.iconColor = iconColor.trim();
      } else {
        updateData.iconColor = "#3B82F6";
      }
      
      if (iconBgColor && iconBgColor.trim()) {
        updateData.iconBgColor = iconBgColor.trim();
      } else {
        updateData.iconBgColor = "#EFF6FF";
      }
    } else {
      // Update only colors if no image/icon change
      if (iconBgColor !== undefined) {
        updateData.iconBgColor = iconBgColor;
      }
      if (imageBgColor !== undefined && updateData.image) {
        updateData.imageBgColor = imageBgColor;
      }
    }
    
    if (bannerImage !== undefined) {
      updateData.bannerImage = bannerImage;
    }
    
    updateData.updated_at = new Date();

    const updatedCategory = await updateCategoryQuery(id, updateData);

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Category Updated:", updatedCategory);

    return NextResponse.json({
      success: true,
      message: "Category updated successfully!",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/category:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a category by ID ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await getCategoryDetails(id);
    
    // Delete associated images
    await deleteImage(category?.image);
    await deleteImage(category?.bannerImage);

    const deleted = await deleteCategoryQuery(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    console.log("✅ Category deleted:", id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update category status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const updatedCategory = await toggleCategoryStatusQuery(id, active !== undefined ? active : false);

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Category status updated for:", id, "New status:", updatedCategory.active);

    return NextResponse.json({
      success: true,
      message: "Category status updated successfully",
      active: updatedCategory.active,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category status" },
      { status: 500 }
    );
  }
}