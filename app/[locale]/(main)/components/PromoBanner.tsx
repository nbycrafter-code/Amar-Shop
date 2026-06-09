'use client';

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface PromoBanner {
  _id?: string;
  title?: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  buttonText?: string;
  buttonTextBn?: string;
  buttonLink?: string;
  bgImage?: string;
  gradient?: string;
  highlightColor?: string;
  textColor?: string;
}

interface PromoBannerProps {
  promoBanners?: PromoBanner[];
  settings?: any; // settings prop যোগ করা হলো
}

export const PromoBanner = ({ promoBanners = [], settings }: PromoBannerProps) => {
  const { language } = useLanguage();

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d4382c";
  const textColor = settings?.textColor || "#1F2937";
  const highlightColor = settings?.secondaryColor || "#ef553f";

  const getText = (banner: PromoBanner, fieldName: string): string => {
    const bnField = `${fieldName}Bn` as keyof PromoBanner;
    const enField = fieldName as keyof PromoBanner;
    
    if (language === 'bn') {
      return (banner[bnField] as string) || (banner[enField] as string) || '';
    }
    return (banner[enField] as string) || '';
  };

  const getDefaultButtonText = (): string => {
    return language === 'bn' ? 'কিনুন' : 'Shop Now';
  };

  if (!promoBanners || promoBanners.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto w-full px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {promoBanners.map((banner, index) => {
            const title = getText(banner, 'title');
            const subtitle = getText(banner, 'subtitle');
            const buttonText = getText(banner, 'buttonText');

            return (
              <Link 
                key={banner._id || index}
                href={banner.buttonLink || "/shop"}
                className="group relative h-64 bg-gray-100 rounded-lg overflow-hidden block"
              >
                {/* Background Image */}
                <img
                  src={banner.bgImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"}
                  alt={title || "Banner"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient || "from-white/90 to-transparent"} flex items-center p-8`}>
                  <div className="max-w-[80%]">
                    {/* Subtitle */}
                    {subtitle && (
                      <p 
                        className="text-sm md:text-md mb-2 font-medium"
                        style={{ color: banner.highlightColor || highlightColor }}
                      >
                        {subtitle}
                      </p>
                    )}
                    
                    {/* Title */}
                    {title && (
                      <h3 
                        className="text-lg md:text-xl font-bold mb-4 leading-tight"
                        style={{ color: banner.textColor || textColor }}
                      >
                        {title}
                      </h3>
                    )}
                    
                    {/* Button */}
                    <button 
                      className="rounded transition-all duration-300 px-5 md:px-7 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-white shadow-md hover:shadow-lg transform hover:scale-105"
                      style={{ 
                        backgroundColor: primaryColor,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = buttonHoverColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = primaryColor;
                      }}
                    >
                      {buttonText || getDefaultButtonText()}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};