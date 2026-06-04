// app/api/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Settings } from "@/models/settings-model";
import fs from "fs";
import path from "path";

// Helper function to save image
async function saveImage(file: File, type: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'png';
  const filename = `${type}-${timestamp}-${randomString}.${extension}`;
  
  const uploadDir = path.join(process.cwd(), "public/uploads/settings/");
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/uploads/settings/${filename}`;
}

// Helper function to delete old image
async function deleteOldImage(imageUrl: string) {
  if (imageUrl && !imageUrl.startsWith('http')) {
    const oldImagePath = path.join(process.cwd(), "public", imageUrl);
    if (fs.existsSync(oldImagePath)) {
      await fs.promises.unlink(oldImagePath);
    }
  }
}

// ==================== GET: Fetch settings ====================
export async function GET() {
  try {    
    let settings = await Settings.findOne({ active: true });
    
    if (!settings) {
      // Create default settings if none exists
      settings = await Settings.create({
        siteName: "My Store",
        siteNameBn: "মাই স্টোর",
        siteTitle: "My Store - Best Online Shop",
        siteTitleBn: "মাই স্টোর - সেরা অনলাইন শপ",
        active: true,
      });
    }
    
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create or Update settings ====================
export async function POST(request: NextRequest) {
  try {    
    const contentType = request.headers.get("content-type");
    let updateData: any = {};
    let oldSettings = await Settings.findOne({ active: true });
    
    if (contentType?.includes("multipart/form-data")) {
      // Handle form data with file uploads
      const formData = await request.formData();
      
      // Text fields
      const textFields = [
        "siteName", "siteNameBn", "siteTitle", "siteTitleBn",
        "siteDescription", "siteDescriptionBn", "footerText", "footerTextBn",
        "copyright", "copyrightBn", "facebook", "twitter", "instagram",
        "linkedin", "tiktok", "youtube", "whatsapp", "email", "phone",
        "address", "addressBn", "metaKeywords", "metaKeywordsBn",
        "googleAnalyticsId", "facebookPixelId", "primaryColor", "secondaryColor"
      ];
      
      textFields.forEach(field => {
        const value = formData.get(field);
        if (value && value.toString().trim()) {
          updateData[field] = value.toString().trim();
        }
      });
      
      // Handle image uploads
      const imageFields = ["favicon", "logo", "footerLogo"];
      
      for (const field of imageFields) {
        const file = formData.get(field) as File;
        if (file && file.size > 0) {
          // Delete old image if exists
          if (oldSettings && oldSettings[field]) {
            await deleteOldImage(oldSettings[field]);
          }
          // Save new image
          const imageUrl = await saveImage(file, field);
          updateData[field] = imageUrl;
        }
      }
      
    } else {
      // Handle JSON data
      const body = await request.json();
      updateData = body;
    }
    
    updateData.updated_at = new Date();
    
    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      { active: true },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "Settings saved successfully!",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update specific setting ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) {
      return NextResponse.json(
        { error: "Setting key is required" },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    updateData[key] = value;
    updateData.updated_at = new Date();
    
    const settings = await Settings.findOneAndUpdate(
      { active: true },
      { $set: updateData },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: "Setting updated successfully!",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error updating setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Reset to default settings ====================
export async function DELETE() {
  try {    
    // Delete all settings
    await Settings.deleteMany({});
    
    // Create default settings
    const defaultSettings = await Settings.create({
      siteName: "My Store",
      siteNameBn: "মাই স্টোর",
      siteTitle: "My Store - Best Online Shop",
      siteTitleBn: "মাই স্টোর - সেরা অনলাইন শপ",
      active: true,
    });
    
    return NextResponse.json({
      success: true,
      message: "Settings reset to default!",
      data: defaultSettings,
    });
  } catch (error) {
    console.error("❌ Error resetting settings:", error);
    return NextResponse.json(
      { error: "Failed to reset settings" },
      { status: 500 }
    );
  }
}