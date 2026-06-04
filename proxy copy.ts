// proxy.ts (Using your actual /dashboard page)
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/email-verification",
  "/verify-email",
  "/verify-otp",
  "/two-factor-auth",
  "/product",
  "/products",
  "/categories",
  "/product-category",
  "/offers",
  "/new-arrival",
  "/cart",
  "/checkout",
  "/order-success",
  "/order-tracking",
  "/about",
  "/contact",
  "/blog",
  "/terms",
  "/press",
  "/careers",
  "/delivery",
  "/service",
  "/return-policy",
  "/security",
  "/sitemap",
  "/faqs",
];

const LOGIN = "/login";
const DASHBOARD = "/dashboard"; // আপনার আসল ড্যাশবোর্ড পেজ

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;

  try {
    const session = await auth();
    const isAuthenticated = !!session?.user;

    // Allow API routes and static files
    if (nextUrl.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    // Allow static files
    if (nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$/)) {
      return NextResponse.next();
    }

    // Home page
    if (nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    // Check if route is public
    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) =>
        nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"),
    );

    // Redirect unauthenticated users to login
    if (!isAuthenticated && !isPublicRoute) {
      const loginUrl = new URL(LOGIN, nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login page
    if (isAuthenticated && nextUrl.pathname === LOGIN) {
      return NextResponse.redirect(new URL(DASHBOARD, nextUrl));
    }

    // Protect user account routes (if you have /my-account folder)
    if (nextUrl.pathname.startsWith("/my-account")) {
      if (!isAuthenticated) {
        const loginUrl = new URL(LOGIN, nextUrl);
        return NextResponse.redirect(loginUrl);
      }
    }

    // /dashboard এ কোনো রিডাইরেক্ট করবেন না - সরাসরি পেজ দেখান
    if (nextUrl.pathname === DASHBOARD) {
      if (!isAuthenticated) {
        const loginUrl = new URL(LOGIN, nextUrl);
        return NextResponse.redirect(loginUrl);
      }
      // শুধু অথেনটিকেটেড চেক করুন, কোনো রিডাইরেক্ট নয়
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\..*|_next/static|_next/image|images|assets).*)",
  ],
};