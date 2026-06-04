'use client';

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryBanner {
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

interface CategoryPromoProps {
  categoryBanners?: CategoryBanner[];
}

export const CategoryPromo = ({ categoryBanners = [] }: CategoryPromoProps) => {
  const { language } = useLanguage();

  const getText = (banner: CategoryBanner, fieldName: string): string => {
    const bnField = `${fieldName}Bn` as keyof CategoryBanner;
    const enField = fieldName as keyof CategoryBanner;
    
    if (language === 'bn') {
      return (banner[bnField] as string) || (banner[enField] as string) || '';
    }
    return (banner[enField] as string) || '';
  };

  const getDefaultButtonText = (): string => {
    return language === 'bn' ? 'কিনুন' : 'Shop Now';
  };

  if (!categoryBanners || categoryBanners.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto w-full px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryBanners.map((banner, index) => {
            const title = getText(banner, 'title');
            const subtitle = getText(banner, 'subtitle');
            const buttonText = getText(banner, 'buttonText');

            return (
              <Link 
                key={banner._id || index}
                href={banner.buttonLink || "/shop"}
                className="group relative h-64 bg-gray-100 rounded-lg overflow-hidden block shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Background Image */}
                <img
                  src={banner.bgImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"}
                  alt={title || "Category"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient || "from-black/70 via-black/50 to-transparent"} flex items-center p-6 md:p-8`}>
                  <div className="max-w-[90%]">
                    {/* Subtitle */}
                    {subtitle && (
                      <p className={`${banner.highlightColor || "text-[#ef553f]"} text-xs md:text-sm mb-2 font-medium uppercase tracking-wide`}>
                        {subtitle}
                      </p>
                    )}
                    
                    {/* Title */}
                    {title && (
                      <h3 className={`${banner.textColor || "text-white"} text-lg md:text-xl font-bold mb-3 md:mb-4 leading-tight`}>
                        {title}
                      </h3>
                    )}
                    
                    {/* Button */}
                    <button className="inline-block rounded bg-[#ef553f] hover:bg-[#d4382c] transition-all duration-300 px-5 md:px-7 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
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