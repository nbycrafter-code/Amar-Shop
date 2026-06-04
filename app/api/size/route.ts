// app/api/size/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSizeDetails } from "@/queries/sizes";
import { 
  createSizeQuery, 
  updateSizeQuery, 
  deleteSizeQuery, 
  toggleSizeStatusQuery 
} from "@/queries/sizes";

// ==================== POST: Create or Update Size ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, sizeId } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Enter a size value" },
        { status: 400 }
      );
    }

    const sizeData = {
      name: name,
      slug: slug,
    };

    if (!sizeId || sizeId === "null" || sizeId === "undefined") {
      const newSize = await createSizeQuery(sizeData);
      // console.log("✅ Size Created:", newSize);
      return NextResponse.json({
        success: true,
        message: "Size created successfully!",
        data: newSize,
      });
    } else {
      const updatedSize = await updateSizeQuery(sizeId, sizeData);
      // console.log("♻️ Size Updated:", updatedSize);
      return NextResponse.json({
        success: true,
        message: "Size updated successfully!",
        data: updatedSize,
      });
    }
  } catch (error) {
    // console.error("❌ Error in POST /api/size:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process size request" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a size by ID ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Size ID is required" },
        { status: 400 }
      );
    }

    const size = await getSizeDetails(id);

    await deleteSizeQuery(id);
    // console.log("✅ Size deleted:", id);

    return NextResponse.json({
      success: true,
      message: "Size deleted successfully",
    });
  } catch (error) {
    // console.error("❌ Error in DELETE /api/size:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete size" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update size status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Size ID is required" },
        { status: 400 }
      );
    }

    const size = await getSizeDetails(id);
    if (!size) {
      return NextResponse.json(
        { error: "Size not found" },
        { status: 404 }
      );
    }

    const updatedSize = await toggleSizeStatusQuery(id, !size.active);
    // console.log("♻️ Size status updated for:", id, "New status:", updatedSize?.active);

    return NextResponse.json({
      success: true,
      message: "Size status updated successfully",
      active: updatedSize?.active,
    });
  } catch (error) {
    // console.error("❌ Error in PATCH /api/size:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update size status" },
      { status: 500 }
    );
  }
}

// ==================== GET: Fetch size(s) ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      const size = await getSizeDetails(id);
      if (!size) {
        return NextResponse.json(
          { error: "Size not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: size,
      });
    } else {
      const { getSizes } = await import("@/queries/sizes");
      const sizes = await getSizes();
      return NextResponse.json({
        success: true,
        data: sizes,
      });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/size:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch sizes" },
      { status: 500 }
    );
  }
}