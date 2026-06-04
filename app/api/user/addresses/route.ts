import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      billingAddress: user.billingAddress || null,
      shippingAddress: user.shippingAddress || null,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, address } = body;

    if (!type || !address) {
      return NextResponse.json(
        { success: false, error: "Type and address are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: any = {};
    if (type === "billing") {
      updateData.billingAddress = address;
    } else if (type === "shipping") {
      updateData.shippingAddress = address;
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Address saved successfully",
    });
  } catch (error) {
    console.error("Error saving address:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save address" },
      { status: 500 }
    );
  }
}