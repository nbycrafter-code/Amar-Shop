export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import LayoutSet from "./layoutset";
import { dbConnect } from "@/service/mongo";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "./context/SettingsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard - Your One Stop Shop",
  description: "Best products at best prices",
};

export default async function RootLayout({ children }) {
  await dbConnect();

  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }


  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <SettingsProvider>
            <LayoutSet user={session?.user}>{children}</LayoutSet>
            <Toaster position="top-right" richColors />
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
