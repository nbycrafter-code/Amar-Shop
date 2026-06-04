// app/api/seo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { Seo } from "@/models/seo-model";

// app/api/seo/route.ts - POST function only
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      productId,
      pageId,
      pageType = "page",
      slug,
      seoTitle,
      seoDescription,
      seoTags,
      primaryKeyword,
      secondaryKeywords,
      seoTitleBn,
      seoDescriptionBn,
      seoTagsBn,
      primaryKeywordBn,
      secondaryKeywordsBn,
      canonicalUrl,
      schemaMarkup,
      robotsMeta,
      isActive = true,
    } = body;
    
    // Prepare the data
    const updateData: any = {
      pageType,
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      seoTags: seoTags || [],
      primaryKeyword: primaryKeyword || "",
      secondaryKeywords: secondaryKeywords || [],
      seoTitleBn: seoTitleBn || "",
      seoDescriptionBn: seoDescriptionBn || "",
      seoTagsBn: seoTagsBn || [],
      primaryKeywordBn: primaryKeywordBn || "",
      secondaryKeywordsBn: secondaryKeywordsBn || [],
      canonicalUrl: canonicalUrl || "",
      schemaMarkup: schemaMarkup || null,
      robotsMeta: robotsMeta || "index,follow",
      isActive,
    };
    
    // Add fields if they exist
    if (productId && productId.trim()) {
      updateData.productId = productId;
    }
    if (pageId && pageId.trim()) {
      updateData.pageId = pageId;
    }
    if (slug && slug.trim()) {
      updateData.slug = slug;
    }
    
    let existingSeo = null;
    
    // Only try to find if pageId exists
    if (pageId && pageId.trim()) {
      existingSeo = await Seo.findOne({ pageId: pageId, pageType: pageType });
    }
    // Only try to find if productId exists
    if (productId && productId.trim()) {
      existingSeo = await Seo.findOne({ productId: productId, pageType: pageType });
    }
    
    // If found by pageId, update it
    if (existingSeo) {
      existingSeo = await Seo.findOneAndUpdate(
        { _id: existingSeo._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      // If not found by pageId, always create new
      existingSeo = await Seo.create(updateData);
    }
    
    return NextResponse.json({
      success: true,
      message: existingSeo ? "SEO data saved successfully" : "SEO data created successfully",
      data: existingSeo
    });
    
  } catch (error: any) {
    console.error("Error saving SEO data:", error);
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save SEO data" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const pageId = searchParams.get("pageId");
    const pageType = searchParams.get("pageType") || "page";
    const slug = searchParams.get("slug");
    
    // Validate: at least one identifier is required
    if (!productId && !pageId && !slug) {
      return NextResponse.json(
        { success: false, error: "Either productId, pageId, or slug is required" },
        { status: 400 }
      );
    }
    
    let query: any = { pageType, isActive: true };
    
    // Build query based on parameters
    if (productId && productId !== "null" && productId !== "undefined" && productId !== "") {
      query.productId = productId;
    }
    
    if (pageId && pageId !== "null" && pageId !== "undefined" && pageId !== "") {
      query.pageId = pageId;
    }
    
    if (slug && slug !== "null" && slug !== "undefined" && slug !== "") {
      query.slug = slug;
    }
    
    let seo = await Seo.findOne(query);
    
    return NextResponse.json({
      success: true,
      data: seo || null
    });
    
  } catch (error: any) {
    console.error("Error fetching SEO data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch SEO data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const pageId = searchParams.get("pageId");
    const pageType = searchParams.get("pageType") || "page";
    
    if (!productId && !pageId) {
      return NextResponse.json(
        { success: false, error: "Either productId or pageId is required for deletion" },
        { status: 400 }
      );
    }
    
    let query: any = { pageType };
    
    if (productId && productId !== "null" && productId !== "undefined" && productId !== "") {
      query.productId = productId;
    }
    
    if (pageId && pageId !== "null" && pageId !== "undefined" && pageId !== "") {
      query.pageId = pageId;
    }
    
    const result = await Seo.deleteOne(query);
    
    return NextResponse.json({
      success: true,
      message: "SEO data deleted successfully",
      deleted: result.deletedCount > 0
    });
    
  } catch (error: any) {
    console.error("Error deleting SEO data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete SEO data" },
      { status: 500 }
    );
  }
}