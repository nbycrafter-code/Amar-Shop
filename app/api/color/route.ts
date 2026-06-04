// app/api/color/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Color } from "@/models/color-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getSlug } from "@/lib/convertData";
import { 
  createColorQuery, 
  updateColorQuery, 
  deleteColorQuery, 
  toggleColorStatusQuery,
  getColorDetails,
  getColors
} from "@/queries/colors";

// Types
interface ColorData {
  name: string;
  nameBn: string;
  hex: string;
  slug: string;
  active?: boolean;
}

// ==================== GET: Fetch color(s) ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      // Get single color by ID using query
      const color = await getColorDetails(id);
      if (!color) {
        return NextResponse.json(
          { error: "Color not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: color,
      });
    } else {
      // Get all colors using query
      const colors = await getColors();
      return NextResponse.json({
        success: true,
        data: colors,
      });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/color:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch colors" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create a new color ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameBn, hex } = body;

    // Validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Color name (English) is required" },
        { status: 400 }
      );
    }

    if (!nameBn || nameBn.trim() === "") {
      return NextResponse.json(
        { error: "Color name (Bangla) is required" },
        { status: 400 }
      );
    }

    if (!hex || hex.trim() === "") {
      return NextResponse.json(
        { error: "Color hex code is required" },
        { status: 400 }
      );
    }

    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hex)) {
      return NextResponse.json(
        { error: "Invalid hex color code. Use format: #RRGGBB" },
        { status: 400 }
      );
    }

    // Check if color already exists
    const existingColor = await Color.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } },
        { hex: hex.toUpperCase() }
      ]
    }).lean();

    if (existingColor) {
      return NextResponse.json(
        { error: "Color with this name or hex code already exists" },
        { status: 409 }
      );
    }

    // Prepare color data
    const slug = getSlug(name.trim());
    
    // Check if slug already exists
    const existingSlug = await Color.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json(
        { error: "Color with similar name already exists" },
        { status: 409 }
      );
    }

    const colorData: ColorData = {
      name: name.trim(),
      nameBn: nameBn.trim(),
      hex: hex.toUpperCase(),
      slug: slug,
      active: true,
    };

    // Create new color using query
    const newColor = await createColorQuery(colorData);
    console.log("✅ Color Created:", newColor);

    return NextResponse.json({
      success: true,
      message: "Color created successfully!",
      data: newColor,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/color:", error);
    // Check for duplicate key error
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Color with this name or hex code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create color" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update an existing color ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, nameBn, hex } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Color ID is required" },
        { status: 400 }
      );
    }

    // Check if color exists
    const existingColor = await getColorDetails(id);
    if (!existingColor) {
      return NextResponse.json(
        { error: "Color not found" },
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
    
    if (hex && hex.trim()) {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(hex)) {
        return NextResponse.json(
          { error: "Invalid hex color code" },
          { status: 400 }
        );
      }
      updateData.hex = hex.toUpperCase();
    }
    
    updateData.updated_at = new Date();

    // Update color using query
    const updatedColor = await updateColorQuery(id, updateData);

    if (!updatedColor) {
      return NextResponse.json(
        { error: "Color not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Color Updated:", updatedColor);

    return NextResponse.json({
      success: true,
      message: "Color updated successfully!",
      data: updatedColor,
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/color:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Color with this name or hex code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update color" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a color by ID ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Color ID is required" },
        { status: 400 }
      );
    }

    // Delete color using query
    const deleted = await deleteColorQuery(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Color not found" },
        { status: 404 }
      );
    }

    console.log("✅ Color deleted:", id);

    return NextResponse.json({
      success: true,
      message: "Color deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/color:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete color" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update color status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Color ID is required" },
        { status: 400 }
      );
    }

    // Toggle color status using query
    const updatedColor = await toggleColorStatusQuery(id, active !== undefined ? active : false);

    if (!updatedColor) {
      return NextResponse.json(
        { error: "Color not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Color status updated for:", id, "New status:", updatedColor.active);

    return NextResponse.json({
      success: true,
      message: "Color status updated successfully",
      active: updatedColor.active,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/color:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update color status" },
      { status: 500 }
    );
  }
}