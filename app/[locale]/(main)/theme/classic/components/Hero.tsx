// app/theme/classic/components/Hero.tsx
'use client'

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface HeroProps {
  theme: any;
  sliders?: any[];
}

export function Hero({ theme, sliders = [] }: HeroProps) {
  const { language } = useLanguage();
  
  // Theme colors
  const primaryColor = theme?.settings?.primaryColor || "#10B981";
  const buttonHoverColor = theme?.settings?.buttonPrimaryHover || "#059669";

  // If sliders exist, show slider with your design
  if (sliders && sliders.length > 0) {
    return (
      <section className="bg-gradient-to-br from-emerald-50 via-white to-orange-50 overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={sliders.length > 1}
          speed={1000}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: ".hero-button-nxt",
            prevEl: ".hero-button-prv",
          }}
          className="hero-swiper"
        >
          {sliders.map((banner) => {
            // Get the correct text based on language
            const title = language === 'bn' ? banner.titleBn || banner.title : banner.title;
            const subtitle = language === 'bn' ? banner.subtitleBn || banner.subtitle : banner.subtitle;
            const buttonText = language === 'bn' ? banner.buttonTextBn || banner.buttonText : banner.buttonText;
            
            return (
              <SwiperSlide key={banner._id || banner.id}>
                <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content - Your Design */}
                  <div>
                    {subtitle && (
                      <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm mb-5">
                        {subtitle}
                      </div>
                    )}
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                      {title}
                    </h1>
                    {banner.description && (
                      <p className="text-gray-500 text-lg mb-7 max-w-lg leading-relaxed">
                        {language === 'bn' ? banner.descriptionBn || banner.description : banner.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 mb-8">
                      {buttonText && (
                        <Link
                          href={banner.buttonLink || "/products"}
                          className="text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
                          style={{ backgroundColor: primaryColor }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                        >
                          {buttonText}
                        </Link>
                      )}
                      <Link 
                        href="/offers" 
                        className="border-2 border-emerald-200 hover:border-emerald-400 text-emerald-700 font-bold px-7 py-3.5 rounded-xl transition-all text-sm bg-white hover:bg-emerald-50"
                      >
                        {language === 'bn' ? 'অফার দেখুন' : 'View Offers'}
                      </Link>
                    </div>
                    <div className="flex gap-8">
                      {[
                        [language === 'bn' ? '২,০০০+' : '2,000+', language === 'bn' ? 'পণ্য' : 'Products'],
                        [language === 'bn' ? '৫০+' : '50+', language === 'bn' ? 'ব্র্যান্ড' : 'Brands'],
                        [language === 'bn' ? '১৫,০০০+' : '15,000+', language === 'bn' ? 'খুশি গ্রাহক' : 'Happy Customers']
                      ].map(([val, lbl]) => (
                        <div key={lbl}>
                          <div className="text-2xl font-extrabold" style={{ color: primaryColor }}>{val}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Image - Your Design with slider background */}
                  <div className="relative hidden lg:block">
                    <div className="absolute -top-6 -right-6 w-72 h-72 bg-amber-200 rounded-full opacity-30 -z-0"></div>
                    <div 
                      className="relative z-10 rounded-3xl aspect-square flex items-center justify-center shadow-xl overflow-hidden"
                      style={{
                        backgroundImage: `url('${banner.bgImage || banner.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient || 'from-black/50 via-black/20 to-transparent'}`} />
                      
                      {/* Show emoji or image */}
                      {banner.icon ? (
                        <span className="text-[140px] leading-none relative z-10">{banner.icon}</span>
                      ) : (
                        <span className="text-[140px] leading-none relative z-10">🐕</span>
                      )}
                    </div>
                    
                    {/* Floating Cards - Your Design */}
                    <div className="absolute top-4 -left-8 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          {language === 'bn' ? '২৪ ঘণ্টায়' : '24 hours'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {language === 'bn' ? 'ঢাকায় ডেলিভারি' : 'Delivery in Dhaka'}
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 -right-6 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                      <span className="text-2xl">⭐ ৪.৯</span>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          {language === 'bn' ? 'রেটিং' : 'Rating'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {language === 'bn' ? '৮,০০০+ রিভিউ' : '8,000+ Reviews'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        {sliders.length > 1 && (
          <>
            <button 
              className="hero-button-prv absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg border border-gray-200"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="hero-button-nxt absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg border border-gray-200"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Custom Pagination Styles */}
        <style jsx>{`
          :global(.hero-swiper .swiper-pagination-bullet) {
            background: ${primaryColor};
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
            opacity: 0.5;
          }
          :global(.hero-swiper .swiper-pagination-bullet-active) {
            width: 30px;
            border-radius: 5px;
            background: ${primaryColor};
            opacity: 1;
          }
          :global(.hero-swiper .swiper-pagination) {
            bottom: 20px !important;
            position: relative;
            padding-top: 20px;
          }
          :global(.hero-swiper .swiper-pagination-bullet:hover) {
            opacity: 1;
            transform: scale(1.2);
          }
        `}</style>
      </section>
    );
  }

  // Your original static design (unchanged)
  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm mb-5">
            {language === 'bn' ? '🇧🇩 বাংলাদেশের জন্য তৈরি' : '🇧🇩 Made for Bangladesh'}
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {language === 'bn' ? 'আপনার প্রিয় পোষা প্রাণীর জন্য' : 'For your beloved pets'}{" "}
            <em className="not-italic" style={{ color: primaryColor }}>
              {language === 'bn' ? 'সেরা যত্ন' : 'Best Care'}
            </em>
            {language === 'bn' ? ', এক জায়গায়' : ', All in One Place'}
          </h1>
          <p className="text-gray-500 text-lg mb-7 max-w-lg leading-relaxed">
            {language === 'bn' 
              ? 'খাবার, খেলনা, ওষুধ আর গ্রুমিং — সব পাবেন একসাথে। ১০০% অরিজিনাল পণ্য, সারাদেশে দ্রুত ডেলিভারি আর ক্যাশ অন ডেলিভারির নিশ্চয়তা।'
              : 'Food, toys, medicine and grooming — all in one place. 100% original products, fast delivery nationwide and cash on delivery guarantee.'
            }
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link 
              href="/products" 
              className="text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            >
              {language === 'bn' ? 'এখনই কেনাকাটা করুন →' : 'Shop Now →'}
            </Link>
            <Link 
              href="/offers" 
              className="border-2 border-emerald-200 hover:border-emerald-400 text-emerald-700 font-bold px-7 py-3.5 rounded-xl transition-all text-sm bg-white hover:bg-emerald-50"
            >
              {language === 'bn' ? 'অফার দেখুন' : 'View Offers'}
            </Link>
          </div>
          <div className="flex gap-8">
            {[
              [language === 'bn' ? '২,০০০+' : '2,000+', language === 'bn' ? 'পণ্য' : 'Products'],
              [language === 'bn' ? '৫০+' : '50+', language === 'bn' ? 'ব্র্যান্ড' : 'Brands'],
              [language === 'bn' ? '১৫,০০০+' : '15,000+', language === 'bn' ? 'খুশি গ্রাহক' : 'Happy Customers']
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="text-2xl font-extrabold" style={{ color: primaryColor }}>{val}</div>
                <div className="text-xs text-gray-400 mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -top-6 -right-6 w-72 h-72 bg-amber-200 rounded-full opacity-30 -z-0"></div>
          <div className="relative z-10 bg-emerald-100 rounded-3xl aspect-square flex items-center justify-center shadow-xl">
            <span className="text-[140px] leading-none">🐕</span>
          </div>
          <div className="absolute top-4 -left-8 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div>
              <div className="text-sm font-bold text-gray-800">
                {language === 'bn' ? '২৪ ঘণ্টায়' : '24 hours'}
              </div>
              <div className="text-xs text-gray-400">
                {language === 'bn' ? 'ঢাকায় ডেলিভারি' : 'Delivery in Dhaka'}
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 -right-6 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">⭐ ৪.৯</span>
            <div>
              <div className="text-sm font-bold text-gray-800">
                {language === 'bn' ? 'রেটিং' : 'Rating'}
              </div>
              <div className="text-xs text-gray-400">
                {language === 'bn' ? '৮,০০০+ রিভিউ' : '8,000+ Reviews'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}