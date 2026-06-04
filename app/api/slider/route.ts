// app/api/slider/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Slider } from "@/models/slider-model";
import fs from "fs";
import path from "path";

// Helper function to save image
async function saveImage(file: File, type: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `slider-${type}-${timestamp}-${randomString}.${extension}`;
  
  const uploadDir = path.join(process.cwd(), "public/uploads/sliders/");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/uploads/sliders/${filename}`;
}

// Helper function to save video
async function saveVideo(file: File, type: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'mp4';
  const filename = `slider-${type}-${timestamp}-${randomString}.${extension}`;
  
  const uploadDir = path.join(process.cwd(), "public/uploads/sliders/");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/uploads/sliders/${filename}`;
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

// Helper function to validate date range
function isDateInRange(startDate?: Date, endDate?: Date): boolean {
  const now = new Date();
  if (startDate && endDate) {
    return now >= startDate && now <= endDate;
  }
  if (startDate) {
    return now >= startDate;
  }
  if (endDate) {
    return now <= endDate;
  }
  return true;
}

// Helper function to update slider analytics
async function updateAnalytics(id: string, type: 'view' | 'click') {
  try {
    const slider = await Slider.findById(id);
    if (slider) {
      const updateField = type === 'view' ? 'views' : 'clicks';
      const currentValue = slider[updateField] || 0;
      await Slider.findByIdAndUpdate(id, {
        $set: { [updateField]: currentValue + 1 }
      });
    }
  } catch (error) {
    console.error(`Error updating ${type} analytics:`, error);
  }
}

// ==================== GET: Fetch sliders ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '10');
    const trackView = searchParams.get('trackView');
    
    // Track view if requested
    if (id && trackView === 'true') {
      await updateAnalytics(id, 'view');
      const slider = await Slider.findById(id);
      if (!slider) {
        return NextResponse.json(
          { error: "Slider not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: slider,
      });
    }
    
    // Get single slider
    if (id) {
      const slider = await Slider.findById(id);
      if (!slider) {
        return NextResponse.json(
          { error: "Slider not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: slider,
      });
    }
    
    // Get all sliders with filters
    let query: any = {};
    
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
    
    const sliders = await Slider.find(query)
      .sort({ order: 1, created_at: -1 })
      .limit(limit);
    
    // Calculate CTR for each slider
    const slidersWithStats = sliders.map(slider => ({
      ...slider.toObject(),
      ctr: slider.views && slider.views > 0 
        ? ((slider.clicks || 0) / slider.views * 100).toFixed(1)
        : 0
    }));
    
    return NextResponse.json({
      success: true,
      data: slidersWithStats,
      total: sliders.length,
    });
  } catch (error) {
    console.error("❌ Error fetching sliders:", error);
    return NextResponse.json(
      { error: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create new slider ====================
// app/api/slider/route.ts - POST মেথড আপডেট করুন
export async function POST(request: NextRequest) {
  try {
    // Check content type first
    const contentType = request.headers.get("content-type") || "";
    
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }
    
    const formData = await request.formData();
    
    // Log all form data entries for debugging
    console.log("Form Data Entries:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const title = formData.get("title") as string;
    const titleBn = formData.get("titleBn") as string;
    const subtitle = formData.get("subtitle") as string || "";
    const subtitleBn = formData.get("subtitleBn") as string || "";
    const buttonText = formData.get("buttonText") as string || "Shop Now";
    const buttonTextBn = formData.get("buttonTextBn") as string || "কিনুন এখন";
    const buttonLink = formData.get("buttonLink") as string || "/shop";
    const textColor = formData.get("textColor") as string || "text-white";
    const highlightColor = formData.get("highlightColor") as string || "text-lime-400";
    const gradient = formData.get("gradient") as string || "from-black/50 via-black/20 to-transparent";
    const order = parseInt(formData.get("order") as string) || 0;
    const active = formData.get("active") === "true";
    const mediaType = formData.get("mediaType") as string || "image";
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    
    // Validation
    if (!title || !titleBn) {
      return NextResponse.json(
        { error: "Title (English & Bangla) are required" },
        { status: 400 }
      );
    }
    
    let bgImage = "";
    let mobileImage = "";
    let bgVideo = "";
    
    // Handle file uploads
    const bgImageFile = formData.get("bgImage") as File;
    const mobileImageFile = formData.get("mobileImage") as File;
    const bgVideoFile = formData.get("bgVideo") as File;
    
    console.log("Files received:", {
      bgImage: bgImageFile?.name,
      mobileImage: mobileImageFile?.name,
      bgVideo: bgVideoFile?.name
    });
    
    // Handle desktop image upload
    if (bgImageFile && bgImageFile.size > 0) {
      bgImage = await saveImage(bgImageFile, "desktop");
    }
    
    // Handle mobile image upload
    if (mobileImageFile && mobileImageFile.size > 0) {
      mobileImage = await saveImage(mobileImageFile, "mobile");
    }
    
    // Handle video upload
    if (bgVideoFile && bgVideoFile.size > 0) {
      bgVideo = await saveVideo(bgVideoFile, "video");
    }
    
    // Validate media requirements
    if (mediaType === "video" && !bgVideo && !bgImage) {
      return NextResponse.json(
        { error: "Video file is required for video slider" },
        { status: 400 }
      );
    }
    
    if (mediaType === "image" && !bgImage) {
      return NextResponse.json(
        { error: "Image file is required for image slider" },
        { status: 400 }
      );
    }
    
    // Get max order if not provided
    let finalOrder = order;
    if (finalOrder === 0) {
      const maxOrderSlider = await Slider.findOne().sort({ order: -1 });
      finalOrder = maxOrderSlider ? maxOrderSlider.order + 1 : 1;
    }
    
    const sliderData: any = {
      title,
      titleBn,
      subtitle,
      subtitleBn,
      buttonText,
      buttonTextBn,
      buttonLink,
      bgImage,
      mobileImage: mobileImage || bgImage,
      textColor,
      highlightColor,
      gradient,
      order: finalOrder,
      active: active !== undefined ? active : true,
      views: 0,
      clicks: 0,
    };
    
    // Add video if present
    if (bgVideo) {
      sliderData.bgVideo = bgVideo;
    }
    
    // Add dates if present
    if (startDate && startDate !== "") {
      sliderData.startDate = new Date(startDate);
    }
    if (endDate && endDate !== "") {
      sliderData.endDate = new Date(endDate);
    }
    
    console.log("Creating slider with data:", sliderData);
    
    const slider = await Slider.create(sliderData);
    
    return NextResponse.json({
      success: true,
      message: "Slider created successfully!",
      data: slider,
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ Error creating slider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create slider" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update slider ====================
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
      return NextResponse.json(
        { error: "Slider ID is required" },
        { status: 400 }
      );
    }
    
    const existingSlider = await Slider.findById(id);
    if (!existingSlider) {
      return NextResponse.json(
        { error: "Slider not found" },
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
    const active = formData.get("active");
    const mediaType = formData.get("mediaType") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    
    const bgImageFile = formData.get("bgImage") as File;
    const mobileImageFile = formData.get("mobileImage") as File;
    const bgVideoFile = formData.get("bgVideo") as File;
    
    const updateData: any = {};
    
    // Update text fields
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
    if (order) updateData.order = parseInt(order as string);
    if (active !== null) updateData.active = active === "true";
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    
    // Handle desktop image update
    if (bgImageFile && bgImageFile.size > 0) {
      if (existingSlider.bgImage) {
        await deleteOldFile(existingSlider.bgImage);
      }
      updateData.bgImage = await saveImage(bgImageFile, "desktop");
    }
    
    // Handle mobile image update
    if (mobileImageFile && mobileImageFile.size > 0) {
      if (existingSlider.mobileImage && existingSlider.mobileImage !== existingSlider.bgImage) {
        await deleteOldFile(existingSlider.mobileImage);
      }
      updateData.mobileImage = await saveImage(mobileImageFile, "mobile");
    }
    
    // Handle video update
    if (bgVideoFile && bgVideoFile.size > 0) {
      console.log("📹 Updating video file:", bgVideoFile.name, "Size:", bgVideoFile.size);
      if (existingSlider.bgVideo) {
        await deleteOldFile(existingSlider.bgVideo);
      }
      updateData.bgVideo = await saveVideo(bgVideoFile, "video");
      console.log("✅ Video updated at:", updateData.bgVideo);
    }
    
    updateData.updated_at = new Date();
    
    const updatedSlider = await Slider.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "Slider updated successfully!",
      data: updatedSlider,
    });
    
  } catch (error) {
    console.error("❌ Error updating slider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update slider" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete slider ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Slider ID is required" },
        { status: 400 }
      );
    }
    
    const slider = await Slider.findById(id);
    if (!slider) {
      return NextResponse.json(
        { error: "Slider not found" },
        { status: 404 }
      );
    }
    
    // Delete associated files
    if (slider.bgImage) {
      await deleteOldFile(slider.bgImage);
    }
    if (slider.mobileImage && slider.mobileImage !== slider.bgImage) {
      await deleteOldFile(slider.mobileImage);
    }
    if (slider.bgVideo) {
      await deleteOldFile(slider.bgVideo);
    }
    
    await Slider.findByIdAndDelete(id);
    
    // Reorder remaining sliders
    const remainingSliders = await Slider.find().sort({ order: 1 });
    for (let i = 0; i < remainingSliders.length; i++) {
      await Slider.findByIdAndUpdate(remainingSliders[i]._id, {
        order: i + 1
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Slider deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting slider:", error);
    return NextResponse.json(
      { error: "Failed to delete slider" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update slider status or track click ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active, trackClick } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Slider ID is required" },
        { status: 400 }
      );
    }
    
    // Track click analytics
    if (trackClick === true) {
      await updateAnalytics(id, 'click');
      const slider = await Slider.findById(id);
      return NextResponse.json({
        success: true,
        message: "Click tracked successfully",
        data: slider,
      });
    }
    
    // Update status
    if (active !== undefined) {
      const updatedSlider = await Slider.findByIdAndUpdate(
        id,
        { $set: { active, updated_at: new Date() } },
        { new: true }
      );
      
      if (!updatedSlider) {
        return NextResponse.json(
          { error: "Slider not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: `Slider ${active ? "activated" : "deactivated"} successfully!`,
        data: updatedSlider,
      });
    }
    
    return NextResponse.json(
      { error: "No valid operation specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Error updating slider:", error);
    return NextResponse.json(
      { error: "Failed to update slider" },
      { status: 500 }
    );
  }
}


// ==================== OPTIONS: Handle CORS ====================
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}