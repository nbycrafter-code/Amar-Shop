'use client'
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

interface PurchaseToastProps {
  productName?: string;
  productNameBn?: string;
  productImage?: string;
  buyerName?: string;
  buyerNameBn?: string;
  buyerLocation?: string;
  buyerLocationBn?: string;
  brand?: string;
  brandBn?: string;
  onClose?: () => void;
  autoHideDuration?: number;
  delay?: number;
}

export const PurchaseToast = ({ 
  productName = "Muaddi Johana Flatform Flip Flops",
  productNameBn = "মুয়াদ্দি জোহানা ফ্ল্যাটফর্ম ফ্লিপ ফ্লপস",
  productImage = "/images/flipflops.jpg",
  buyerName = "Ben",
  buyerNameBn = "বেন",
  buyerLocation = "New York",
  buyerLocationBn = "নিউ ইয়র্ক",
  brand = "Amina",
  brandBn = "আমিনা",
  onClose,
  autoHideDuration = 8000,
  delay = 2500
}: PurchaseToastProps) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [visible, setVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);

  const getProductName = (): string => isBn ? productNameBn : productName;
  const getBuyerName = (): string => isBn ? buyerNameBn : buyerName;
  const getBuyerLocation = (): string => isBn ? buyerLocationBn : buyerLocation;
  const getBrand = (): string => isBn ? brandBn : brand;

  const purchasedText: string = isBn ? "কিনেছেন" : "purchased";
  const justNowText: string = isBn ? "এখনই" : "Just now";
  const verifiedText: string = isBn ? "ভেরিফাইড" : "Verified";

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(showTimer);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, ((autoHideDuration - elapsed) / autoHideDuration) * 100);
      setProgress(remaining);
      
      if (elapsed >= autoHideDuration) {
        clearInterval(interval);
      }
    }, 16);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, autoHideDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [visible, autoHideDuration, onClose]);

  const handleClose = (): void => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-3 flex items-center gap-3 max-w-xs z-50 animate-fade-in">
      <img 
        src={productImage} 
        alt={getProductName()} 
        className="w-14 h-14 object-cover rounded" 
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">
          {getBuyerName()} {purchasedText}
        </p>
        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
          {getProductName()}
        </p>
        <p className="text-xs text-red-500 mt-0.5">
          {getBrand()}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{justNowText}</span>
          <span className="flex items-center gap-0.5 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {verifiedText}
          </span>
        </div>
      </div>
      <button 
        onClick={handleClose} 
        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        aria-label={isBn ? "বন্ধ" : "Close"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <span 
        className="absolute bottom-0 left-0 h-1 bg-[#ef553f] rounded-b transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};