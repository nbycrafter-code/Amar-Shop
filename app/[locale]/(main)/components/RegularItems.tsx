"use client";
import { useState, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export const RegularItems = ({ settings, products }) => { // settings prop যোগ করা হলো
    const { language } = useLanguage();
    const swiperRef = useRef(null);

    // থিম কালার - সেটিংস থেকে নেওয়া
    const primaryColor = settings?.primaryColor || "#ef553f";
    const buttonHoverColor = settings?.buttonPrimaryHover || "#333333";
    const headingColor = settings?.headingColor || "#4B5563";
    const textMuted = settings?.textMuted || "#6B7280";

    return (
        <section className="pt-12">
            <div className="container mx-auto w-full px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 
                        className="text-xl font-semibold"
                        style={{ color: headingColor }}
                    >
                        {language === 'bn' ? 'নিয়মিত আইটেম' : 'Regular Items'}
                    </h2>
                    <div className="flex gap-2">
                        <button 
                            className="swiper-btn-prev1 w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300"
                            style={{ backgroundColor: primaryColor }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            className="swiper-btn-next1 w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300"
                            style={{ backgroundColor: primaryColor }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                {products && products.length > 0 ? (
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation, Autoplay]}
                        slidesPerView={2}
                        spaceBetween={16}
                        loop={true}
                        speed={1500}
                        grabCursor={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            nextEl: ".swiper-btn-next1",
                            prevEl: ".swiper-btn-prev1",
                        }}
                        breakpoints={{
                            0: { slidesPerView: 2 },
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 },
                            1536: { slidesPerView: 6 },
                        }}
                        style={{
                            overflow: "hidden",
                            height: "430px",
                        }}
                        onInit={(swiper) => {
                            swiper.autoplay.start();
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} settings={settings} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center py-12">
                        <p style={{ color: textMuted }}>
                            {language === 'bn' 
                                ? 'কোন পণ্য পাওয়া যায়নি।' 
                                : 'No products found.'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};