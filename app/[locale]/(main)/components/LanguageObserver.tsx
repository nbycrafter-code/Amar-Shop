// components/LanguageObserver.tsx
'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageObserver() {
  const { language } = useLanguage();

  useEffect(() => {
    // Listen for storage events (if cookie changes from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue) {
        console.log('Language changed in another tab:', e.newValue);
        window.dispatchEvent(new CustomEvent('languageChanged', { 
          detail: { language: e.newValue } 
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return null;
}