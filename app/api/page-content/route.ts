// app/api/page-content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PageContent } from "@/models/page-content-model";
import fs from "fs";
import path from "path";

// Helper function to save image
async function saveImage(file: File, type: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `page-${type}-${timestamp}-${randomString}.${extension}`;
  
  const uploadDir = path.join(process.cwd(), "public/assets/uploads/pages/");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/assets/uploads/pages/${filename}`;
}

// Helper function to delete old image
async function deleteOldFile(fileUrl: string) {
  if (fileUrl && !fileUrl.startsWith('http')) {
    const oldFilePath = path.join(process.cwd(), "public", fileUrl);
    if (fs.existsSync(oldFilePath)) {
      await fs.promises.unlink(oldFilePath);
    }
  }
}

// ==================== GET: Fetch page content ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageType = searchParams.get('pageType');
    const id = searchParams.get('id');
    
    if (id) {
      const content = await PageContent.findById(id);
      if (!content) {
        return NextResponse.json(
          { error: "Page content not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: content,
      });
    } else if (pageType) {
      const content = await PageContent.findOne({ pageType, active: true });
      if (!content) {
        return NextResponse.json(
          { error: "Page content not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: content,
      });
    } else {
      const contents = await PageContent.find({}).sort({ pageType: 1 });
      return NextResponse.json({
        success: true,
        data: contents,
      });
    }
  } catch (error) {
    console.error("❌ Error fetching page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create or Update page content ====================
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const pageType = formData.get("pageType") as string;
      const existingContent = await PageContent.findOne({ pageType });
      
      // Text fields
      const textFields = [
        "title", "titleBn", "content", "contentBn",
        "metaTitle", "metaTitleBn", "metaDescription", "metaDescriptionBn",
        "metaKeywords", "metaKeywordsBn", "email", "phone",
        "address", "addressBn", "googleMapUrl", "workingHours", "workingHoursBn",
        "mission", "missionBn", "vision", "visionBn", "history", "historyBn",
        "facebook", "twitter", "instagram", "linkedin", "youtube",
        "schemaMarkup", "canonicalUrl"
      ];
      
      const updateData: any = {};
      
      textFields.forEach(field => {
        const value = formData.get(field);
        if (value !== null) {
          updateData[field] = value.toString();
        }
      });
      
      // Handle image uploads
      const bannerImageFile = formData.get("bannerImage") as File;
      if (bannerImageFile && bannerImageFile.size > 0) {
        if (existingContent?.bannerImage) {
          await deleteOldFile(existingContent.bannerImage);
        }
        updateData.bannerImage = await saveImage(bannerImageFile, "banner");
      }
      
      const aboutImageFile = formData.get("aboutImage") as File;
      if (aboutImageFile && aboutImageFile.size > 0) {
        if (existingContent?.aboutImage) {
          await deleteOldFile(existingContent.aboutImage);
        }
        updateData.aboutImage = await saveImage(aboutImageFile, "about");
      }
      
      updateData.active = true;
      updateData.updated_at = new Date();
      
      const content = await PageContent.findOneAndUpdate(
        { pageType },
        { $set: updateData },
        { new: true, upsert: true }
      );
      
      return NextResponse.json({
        success: true,
        message: "Page content saved successfully!",
        data: content,
      });
      
    } else {
      const body = await request.json();
      const { pageType, ...updateData } = body;
      
      const content = await PageContent.findOneAndUpdate(
        { pageType },
        { $set: { ...updateData, updated_at: new Date() } },
        { new: true, upsert: true }
      );
      
      return NextResponse.json({
        success: true,
        message: "Page content saved successfully!",
        data: content,
      });
    }
  } catch (error) {
    console.error("❌ Error saving page content:", error);
    return NextResponse.json(
      { error: "Failed to save page content" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete page content ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Page content ID is required" },
        { status: 400 }
      );
    }
    
    const content = await PageContent.findById(id);
    if (!content) {
      return NextResponse.json(
        { error: "Page content not found" },
        { status: 404 }
      );
    }
    
    // Delete associated images
    if (content.bannerImage) {
      await deleteOldFile(content.bannerImage);
    }
    if (content.aboutImage) {
      await deleteOldFile(content.aboutImage);
    }
    
    await PageContent.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Page content deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting page content:", error);
    return NextResponse.json(
      { error: "Failed to delete page content" },
      { status: 500 }
    );
  }
}