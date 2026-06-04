// app/api/banner/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Banner } from "@/models/banner-model";
import fs from "fs";
import path from "path";

// Helper function to save image
async function saveImage(file: File, type: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `banner-${type}-${timestamp}-${randomString}.${extension}`;
  
  const uploadDir = path.join(process.cwd(), "public/uploads/banners/");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/uploads/banners/${filename}`;
}

// Helper function to save video
async function saveVideo(file: File, type: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'mp4';
  const filename = `banner-${type}-${timestamp}-${randomString}.${extension}`;
  
  const uploadDir = path.join(process.cwd(), "public/uploads/banners/");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/uploads/banners/${filename}`;
}

// Helper function to delete old file
async function deleteOldFile(fileUrl: string) {
  if (fileUrl && !fileUrl.startsWith('http')) {
    const oldFilePath = path.join(process.cwd(), "public", fileUrl);
    if (fs.existsSync(oldFilePath)) {
      await fs.promises.unlink(oldFilePath);
    }
  }
}

// ==================== GET: Fetch banners ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const active = searchParams.get('active');
    const pageType = searchParams.get('pageType');
    const pagePosition = searchParams.get('pagePosition');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    if (id) {
      const banner = await Banner.findById(id);
      if (!banner) {
        return NextResponse.json(
          { error: "Banner not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: banner,
      });
    } else {
      let query: any = {};
      
      // Filter by page type
      if (pageType && pageType !== 'all') {
        query.pageType = pageType;
      }
      
      // Filter by page position
      if (pagePosition) {
        query.pagePosition = pagePosition;
      }
      
      // Filter by active status
      if (active === 'true') {
        query.active = true;
        const now = new Date();
        query.$or = [
          { startDate: { $exists: false } },
          { startDate: { $lte: now } }
        ];
        query.$and = [
          {
            $or: [
              { endDate: { $exists: false } },
              { endDate: { $gte: now } }
            ]
          }
        ];
      }
      
      const banners = await Banner.find(query)
        .sort({ order: 1, created_at: -1 })
        .limit(limit);
      
      return NextResponse.json({
        success: true,
        data: banners,
        total: banners.length,
      });
    }
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create new banner ====================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const titleBn = formData.get("titleBn") as string;
    const subtitle = formData.get("subtitle") as string;
    const subtitleBn = formData.get("subtitleBn") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonTextBn = formData.get("buttonTextBn") as string;
    const buttonLink = formData.get("buttonLink") as string;
    const textColor = formData.get("textColor") as string;
    const highlightColor = formData.get("highlightColor") as string;
    const gradient = formData.get("gradient") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const pageType = formData.get("pageType") as string;
    const pagePosition = formData.get("pagePosition") as string;
    const mediaType = formData.get("mediaType") as string;
    
    const bgImageFile = formData.get("bgImage") as File;
    const bgVideoFile = formData.get("bgVideo") as File;
    
    // Validation
    if (!title || !titleBn) {
      return NextResponse.json(
        { error: "Title (English & Bangla) are required" },
        { status: 400 }
      );
    }
    
    if (!pageType || !pagePosition) {
      return NextResponse.json(
        { error: "Page type and page position are required" },
        { status: 400 }
      );
    }
    
    let bgImage = "";
    let bgVideo = "";
    
    // Handle image upload
    if (bgImageFile && bgImageFile.size > 0) {
      bgImage = await saveImage(bgImageFile, "image");
    }
    
    // Handle video upload
    if (bgVideoFile && bgVideoFile.size > 0) {
      console.log("📹 Video file received:", bgVideoFile.name, "Size:", bgVideoFile.size);
      bgVideo = await saveVideo(bgVideoFile, "video");
      console.log("✅ Video saved at:", bgVideo);
    }
    
    // For video type, video is required
    if (mediaType === "video" && !bgVideo) {
      return NextResponse.json(
        { error: "Video file is required for video banner" },
        { status: 400 }
      );
    }
    
    // For image type, image is required
    if (mediaType === "image" && !bgImage) {
      return NextResponse.json(
        { error: "Image file is required for image banner" },
        { status: 400 }
      );
    }
    
    const banner = await Banner.create({
      title,
      titleBn,
      subtitle: subtitle || "",
      subtitleBn: subtitleBn || "",
      buttonText: buttonText || "Shop Now",
      buttonTextBn: buttonTextBn || "কিনুন এখন",
      buttonLink: buttonLink || "/shop",
      bgImage,
      bgVideo,
      textColor: textColor || "text-white",
      highlightColor: highlightColor || "text-lime-300",
      gradient: gradient || "from-black/30 via-black/15 to-transparent",
      order,
      pageType: pageType || "homepage",
      pagePosition: pagePosition || "hero",
      mediaType: mediaType || "image",
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      message: "Banner created successfully!",
      data: banner,
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error creating banner:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create banner" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update banner ====================
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
      return NextResponse.json(
        { error: "Banner ID is required" },
        { status: 400 }
      );
    }
    
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    // Text fields
    const title = formData.get("title") as string;
    const titleBn = formData.get("titleBn") as string;
    const subtitle = formData.get("subtitle") as string;
    const subtitleBn = formData.get("subtitleBn") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonTextBn = formData.get("buttonTextBn") as string;
    const buttonLink = formData.get("buttonLink") as string;
    const textColor = formData.get("textColor") as string;
    const highlightColor = formData.get("highlightColor") as string;
    const gradient = formData.get("gradient") as string;
    const order = formData.get("order");
    const pageType = formData.get("pageType") as string;
    const pagePosition = formData.get("pagePosition") as string;
    const mediaType = formData.get("mediaType") as string;
    
    const bgImageFile = formData.get("bgImage") as File;
    const bgVideoFile = formData.get("bgVideo") as File;
    
    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (titleBn) updateData.titleBn = titleBn;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (subtitleBn !== undefined) updateData.subtitleBn = subtitleBn;
    if (buttonText) updateData.buttonText = buttonText;
    if (buttonTextBn) updateData.buttonTextBn = buttonTextBn;
    if (buttonLink) updateData.buttonLink = buttonLink;
    if (textColor) updateData.textColor = textColor;
    if (highlightColor) updateData.highlightColor = highlightColor;
    if (gradient) updateData.gradient = gradient;
    if (order !== null) updateData.order = parseInt(order as string);
    if (pageType) updateData.pageType = pageType;
    if (pagePosition) updateData.pagePosition = pagePosition;
    if (mediaType) updateData.mediaType = mediaType;
    
    // Handle image update
    if (bgImageFile && bgImageFile.size > 0) {
      if (existingBanner.bgImage) {
        await deleteOldFile(existingBanner.bgImage);
      }
      updateData.bgImage = await saveImage(bgImageFile, "image");
    }
    
    // Handle video update
    if (bgVideoFile && bgVideoFile.size > 0) {
      console.log("📹 Updating video file:", bgVideoFile.name, "Size:", bgVideoFile.size);
      if (existingBanner.bgVideo) {
        await deleteOldFile(existingBanner.bgVideo);
      }
      updateData.bgVideo = await saveVideo(bgVideoFile, "video");
      console.log("✅ Video updated at:", updateData.bgVideo);
    }
    
    updateData.updated_at = new Date();
    
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "Banner updated successfully!",
      data: updatedBanner,
    });
    
  } catch (error) {
    console.error("❌ Error updating banner:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update banner" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete banner ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Banner ID is required" },
        { status: 400 }
      );
    }
    
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    // Delete associated files
    if (banner.bgImage) {
      await deleteOldFile(banner.bgImage);
    }
    if (banner.bgVideo) {
      await deleteOldFile(banner.bgVideo);
    }
    
    await Banner.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update banner status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Banner ID is required" },
        { status: 400 }
      );
    }
    
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { $set: { active, updated_at: new Date() } },
      { new: true }
    );
    
    if (!updatedBanner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Banner ${active ? "activated" : "deactivated"} successfully!`,
      data: updatedBanner,
    });
  } catch (error) {
    console.error("❌ Error updating banner status:", error);
    return NextResponse.json(
      { error: "Failed to update banner status" },
      { status: 500 }
    );
  }
}