// app/layout.tsx
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "./context/AppContext";
import LayoutSet from "./LayoutSet";
import { dbConnect } from "@/service/mongo";
import { SessionProvider } from "next-auth/react";
import { getCategoriesWithSubCategory } from "@/queries/categories";
import { getSetting } from "@/queries/settings";
import { auth } from "@/auth";
import { LanguageProvider } from "@/context/LanguageContext";
import { cookies } from 'next/headers';
import { getHomeSeoMetadata } from "@/lib/seo-metadata";
import { JsonLd } from "../../components/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');
  const language = languageCookie?.value || 'en';

  const seoResult = await getHomeSeoMetadata('home', language);
  const { jsonLd, ...metadata } = seoResult;

  return metadata;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await dbConnect();
  const session = await auth();
  const settings = await getSetting();
  const cookieStore = await cookies();
  const categories = await getCategoriesWithSubCategory();

  const languageCookie = cookieStore.get('language');
  const serverLanguage = languageCookie?.value || 'en';

  const seoResult = await getHomeSeoMetadata('home', serverLanguage);

  return (
    <html lang={serverLanguage}>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <LanguageProvider>
            <AppProvider>
              {settings.activeTheme === 'classic' ? (
                children
              ) : (
                <LayoutSet session={session} settings={settings} categories={categories}>
                  {seoResult.jsonLd && <JsonLd data={seoResult.jsonLd} />}
                  {children}
                </LayoutSet>
              )}
            </AppProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}