export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutSet from "./layoutset";
import { dbConnect } from "@/service/mongo";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "./context/SettingsContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard - Your One Stop Shop",
  description: "Best products at best prices",
};

export default async function RootLayout({ children }) {
  await dbConnect();

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }


  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <LanguageProvider>
            <SettingsProvider>
              <LayoutSet user={session?.user}>{children}</LayoutSet>
              <Toaster position="top-right" richColors />
            </SettingsProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
