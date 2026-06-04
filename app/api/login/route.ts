import { NextRequest, NextResponse } from "next/server";
import { auth, signIn } from "@/auth";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json() as { email: string; password: string };
  await dbConnect();

  try {
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    const user = await User.findOne({ email }).select('name role').lean();

    return NextResponse.json({
      success: true,
      user:user,
      message: "Login success!"
    });
  } catch (e) {
    // console.log(e);
    const error = e as Error;
    return new NextResponse(error.message, {
      status: 201,
    });
  }
};