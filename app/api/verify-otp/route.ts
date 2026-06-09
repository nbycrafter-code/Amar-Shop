// app/api/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { decryptToken } from "@/lib/encryption";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, otp } = body;

    // Check if token is provided
    if (!token && !otp) {
      return NextResponse.json(
        { error: "Token or OTP is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    let email = null;
    let verificationCode = null;

    // If token is provided, decode it
    if (token) {
      try {
        // Decode the token to get email and OTP
        const decryptedData = decryptToken(decodeURIComponent(token));
        email = decryptedData.email;
        verificationCode = decryptedData.otp;
        
        console.log("Token decoded successfully:", { email, otp: verificationCode });
      } catch (decodeError) {
        console.error("Token decode error:", decodeError);
        return NextResponse.json(
          { error: "Invalid or expired verification token" },
          { status: 400 }
        );
      }
    } else if (otp) {
      // If only OTP is provided, we need email from request
      const { email: userEmail } = body;
      if (!userEmail) {
        return NextResponse.json(
          { error: "Email is required with OTP" },
          { status: 400 }
        );
      }
      email = userEmail;
      verificationCode = otp;
    }

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Find user with valid OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: verificationCode,
      verificationCodeExpires: { $gt: new Date() }, // Not expired
    }).select('+verificationCode +verificationCodeExpires');

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    console.log("User verified successfully:", user.email);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now login.",
      email: user.email,
      role: user.role,
      verified: true
    });

  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
