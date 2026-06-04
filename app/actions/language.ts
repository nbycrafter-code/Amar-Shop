// app/actions/language.ts
"use server";

import { cookies } from "next/headers";

type Lang = "bn" | "en";

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 বছর
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

/** Language cookie সেট করা */
export async function setLanguageCookie(lang: Lang, _currentPath?: string) {
  if (lang !== "bn" && lang !== "en") {
    return { success: false, error: "Invalid language code" };
  }

  const cookieStore = await cookies();
  cookieStore.set("language", lang, COOKIE_OPTIONS);

  return { success: true, language: lang };
}

/** Language cookie পড়া */
export async function getLanguageCookie(): Promise<Lang> {
  const cookieStore = await cookies();
  const value = cookieStore.get("language")?.value;
  if (value === "bn" || value === "en") return value;
  return "bn"; // default
}