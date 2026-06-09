import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";
import { generateEncryptedToken } from "@/lib/encryption";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, language } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        const encryptedToken = generateEncryptedToken(email, otp);

        existingUser.verificationCode = otp;
        existingUser.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        existingUser.verificationToken = encodeURIComponent(encryptedToken);
        await existingUser.save();

        const verificationUrl = language === 'bn' ? `/bn/verify-email?token=${encodeURIComponent(encryptedToken)}` : `/verify-email?token=${encodeURIComponent(encryptedToken)}`;
        await sendVerificationEmail(existingUser.email, otp, existingUser.name, `${process.env.NEXTAUTH_URL}${verificationUrl}`);

        return NextResponse.json({
          message: "Verification code resent to your email",
          email: existingUser.email,
          redirectUrl: verificationUrl, // রিডাইরেক্ট URL
          requiresVerification: true
        });
      }

      return NextResponse.json(
        { error: "User already exists and is verified" },
        { status: 409 }
      );
    }

    const otp = generateOTP();
    const encryptedToken = generateEncryptedToken(email, otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
      isActive: true,
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpires: otpExpires,
      verificationToken: encryptedToken,
    });

    const verificationUrl = language === 'bn' ? `/bn/verify-email?token=${encodeURIComponent(encryptedToken)}` : `/verify-email?token=${encodeURIComponent(encryptedToken)}`;
    await sendVerificationEmail(user.email, otp, user.name, `${process.env.NEXTAUTH_URL}${verificationUrl}`);

    return NextResponse.json({
      message: "Registration successful! Please verify your email.",
      email: user.email,
      redirectUrl: verificationUrl, // রিডাইরেক্ট URL
      requiresVerification: true
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}