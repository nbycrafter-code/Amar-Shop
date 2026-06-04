"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface BreadcrumbProps {
  page: string;
  classname?: string;
}

export const Breadcrumb = ({ page, classname = "" }: BreadcrumbProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const homeText = isBn ? "হোম" : "Home";

  return (
    <div className={`py-2 ${classname}`}>
      <div className="container w-full mx-auto">
        <nav className="text-sm text-gray-500">
          <Link 
            href="/" 
            className="hover:text-red-500 cursor-pointer transition-colors"
          >
            {homeText}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">
            {page}
          </span>
        </nav>
      </div>
    </div>
  );
};