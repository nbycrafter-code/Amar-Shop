import { NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";
import { decryptToken } from "@/lib/encryption";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, otp, email: providedEmail } = body;

    console.log("Verification request received:", { token: !!token, otp, providedEmail });
    console.log("Decrypted OTP:", decryptToken(decodeURIComponent(token)));

    let email = null;
    let verifiedOtp = null;

    if (token) {
      try {
        const decryptedData = decryptToken(decodeURIComponent(token));
        email = decryptedData.email;
        verifiedOtp = otp;
        console.log("Token decrypted successfully for:", email);
      } catch (error) {
        console.error("Token decryption error:", error);
        return NextResponse.json(
          { error: error.message || "Invalid or expired verification link" },
          { status: 400 }
        );
      }
    } else if (otp && otp.length === 6) {
      if (!providedEmail) {
        return NextResponse.json(
          { error: "Email is required for OTP verification" },
          { status: 400 }
        );
      }
      email = providedEmail;
      verifiedOtp = otp;
    } else {
      return NextResponse.json(
        { error: "Invalid verification request" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // ইউজার খোঁজা
    const user = await User.findOne({
      email: email.toLowerCase(),
      isVerified: false
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found or already verified" },
        { status: 404 }
      );
    }

    console.log("User found:", user.email);
    console.log("Stored OTP:", user.verificationCode);
    console.log("Provided OTP:", verifiedOtp);
    console.log("OTP Expires:", user.verificationCodeExpires);
    console.log("Verification Token:", user.verificationToken);
    console.log("Verification Provided Token:", token);
    console.log("Current time:", new Date());

    // চেক করুন OTP ম্যাচ করে কিনা
    if (user.verificationCode !== verifiedOtp) {
      console.log("OTP mismatch");
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // চেক করুন OTP এক্সপায়ার হয়েছে কিনা
    if (user.verificationCodeExpires && new Date() > user.verificationCodeExpires) {
      console.log("OTP expired");
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (user.verificationToken !== token) {
      console.log("Verification token mismatch");
      return NextResponse.json(
        { error: "Invalid verification token. Please check and try again." },
        { status: 400 }
      );
    }

    // সবকিছু ঠিক থাকলে ইউজার ভেরিফাই করুন
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.verificationToken = undefined;
    await user.save();

    console.log("User verified successfully:", user.email);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now login.",
      verified: true,
      email: user.email,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}