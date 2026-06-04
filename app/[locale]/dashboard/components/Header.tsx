"use client";

import { ExternalLink, Menu, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useSettings } from "../context/SettingsContext";

export const Header = ({ setMobileMenuOpen }) => {
  const { language } = useLanguage(); // ✅ যোগ করুন
  const { settings, loading } = useSettings();
  
  

  // if (loading) {
  //   return (
  //     <header className="bg-white shadow-sm">
  //       <div className="container mx-auto px-4 py-4">
  //         <div className="animate-pulse flex items-center justify-between">
  //           <div className="h-10 w-32 bg-gray-200 rounded"></div>
  //           <div className="h-10 w-64 bg-gray-200 rounded"></div>
  //         </div>
  //       </div>
  //     </header>
  //   );
  // }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600 border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-800">
            {language === 'bn' ? "ই-কমার্স ড্যাশবোর্ড" : "E-Commerce Dashboard"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
          {language === 'bn'
            ? "নেক্সট.জেএস এবং টেলউইন্ড ভিত্তিক"
            : "Tailwind + Next.js Stack"}
        </span> */}

        {/* Visit Store Button Mock */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-blue-200"
        >
          <span>{language === 'bn' ? "স্টোর দেখুন" : "Visit Store"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
};
