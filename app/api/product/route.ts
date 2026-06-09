import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product-model";
import { Category } from "@/models/category-model";
import { Brand } from "@/models/brand-model";
import { Size } from "@/models/size-model";
import { Color } from "@/models/color-model";
import { SubCategory } from "@/models/subcategory-model";
import { getSlug } from "@/lib/convertData";
import { 
  createProductQuery, 
  updateProductQuery, 
  deleteProductQuery, 
  toggleProductStatusQuery,
  getProductDetails,
  getProducts
} from "@/queries/products";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Helper functions for file handling
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

async function saveMultipleImages(files: File[], folder: string, prefix: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await saveImage(files[i], folder, `${prefix}-${i}`);
    urls.push(url);
  }
  return urls;
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

// GET: Fetch product(s)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const active = searchParams.get('active');
    const categoryId = searchParams.get('categoryId');
    const brandId = searchParams.get('brandId');
    
    if (id) {
      const product = await getProductDetails(id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: product });
    } else {
      let filter: any = {};
      if (active === 'true') filter.active = true;
      if (categoryId) filter.categoryId = new mongoose.Types.ObjectId(categoryId);
      if (brandId) filter.brandId = new mongoose.Types.ObjectId(brandId);
      
      const products = await getProducts(filter);
      return NextResponse.json({ success: true, data: products, count: products.length });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Create product
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const nameBn = formData.get("nameBn") as string;
    const price = parseFloat(formData.get("price") as string);
    const oldPrice = formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : 0;
    const discount = formData.get("discount") ? parseFloat(formData.get("discount") as string) : 0;
    const discountType = formData.get("discountType") as string || "percentage";
    const stock = parseInt(formData.get("stock") as string) || 0;
    const categoryId = formData.get("category") as string;
    const subCategoryId = formData.get("subCategory") as string;
    const brandId = formData.get("brand") as string;
    const sizeIds = JSON.parse(formData.get("sizes") as string || "[]");
    const colorIds = JSON.parse(formData.get("colors") as string || "[]");

    // ✅ shortDescription + longDescription (EN + BN)
    const shortDescription = formData.get("shortDescription") as string || "";
    const shortDescriptionBn = formData.get("shortDescriptionBn") as string || "";
    const longDescription = formData.get("longDescription") as string || "";
    const longDescriptionBn = formData.get("longDescriptionBn") as string || "";

    const section = formData.get("section") as string || "none";
    const badge = formData.get("badge") as string || "none";
    const productType = formData.get("productType") as string || "simple";
    const imageFile = formData.get("image") as File;
    const multiImageFiles = formData.getAll("multiImages") as File[];
    const videoFile = formData.get("video") as File;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (!price || price <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (!brandId) {
      return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    }
    if (!imageFile) {
      return NextResponse.json({ error: "Main image is required" }, { status: 400 });
    }

    // Verify IDs exist
    const categoryExists = await Category.findById(categoryId).lean();
    if (!categoryExists) {
      return NextResponse.json({ error: "Selected category does not exist" }, { status: 400 });
    }

    // Verify subcategory if provided
    if (subCategoryId) {
      const subCategoryExists = await SubCategory.findById(subCategoryId).lean();
      if (!subCategoryExists) {
        return NextResponse.json({ error: "Selected subcategory does not exist" }, { status: 400 });
      }
      if (subCategoryExists.categoryId.toString() !== categoryId) {
        return NextResponse.json({ error: "Subcategory does not belong to selected category" }, { status: 400 });
      }
    }

    const brandExists = await Brand.findById(brandId).lean();
    if (!brandExists) {
      return NextResponse.json({ error: "Selected brand does not exist" }, { status: 400 });
    }

    if (sizeIds.length > 0) {
      const sizeCount = await Size.countDocuments({ _id: { $in: sizeIds } });
      if (sizeCount !== sizeIds.length) {
        return NextResponse.json({ error: "One or more selected sizes do not exist" }, { status: 400 });
      }
    }

    if (colorIds.length > 0) {
      const colorCount = await Color.countDocuments({ _id: { $in: colorIds } });
      if (colorCount !== colorIds.length) {
        return NextResponse.json({ error: "One or more selected colors do not exist" }, { status: 400 });
      }
    }

    // Check for duplicate product
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    }).lean();

    if (existingProduct) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 409 });
    }

    const slug = getSlug(name.trim());
    const existingSlug = await Product.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json({ error: "Product with similar name already exists" }, { status: 409 });
    }

    // Save files
    let imageUrl = "";
    if (imageFile) {
      imageUrl = await saveImage(imageFile, "products", "product-main");
    }

    let multiImageUrls: string[] = [];
    if (multiImageFiles.length > 0) {
      multiImageUrls = await saveMultipleImages(multiImageFiles, "products/multi", "product-gallery");
    }

    let videoUrl = "";
    if (videoFile && videoFile.size > 0) {
      videoUrl = await saveImage(videoFile, "products/videos", "product-video");
    }

    const productData = {
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      price,
      oldPrice: oldPrice || 0,
      discount: discount || 0,
      discountType: discountType || "percentage",
      stock: stock || 0,
      categoryId,
      subCategoryId: subCategoryId || null,
      brandId,
      sizeIds,
      colorIds,
      // ✅ Updated description fields
      shortDescription,
      shortDescriptionBn: shortDescriptionBn || shortDescription,
      longDescription,
      longDescriptionBn: longDescriptionBn || longDescription,
      image: imageUrl,
      multiImages: multiImageUrls,
      video: videoUrl,
      slug,
      section: section || "none",
      badge: badge || "none",
      productType: productType || "simple",
      active: true,
    };

    const newProduct = await createProductQuery(productData);

    return NextResponse.json({
      success: true,
      message: "Product created successfully!",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/product:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT: Update product
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const nameBn = formData.get("nameBn") as string;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : undefined;
    const oldPrice = formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : undefined;
    const discount = formData.get("discount") ? parseFloat(formData.get("discount") as string) : undefined;
    const discountType = formData.get("discountType") as string;
    const stock = formData.get("stock") ? parseInt(formData.get("stock") as string) : undefined;
    const categoryId = formData.get("category") as string;
    const subCategoryId = formData.get("subCategory") as string;
    const brandId = formData.get("brand") as string;
    const sizeIds = formData.get("sizes") ? JSON.parse(formData.get("sizes") as string) : undefined;
    const colorIds = formData.get("colors") ? JSON.parse(formData.get("colors") as string) : undefined;

    // ✅ shortDescription + longDescription (EN + BN)
    const shortDescription = formData.get("shortDescription") as string | null;
    const shortDescriptionBn = formData.get("shortDescriptionBn") as string | null;
    const longDescription = formData.get("longDescription") as string | null;
    const longDescriptionBn = formData.get("longDescriptionBn") as string | null;

    const section = formData.get("section") as string;
    const badge = formData.get("badge") as string;
    const productType = formData.get("productType") as string;
    const imageFile = formData.get("image") as File;
    const videoFile = formData.get("video") as File;
    const active = formData.get("active") === "true";
    
    const multiImageFiles = formData.getAll("multiImages") as File[];
    const removeImagesJson = formData.get("removeImages") as string;
    const removeImages = removeImagesJson ? JSON.parse(removeImagesJson) : [];

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const existingProduct = await getProductDetails(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: any = {};
    
    // Basic info updates
    if (name?.trim()) {
      updateData.name = name.trim();
      updateData.slug = getSlug(name.trim());
    }
    if (nameBn?.trim()) updateData.nameBn = nameBn.trim();
    if (price !== undefined) updateData.price = price;
    if (oldPrice !== undefined) updateData.oldPrice = oldPrice;
    if (discount !== undefined) updateData.discount = discount;
    if (discountType) updateData.discountType = discountType;
    if (stock !== undefined) updateData.stock = stock;
    if (categoryId) updateData.categoryId = categoryId;
    if (subCategoryId !== undefined) updateData.subCategoryId = subCategoryId || null;
    if (brandId) updateData.brandId = brandId;
    if (sizeIds) updateData.sizeIds = sizeIds;
    if (colorIds) updateData.colorIds = colorIds;

    // ✅ Description fields — null check দিয়ে update
    if (shortDescription !== null) updateData.shortDescription = shortDescription;
    if (shortDescriptionBn !== null) updateData.shortDescriptionBn = shortDescriptionBn;
    if (longDescription !== null) updateData.longDescription = longDescription;
    if (longDescriptionBn !== null) updateData.longDescriptionBn = longDescriptionBn;

    if (section) updateData.section = section;
    if (badge) updateData.badge = badge;
    if (productType) updateData.productType = productType;
    if (active !== undefined) updateData.active = active;
    
    // Verify subcategory
    if (subCategoryId && subCategoryId !== "null" && subCategoryId !== "") {
      const subCategoryExists = await SubCategory.findById(subCategoryId).lean();
      if (!subCategoryExists) {
        return NextResponse.json({ error: "Selected subcategory does not exist" }, { status: 400 });
      }
      const finalCategoryId = categoryId || existingProduct.categoryId;
      if (subCategoryExists.categoryId.toString() !== finalCategoryId) {
        return NextResponse.json({ error: "Subcategory does not belong to selected category" }, { status: 400 });
      }
    }
    
    // Handle main image
    if (imageFile && imageFile.size > 0) {
      if (existingProduct.image) {
        await deleteImage(existingProduct.image);
      }
      updateData.image = await saveImage(imageFile, "products", "product-main");
    }
    
    // Handle video
    if (videoFile && videoFile.size > 0) {
      if (existingProduct.video) {
        await deleteImage(existingProduct.video);
      }
      updateData.video = await saveImage(videoFile, "products/videos", "product-video");
    }

    // Handle multi-images
    let updatedMultiImages = [...(existingProduct.multiImages || [])];
    
    if (removeImages.length > 0) {
      for (const imageUrl of removeImages) {
        await deleteImage(imageUrl);
        updatedMultiImages = updatedMultiImages.filter(img => img !== imageUrl);
      }
    }
    
    if (multiImageFiles.length > 0) {
      const newImageUrls = await Promise.all(
        multiImageFiles.map((file, index) => 
          saveImage(file, "products/multi", `product-multi-${Date.now()}-${index}`)
        )
      );
      updatedMultiImages.push(...newImageUrls);
    }
    
    updateData.multiImages = updatedMultiImages;

    const updatedProduct = await updateProductQuery(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/product:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await getProductDetails(id);
    
    if (product) {
      if (product.image) await deleteImage(product.image);
      if (product.multiImages && product.multiImages.length > 0) {
        for (const img of product.multiImages) {
          await deleteImage(img);
        }
      }
      if (product.video) await deleteImage(product.video);
    }

    const deleted = await deleteProductQuery(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete product" },
      { status: 500 }
    );
  }
}

// PATCH: Update product status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updatedProduct = await toggleProductStatusQuery(id, active !== undefined ? active : false);

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product status updated successfully",
      active: updatedProduct.active,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product status" },
      { status: 500 }
    );
  }
}