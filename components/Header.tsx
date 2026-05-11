// components/Header.tsx
"use client";

import { useSettings } from "@/context/SettingsContext";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { settings, loading } = useSettings();
  const { isBn } = useApp();

  if (loading) {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="animate-pulse flex items-center justify-between">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {settings?.logo ? (
              <Image
                src={settings.logo}
                alt={settings?.siteName || "Logo"}
                width={150}
                height={50}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                {isBn ? settings?.siteNameBn : settings?.siteName}
              </span>
            )}
          </Link>

          {/* Site Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-700">
              {isBn ? settings?.siteTitleBn : settings?.siteTitle}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}