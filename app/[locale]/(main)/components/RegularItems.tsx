"use client";
import { useState, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext"; // ✅ যোগ করুন

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export const RegularItems = ({ products }) => {
    const { language } = useLanguage(); // ✅ যোগ করুন
    const swiperRef = useRef(null);

    return (
        <section className="pt-12">
            <div className="container mx-auto w-full px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-600">
                        {language === 'bn' ? 'নিয়মিত আইটেম' : 'Regular Items'}
                    </h2>
                    <div className="flex gap-2">
                        <button className="swiper-btn-prev1 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center hover:bg-[#333333] transition-colors duration-300">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="swiper-btn-next1 w-8 h-8 rounded-full bg-[#ef553f] text-white flex items-center justify-center hover:bg-[#333333] transition-colors duration-300">
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
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
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