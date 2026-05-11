export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import LayoutSet from "./layoutset";
import { dbConnect } from "@/service/mongo";
import { AppProvider } from "./context/AppContext";
import { SettingsProvider } from "./context/SettingsContext";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard - Your One Stop Shop",
  description: "Best products at best prices",
};

export default async function RootLayout({ children }) {
  // const session = await auth();
  // if (!session?.user) {
  //   redirect("/admin/login");
  // }
  

  // await dbConnect();

  const user = {
    name: "Dip"
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <SettingsProvider>
            <LayoutSet user={user}>{children}</LayoutSet>
          </SettingsProvider>
        </AppProvider>
      </body>
    </html>
  );
}
