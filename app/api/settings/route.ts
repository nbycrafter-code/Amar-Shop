// app/api/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Settings } from "@/models/settings-model";
import fs from "fs";
import path from "path";
import { dbConnect } from "@/service/mongo";
import { themePresets } from "@/lib/themePresets";

// Helper function to save image
async function saveImage(file: File, type: string): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const originalName = file.name;
    const extension = originalName.split('.').pop()?.toLowerCase() || 'png';
    const filename = `${type}-${timestamp}-${randomString}.${extension}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads/settings/");
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, buffer);
    
    return `/uploads/settings/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save image");
  }
}

// Helper function to delete old image
async function deleteOldImage(imageUrl: string) {
  if (!imageUrl) return;
  
  try {
    if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
      return;
    }
    
    const oldImagePath = path.join(process.cwd(), "public", imageUrl);
    if (fs.existsSync(oldImagePath)) {
      await fs.promises.unlink(oldImagePath);
      console.log(`Deleted old image: ${oldImagePath}`);
    }
  } catch (error) {
    console.error("Error deleting old image:", error);
  }
}

// Default settings object
const defaultSettings = {
  siteName: "My Store",
  siteNameBn: "মাই স্টোর",
  siteTitle: "My Store - Best Online Shop",
  siteTitleBn: "মাই স্টোর - সেরা অনলাইন শপ",
  siteDescription: "Your one-stop shop for all your needs",
  siteDescriptionBn: "আপনার সকল চাহিদার জন্য একক শপ",
  favicon: "",
  logo: "",
  footerLogo: "",
  footerText: "Your trusted online store",
  footerTextBn: "আপনার বিশ্বস্ত অনলাইন স্টোর",
  copyright: "© 2024 All rights reserved",
  copyrightBn: "© ২০২৪ সর্বস্বত্ব সংরক্ষিত",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  tiktok: "",
  youtube: "",
  whatsapp: "",
  email: "",
  phone: "",
  address: "",
  addressBn: "",
  metaKeywords: "online store, ecommerce, shopping",
  metaKeywordsBn: "অনলাইন স্টোর, ইকমার্স, শপিং",
  googleAnalyticsId: "",
  facebookPixelId: "",
  activeTheme: "modern",
  fontFamily: "Inter",
  baseFontSize: "16px",
  layoutStyle: "full",
  customCSS: "",
  customJS: "",
  ...themePresets.modern,
  active: true,
};

// ==================== GET: Fetch settings ====================
export async function GET() {
  try {
    await dbConnect();
    
    let settings = await Settings.findOne({ active: true });
    
    if (!settings) {
      settings = await Settings.create({
        ...defaultSettings,
        created_at: new Date(),
        updated_at: new Date(),
      });
      
      console.log("Created default settings");
    }
    
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch settings",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// ==================== POST: Create or Update settings ====================
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const contentType = request.headers.get("content-type");
    let updateData: any = {};
    let oldSettings = await Settings.findOne({ active: true });
    
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      
      // Check if theme is being activated
      const activeTheme = formData.get("activeTheme")?.toString();
      const isThemeChange = activeTheme && oldSettings?.activeTheme !== activeTheme;
      
      // If theme is being changed, apply theme preset
      if (isThemeChange && themePresets[activeTheme]) {
        console.log(`🔄 Applying theme preset: ${activeTheme}`);
        
        // Apply all theme preset settings
        const themeSettings = themePresets[activeTheme];
        
        // Add theme settings to updateData
        Object.keys(themeSettings).forEach(key => {
          updateData[key] = themeSettings[key];
        });
        
        // Also set the active theme
        updateData.activeTheme = activeTheme;
      }
      
      // Complete text fields list
      const textFields = [
        "siteName", "siteNameBn", "siteTitle", "siteTitleBn",
        "siteDescription", "siteDescriptionBn",
        "footerText", "footerTextBn", "copyright", "copyrightBn",
        "facebook", "twitter", "instagram", "linkedin", "tiktok", 
        "youtube", "whatsapp",
        "email", "phone", "address", "addressBn",
        "metaKeywords", "metaKeywordsBn", "googleAnalyticsId", "facebookPixelId",
        "primaryColor", "secondaryColor", "backgroundColor", "textColor",
        "gradientStart", "gradientEnd", "gradientDirection", "borderColor",
        "cardBackground", "headingColor",
        "fontFamily", "baseFontSize", "layoutStyle", "borderRadius",
        "buttonStyle", "cardStyle",
        "customCSS", "customJS",
        "accentColor", "textSecondary", "textMuted", "borderHover",
        "dividerColor", "headerBackground", "footerBackground",
        "headerStyle", "footerStyle", "hoverEffect",
        "buttonPrimary", "buttonPrimaryHover", "buttonSecondary",
        "buttonSecondaryHover", "buttonDanger", "buttonWarning", "buttonSuccess",
        "linkColor", "linkHover", "hoverBackground",
        "successColor", "errorColor", "warningColor", "infoColor",
        "gray50", "gray100", "gray200", "gray300", "gray400",
        "gray500", "gray600", "gray700", "gray800", "gray900"
      ];
      
      // Only process text fields if not overwritten by theme
      textFields.forEach(field => {
        // Skip if already set by theme (for theme change)
        if (isThemeChange && updateData[field] !== undefined) {
          return;
        }
        
        const value = formData.get(field);
        if (value !== null && value.toString().trim() !== "") {
          updateData[field] = value.toString().trim();
        } else if (value !== null && value.toString() === "") {
          updateData[field] = "";
        }
      });
      
      // Handle image uploads (keep existing if not changed)
      const imageFields = ["favicon", "logo", "footerLogo"];
      
      for (const field of imageFields) {
        const file = formData.get(field);
        
        if (file instanceof File && file.size > 0) {
          if (oldSettings && oldSettings[field]) {
            await deleteOldImage(oldSettings[field]);
          }
          const imageUrl = await saveImage(file, field);
          updateData[field] = imageUrl;
        } else if (typeof file === 'string') {
          updateData[field] = file;
        } else if (file === null && oldSettings && oldSettings[field]) {
          updateData[field] = oldSettings[field];
        }
      }
      
      // If theme changed, log the applied colors
      if (isThemeChange) {
        console.log(`✅ Theme "${activeTheme}" applied successfully`);
        console.log(`📊 Primary color: ${updateData.primaryColor}`);
        console.log(`📊 Secondary color: ${updateData.secondaryColor}`);
      }
      
    } else {
      const body = await request.json();
      updateData = { ...body };
      
      // Check if theme is being activated via JSON
      const activeTheme = body.activeTheme;
      const isThemeChange = activeTheme && oldSettings?.activeTheme !== activeTheme;
      
      if (isThemeChange && themePresets[activeTheme]) {
        console.log(`🔄 Applying theme preset via JSON: ${activeTheme}`);
        
        // Apply all theme preset settings, overriding any individual color fields
        const themeSettings = themePresets[activeTheme];
        
        // Merge theme settings with the update data (theme settings take precedence for colors)
        updateData = {
          ...updateData,
          ...themeSettings,
          activeTheme: activeTheme,
        };
        
        console.log(`✅ Theme "${activeTheme}" applied via JSON`);
      }
    }
    
    updateData.updated_at = new Date();
    
    const settings = await Settings.findOneAndUpdate(
      { active: true },
      { $set: updateData },
      { 
        new: true, 
        upsert: true,
        runValidators: false
      }
    );
    
    return NextResponse.json({
      success: true,
      message: "Settings saved successfully!",
      data: settings,
      themeApplied: updateData.activeTheme ? true : false,
    });
  } catch (error) {
    console.error("❌ Error saving settings:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to save settings",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update specific setting ====================
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) {
      return NextResponse.json(
        { 
          success: false,
          error: "Setting key is required" 
        },
        { status: 400 }
      );
    }
    
    // Special handling for theme activation
    if (key === "activeTheme" && themePresets[value]) {
      console.log(`🔄 Activating theme: ${value} via PUT`);
      
      // Get current settings
      const currentSettings = await Settings.findOne({ active: true });
      
      if (currentSettings) {
        // Apply all theme preset settings
        const themeSettings = themePresets[value];
        
        // Update with all theme colors
        const updateData = {
          ...themeSettings,
          activeTheme: value,
          updated_at: new Date(),
        };
        
        const settings = await Settings.findOneAndUpdate(
          { active: true },
          { $set: updateData },
          { new: true }
        );
        
        console.log(`✅ Theme "${value}" activated with all preset colors`);
        
        return NextResponse.json({
          success: true,
          message: `Theme "${value}" activated successfully!`,
          data: settings,
        });
      }
    }
    
    const updateData: any = {};
    updateData[key] = value;
    updateData.updated_at = new Date();
    
    const settings = await Settings.findOneAndUpdate(
      { active: true },
      { $set: updateData },
      { new: true }
    );
    
    if (!settings) {
      const newSettings = await Settings.create({
        ...defaultSettings,
        [key]: value,
        created_at: new Date(),
        updated_at: new Date(),
      });
      
      return NextResponse.json({
        success: true,
        message: "Setting created successfully!",
        data: newSettings,
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Setting updated successfully!",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error updating setting:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update setting",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Reset to default settings ====================
export async function DELETE() {
  try {
    await dbConnect();
    
    const existingSettings = await Settings.findOne({ active: true });
    if (existingSettings) {
      const imageFields = ["favicon", "logo", "footerLogo"];
      for (const field of imageFields) {
        if (existingSettings[field]) {
          await deleteOldImage(existingSettings[field]);
        }
      }
    }
    
    await Settings.deleteMany({});
    
    const defaultSettingsData = await Settings.create({
      ...defaultSettings,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    console.log("🔄 Settings reset to default (modern theme)");
    
    return NextResponse.json({
      success: true,
      message: "Settings reset to default!",
      data: defaultSettingsData,
    });
  } catch (error) {
    console.error("❌ Error resetting settings:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to reset settings",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}