import { NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";
import { sendVerificationEmail } from "@/lib/email";
import { generateEncryptedToken } from "@/lib/encryption";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email } = body;

    let userEmail = email;
    let oldToken = token;

    // যদি টোকেন থেকে ইমেইল বের করা হয়
    if (token && !email) {
      try {
        // এখানে আপনার ডিক্রিপ্ট ফাংশন ব্যবহার করুন
        const { decryptToken } = await import('@/lib/encryption');
        const decryptedData = decryptToken(decodeURIComponent(token));
        userEmail = decryptedData.email;
      } catch (error) {
        console.error("Token decryption error:", error);
        return NextResponse.json(
          { error: "Invalid verification token" },
          { status: 400 }
        );
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Generate নতুন OTP
    const newOtp = generateOTP();
    const newOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Generate নতুন encrypted token
    const newEncryptedToken = generateEncryptedToken(userEmail, newOtp);

    // ডাটাবেজ আপডেট করুন নতুন OTP দিয়ে
    user.verificationCode = newOtp;
    user.verificationCodeExpires = newOtpExpires;
    await user.save();

    console.log("New OTP generated for:", userEmail, "OTP:", newOtp);

    // নতুন ভেরিফিকেশন ইমেইল পাঠান
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${encodeURIComponent(newEncryptedToken)}`;
    await sendVerificationEmail(user.email, newOtp, user.name, verificationUrl);

    // রেসপন্সে নতুন টোকেন ও মেসেজ দিন
    return NextResponse.json({
      success: true,
      message: "New verification code sent to your email",
      newToken: newEncryptedToken, // নতুন টোকেন ফ্রন্টএন্ডে পাঠান
      email: userEmail
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to resend verification code" },
      { status: 500 }
    );
  }
}