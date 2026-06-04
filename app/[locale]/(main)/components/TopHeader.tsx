'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';

interface Settings {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
}

interface TopHeaderProps {
  settings: Settings;
}

export const TopHeader = ({ settings }: TopHeaderProps) => {
  const { language, changeLanguage } = useLanguage();
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // URL না বদলে শুধু ভাষা পরিবর্তন
  const handleLanguageChange = async (lang: string) => {
    await changeLanguage(lang);
  };

  // if (!mounted) return null;

  return (
    <div className="border-b border-gray-200 bg-[#f5f5f5] text-xs text-gray-600">
      <div className="container mx-auto flex w-full items-center justify-between px-4 py-2">

        {/* Social icons - same as before */}
        <div className="flex items-center gap-3">
          <Link href={settings.facebook} target="_blank" className="text-gray-500 hover:text-gray-800 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </Link>
          <Link href={settings.twitter} target="_blank" className="text-gray-500 hover:text-gray-800 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </Link>
          <Link href={settings.instagram} target="_blank" className="text-gray-500 hover:text-gray-800 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </Link>
          <Link href={settings.linkedin} target="_blank" className="text-gray-500 hover:text-gray-800 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zM7.119 20.452H3.56V9h3.559v11.452zM5.339 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM20.452 20.452h-3.558v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.941v5.665H9.349V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.37-1.852 3.605 0 4.27 2.372 4.27 5.456v6.287z" /></svg>
          </Link>
          <Link href={settings.tiktok} target="_blank" className="text-gray-500 hover:text-gray-800 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" /></svg>
          </Link>
          <Link href={settings.youtube} target="_blank" className="text-gray-500 hover:text-gray-800 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" /></svg>
          </Link>
          <Link href={`tel:${settings.whatsapp}`} className="text-gray-500 hover:text-green-500 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.52 0 .2 5.32.2 11.84c0 2.08.54 4.11 1.57 5.9L0 24l6.43-1.68a11.8 11.8 0 0 0 5.61 1.43h.01c6.52 0 11.84-5.32 11.84-11.84 0-3.16-1.23-6.13-3.37-8.43zM12.05 21.7a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.82 1 1.02-3.72-.24-.38a9.77 9.77 0 0 1-1.5-5.18c0-5.42 4.41-9.83 9.84-9.83 2.62 0 5.08 1.02 6.93 2.87a9.74 9.74 0 0 1 2.89 6.95c0 5.43-4.41 9.84-9.84 9.84zm5.39-7.37c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" /></svg>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/faq" className="hover:text-[#ef553f]">
            {language === 'bn' ? 'প্রশ্নাবলী' : 'Faqs'}
          </Link>
          <Link href="/blog" className="hover:text-[#ef553f]">
            {language === 'bn' ? 'ব্লগ' : 'Blog'}
          </Link>

          {/* Language Toggle - URL পরিবর্তন না করে */}
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Language:</span>
            <button
              onClick={() => handleLanguageChange('bn')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'bn'
                  ? 'bg-[#ef553f] text-white font-semibold'
                  : 'text-gray-500 hover:text-[#ef553f]'
              }`}
            >
              বাং
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === 'en'
                  ? 'bg-[#ef553f] text-white font-semibold'
                  : 'text-gray-500 hover:text-[#ef553f]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};