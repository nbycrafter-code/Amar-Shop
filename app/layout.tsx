// app/layout.tsx
export const dynamic = "force-dynamic";
import { LanguageProvider } from "@/context/LanguageContext";
import { getSetting } from "@/queries/settings";


export async function generateMetadata() {
  const settings = await getSetting();
  return {
    icons: {
      icon: [
        { url: settings?.favicon, sizes: 'any' },
        { url: settings?.favicon, sizes: '16x16', type: 'image/png' },
        { url: settings?.favicon, sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: settings?.favicon, sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/site.webmanifest',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}