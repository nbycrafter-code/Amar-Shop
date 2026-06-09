// app/components/Slider.tsx
'use client'
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SliderProps {
  sliders: any[];
  settings?: any; // settings prop যোগ করা হলো
}

export const Slider = ({ sliders: initialSliders, settings = {} }: SliderProps) => {
  const { language } = useLanguage();
  const [sliders, setSliders] = useState(initialSliders);
  
  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d43f2a";
  
  useEffect(() => {
    const fetchActiveSliders = async () => {
      try {
        const res = await fetch('/api/slider?active=true');
        const data = await res.json();
        if (data.success) {
          setSliders(data.data);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
      }
    };
    
    const interval = setInterval(fetchActiveSliders, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!sliders || sliders.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: settings?.backgroundColor || "#d9d0cb" }}>
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
          nextEl: ".banner-button-nxt",
          prevEl: ".banner-button-prv",
        }}
        className="banner-swiper"
      >
        {sliders.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div
              className="relative w-full h-[350px] md:h-[500px] lg:h-[600px]"
              style={{
                backgroundImage: `url('${banner.bgImage}')`,
                backgroundPosition: banner.mobileImage ? "center center" : "right center",
                backgroundSize: "cover",
              }}
            >
              {banner.mobileImage && (
                <picture>
                  <source media="(max-width: 768px)" srcSet={banner.mobileImage} />
                  <source media="(min-width: 769px)" srcSet={banner.bgImage} />
                  <img src={banner.bgImage} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
                </picture>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient || 'from-black/50 via-black/20 to-transparent'}`} />
              
              <div className="container mx-auto h-full w-full flex items-center px-4 relative z-10">
                <div className="max-w-[500px]">
                  {banner.subtitle && (
                    <p className={`text-sm md:text-base font-semibold mb-2 ${banner.highlightColor || 'text-lime-400'}`}>
                      {language === 'bn' ? banner.subtitleBn : banner.subtitle}
                    </p>
                  )}
                  <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-tight ${banner.textColor || 'text-white'}`}>
                    {language === 'bn' ? banner.titleBn : banner.title}
                  </h1>
                  {banner.buttonText && (
                    <Link
                      href={banner.buttonLink || "/shop"}
                      className="mt-5 md:mt-6 inline-block rounded px-6 py-2.5 text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105"
                      style={{ 
                        backgroundColor: primaryColor,
                        color: '#FFFFFF'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    >
                      {language === 'bn' ? banner.buttonTextBn : banner.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {sliders.length > 1 && (
        <>
          <button 
            className="banner-button-prv absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="banner-button-nxt absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <style jsx>{`
        :global(.banner-swiper .swiper-pagination-bullet) {
          background: white;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
          opacity: 0.7;
        }
        :global(.banner-swiper .swiper-pagination-bullet-active) {
          width: 24px;
          border-radius: 4px;
          background: ${primaryColor};
        }
        :global(.banner-swiper .swiper-pagination) {
          bottom: 20px !important;
        }
        :global(.banner-swiper .swiper-pagination-bullet:hover) {
          background: ${primaryColor};
          opacity: 1;
        }
      `}</style>
    </section>
  );
};