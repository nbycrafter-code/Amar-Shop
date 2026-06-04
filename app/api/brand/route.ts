// app/api/brand/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Brand } from "@/models/brand-model";
import { getSlug } from "@/lib/convertData";
import { 
  createBrandQuery, 
  updateBrandQuery, 
  deleteBrandQuery, 
  toggleBrandStatusQuery,
  getBrandDetails,
  getBrands
} from "@/queries/brands";
import fs from "fs";
import path from "path";

// Helper function to save image
async function saveImage(file: File, folder: string, prefix: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.type.split('/')[1] || 'jpg';
  const filename = `${prefix}-${timestamp}-${randomString}.${extension}`;
  
  const uploadDir = path.join(process.cwd(), `public/uploads/${folder}/`);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/uploads/${folder}/${filename}`;
}

async function deleteImage(imageUrl: string): Promise<void> {
  if (imageUrl && !imageUrl.startsWith('http')) {
    const imagePath = path.join(process.cwd(), "public", imageUrl);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error(`Failed to delete image: ${imagePath}`, error);
      }
    }
  }
}

// ==================== GET: Fetch brand(s) ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      const brand = await getBrandDetails(id);
      if (!brand) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: brand });
    } else {
      const brands = await getBrands();
      return NextResponse.json({ success: true, data: brands });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/brand:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create a new brand ====================
export async function POST(request: NextRequest) {
  try {
    let name, nameBn, country, icon, iconColor, iconBgColor, imageBgColor;
    let imageFile: File | null = null;
    
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      country = formData.get("country") as string;
      icon = formData.get("icon") as string;
      iconColor = formData.get("iconColor") as string;
      iconBgColor = formData.get("iconBgColor") as string;
      imageBgColor = formData.get("imageBgColor") as string;
      imageFile = formData.get("image") as File;
    } else {
      const body = await request.json();
      name = body.name;
      nameBn = body.nameBn;
      country = body.country;
      icon = body.icon;
      iconColor = body.iconColor;
      iconBgColor = body.iconBgColor;
      imageBgColor = body.imageBgColor;
    }

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Brand name (English) is required" }, { status: 400 });
    }
    if (!nameBn?.trim()) {
      return NextResponse.json({ error: "Brand name (Bangla) is required" }, { status: 400 });
    }
    if (!country?.trim()) {
      return NextResponse.json({ error: "Country of origin is required" }, { status: 400 });
    }

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } },
        { nameBn: { $regex: new RegExp(`^${nameBn.trim()}$`, 'i') } }
      ]
    }).lean();

    if (existingBrand) {
      return NextResponse.json({ error: "Brand with this name already exists" }, { status: 409 });
    }

    const slug = getSlug(name.trim());
    const existingSlug = await Brand.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json({ error: "Brand with similar name already exists" }, { status: 409 });
    }

    // Handle image upload
    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveImage(imageFile, "brands", "brand");
    }

    const brandData = {
      name: name.trim(),
      nameBn: nameBn.trim(),
      country: country.trim(),
      icon: icon || "Building2",
      iconColor: iconColor || "#3B82F6",
      iconBgColor: iconBgColor || "#EFF6FF",
      image: imageUrl,
      imageBgColor: imageBgColor || "#F8FAFC",
      slug,
      active: true,
    };

    const newBrand = await createBrandQuery(brandData);
    console.log("✅ Brand Created:", newBrand);

    return NextResponse.json({
      success: true,
      message: "Brand created successfully!",
      data: newBrand,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/brand:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json({ error: "Brand with this name already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create brand" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update an existing brand ====================
export async function PUT(request: NextRequest) {
  try {
    let id, name, nameBn, country, icon, iconColor, iconBgColor, imageBgColor;
    let imageFile: File | null = null;
    
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = formData.get("id") as string;
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      country = formData.get("country") as string;
      icon = formData.get("icon") as string;
      iconColor = formData.get("iconColor") as string;
      iconBgColor = formData.get("iconBgColor") as string;
      imageBgColor = formData.get("imageBgColor") as string;
      imageFile = formData.get("image") as File;
    } else {
      const body = await request.json();
      id = body.id;
      name = body.name;
      nameBn = body.nameBn;
      country = body.country;
      icon = body.icon;
      iconColor = body.iconColor;
      iconBgColor = body.iconBgColor;
      imageBgColor = body.imageBgColor;
    }

    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
    }

    const existingBrand = await getBrandDetails(id);
    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const updateData: any = { updated_at: new Date() };
    
    if (name?.trim()) {
      updateData.name = name.trim();
      updateData.slug = getSlug(name.trim());
    }
    if (nameBn?.trim()) updateData.nameBn = nameBn.trim();
    if (country?.trim()) updateData.country = country.trim();
    if (icon) updateData.icon = icon;
    if (iconColor) updateData.iconColor = iconColor;
    if (iconBgColor) updateData.iconBgColor = iconBgColor;
    if (imageBgColor) updateData.imageBgColor = imageBgColor;
    
    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      if (existingBrand.image) {
        await deleteImage(existingBrand.image);
      }
      updateData.image = await saveImage(imageFile, "brands", "brand");
    }

    const updatedBrand = await updateBrandQuery(id, updateData);

    if (!updatedBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    console.log("♻️ Brand Updated:", updatedBrand);

    return NextResponse.json({
      success: true,
      message: "Brand updated successfully!",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/brand:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json({ error: "Brand with this name already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update brand" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a brand by ID ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
    }

    const brand = await getBrandDetails(id);
    if (brand && brand.image) {
      await deleteImage(brand.image);
    }

    const deleted = await deleteBrandQuery(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    console.log("✅ Brand deleted:", id);

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/brand:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete brand" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update brand status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
    }

    const updatedBrand = await toggleBrandStatusQuery(id, active !== undefined ? active : false);

    if (!updatedBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    console.log("♻️ Brand status updated for:", id, "New status:", updatedBrand.active);

    return NextResponse.json({
      success: true,
      message: "Brand status updated successfully",
      active: updatedBrand.active,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/brand:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update brand status" },
      { status: 500 }
    );
  }
}