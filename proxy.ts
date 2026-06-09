// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['en', 'bn'];
const defaultLocale = 'en';

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
  "/brands",
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
const DASHBOARD = "/dashboard";

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

function getPathWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (locale) {
    const newPath = pathname.replace(`/${locale}`, '') || '/';
    return newPath;
  }
  return pathname;
}

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathLocale = getLocaleFromPath(pathname);
  const cookieLang = request.cookies.get('language')?.value;
  const preferredLocale =
    cookieLang && locales.includes(cookieLang) ? cookieLang : defaultLocale;

  // ─────────────────────────────────────────────
  // CASE 1: No locale in path
  // ─────────────────────────────────────────────
  if (!pathLocale) {
    const newPathname = pathname === '/' ? '' : pathname;

    if (preferredLocale === 'bn') {
      return NextResponse.redirect(new URL(`/bn${newPathname}`, request.url));
    } else {
      // en → rewrite to /en/... internally, URL একই থাকবে
      const rewriteTarget = `/en${newPathname === '' ? '/' : newPathname}`;
      const response = NextResponse.rewrite(new URL(rewriteTarget, request.url));
      if (!request.cookies.get('language')) {
        response.cookies.set('language', 'en', {
          path: '/',
          maxAge: 365 * 24 * 60 * 60,
          sameSite: 'lax',
        });
      }
      return response;
    }
  }

  // ─────────────────────────────────────────────
  // CASE 2: Valid locale in path
  // ─────────────────────────────────────────────
  if (locales.includes(pathLocale)) {
    const pathWithoutLocale = getPathWithoutLocale(pathname);

    // ✅ NEW: /en/... → clean URL এ redirect
    if (pathLocale === 'en') {
      const cleanUrl = pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
      const response = NextResponse.redirect(new URL(cleanUrl, request.url));
      // Cookie সেট করুন redirect এর সাথে
      response.cookies.set('language', 'en', {
        path: '/',
        maxAge: 365 * 24 * 60 * 60,
        sameSite: 'lax',
      });
      return response;
    }

    // bn এর জন্য auth checks
    try {
      const session = await auth();
      const isAuthenticated = !!session?.user;

      const isPublicRoute = PUBLIC_ROUTES.some(
        (route) =>
          pathWithoutLocale === route ||
          pathWithoutLocale.startsWith(route + "/")
      );

      const isProtectedRoute =
        pathWithoutLocale.startsWith("/dashboard") ||
        pathWithoutLocale.startsWith("/my-account") ||
        pathWithoutLocale === "/checkout";

      if (isProtectedRoute && !isPublicRoute && !isAuthenticated) {
        const loginUrl = new URL(`/${pathLocale}${LOGIN}`, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (pathWithoutLocale.startsWith("/admin")) {
        if (!isAuthenticated) {
          const loginUrl = new URL(`/${pathLocale}${LOGIN}`, request.url);
          loginUrl.searchParams.set("callbackUrl", pathname);
          return NextResponse.redirect(loginUrl);
        }
        if (session?.user?.role !== "admin") {
          return NextResponse.redirect(new URL(`/${pathLocale}`, request.url));
        }
      }

      if (isAuthenticated && pathWithoutLocale === LOGIN) {
        return NextResponse.redirect(
          new URL(`/${pathLocale}${DASHBOARD}`, request.url)
        );
      }
    } catch (error) {
      console.error("Auth error:", error);
    }

    const response = NextResponse.next();
    if (!request.cookies.get('language')) {
      response.cookies.set('language', pathLocale, {
        path: '/',
        maxAge: 365 * 24 * 60 * 60,
        sameSite: 'lax',
      });
    }
    return response;
  }

  // ─────────────────────────────────────────────
  // CASE 3: Invalid locale → fallback
  // ─────────────────────────────────────────────
  return NextResponse.redirect(new URL(`/`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)',],
};