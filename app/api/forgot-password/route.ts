import { NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request) {
  try {
    console.log("1. Forgot password API called");
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // For security, always return success even if user not found
    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { 
          message: "If an account exists with this email, you will receive a password reset link." 
        },
        { status: 200 }
      );
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour
    
    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    
    console.log("Reset token generated for user:", user.email);
    
    // Send email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.name
    );
    
    if (emailResult.success) {
      console.log("Reset email sent successfully");
      return NextResponse.json({
        message: "Password reset link sent to your email address."
      });
    } else {
      console.error("Failed to send email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}