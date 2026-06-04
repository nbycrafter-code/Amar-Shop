// app/api/user/profile-image/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    await dbConnect();

    // Get current user to find old profile image
    const currentUser = await User.findOne({ email: session.user.email });
    
    // Delete old profile image if exists
    if (currentUser?.image) {
      try {
        const oldImagePath = path.join(process.cwd(), "public", currentUser.image);
        if (existsSync(oldImagePath)) {
          await unlink(oldImagePath);
          console.log("Old profile image deleted:", oldImagePath);
        }
      } catch (deleteError) {
        console.error("Error deleting old image:", deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    // Remove special characters from email for filename
    const safeEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${safeEmail}-${timestamp}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Save to database
    const imageUrl = `/uploads/profiles/${filename}`;
    
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          image: imageUrl,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ 
      success: true, 
      image: imageUrl,
      message: "Profile image updated successfully"
    });
    
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// Add DELETE method to the same file (app/api/user/profile-image/route.ts)

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete old profile image if exists
    if (currentUser.image) {
      try {
        const oldImagePath = path.join(process.cwd(), "public", currentUser.image);
        if (existsSync(oldImagePath)) {
          await unlink(oldImagePath);
          console.log("Profile image deleted:", oldImagePath);
        }
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    // Remove image from database
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          image: null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Profile image removed successfully"
    });
    
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}