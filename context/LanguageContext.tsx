// context/LanguageContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setLanguageCookie } from "@/app/actions/language";

interface LanguageContextType {
  language: string;
  changeLanguage: (newLang: string) => void;
  availableLanguages: { code: string; name: string; nameBn: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLanguages = [
  { code: "bn", name: "Bangla", nameBn: "বাংলা" },
  { code: "en", name: "English", nameBn: "ইংরেজি" },
];

const setClientCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const getClientCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const getPathWithoutLanguage = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'bn' || segments[0] === 'en') {
    const newPath = '/' + segments.slice(1).join('/');
    return newPath === '' ? '/' : newPath;
  }
  return pathname === '' ? '/' : pathname;
};

const getLanguageFromPath = (pathname: string): string | null => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'bn') return 'bn';
  if (segments[0] === 'en') return 'en';
  return null;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [language, setLanguageState] = useState<string>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from URL
  useEffect(() => {
    const urlLang = getLanguageFromPath(pathname);
    
    if (urlLang && (urlLang === 'bn' || urlLang === 'en')) {
      setLanguageState(urlLang);
      document.documentElement.lang = urlLang;
      
      // Sync cookie with URL
      const cookieLang = getClientCookie('language');
      if (cookieLang !== urlLang) {
        setClientCookie('language', urlLang);
        setLanguageCookie(urlLang, pathname).catch(console.error);
      }
    } else {
      // Fallback to cookie or default
      const cookieLang = getClientCookie('language');
      const defaultLang = cookieLang === 'bn' ? 'bn' : 'en';
      setLanguageState(defaultLang);
      document.documentElement.lang = defaultLang;
    }
    
    setIsInitialized(true);
  }, [pathname]);

  const changeLanguage = useCallback((newLang: string): void => {
    if (newLang !== 'bn' && newLang !== 'en') return;
    if (newLang === language) return;
    
    console.log(`🔄 Changing language from ${language} to ${newLang}`);
    
    // Get current path without language prefix
    const pathWithoutLang = getPathWithoutLanguage(pathname);
    
    // Construct new path with new language
    let newPath;
    if (pathWithoutLang === '/' || pathWithoutLang === '') {
      newPath = `/${newLang}`;
    } else {
      newPath = `/${newLang}${pathWithoutLang}`;
    }
    
    // IMMEDIATE UI UPDATE - আগে থেকেই state আপডেট করে দিন
    setLanguageState(newLang);
    document.documentElement.lang = newLang;
    setClientCookie('language', newLang);
    
    // Server cookie আপডেট করুন background এ
    setLanguageCookie(newLang, pathname).catch(err => {
      console.error("Failed to set server cookie:", err);
    });
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLang } 
    }));
    
    // Use router.push for SPA navigation (no reload)
    router.push(newPath);
    
    console.log(`✅ Navigating to: ${newPath} (no reload)`);
  }, [language, pathname, router]);

  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}