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

export const TrendingItems = ({ settings, products }) => { // settings prop যোগ করা হলো
    const { language } = useLanguage();
    const swiperRef = useRef(null);

    // থিম কালার - সেটিংস থেকে নেওয়া
    const primaryColor = settings?.primaryColor || "#ef553f";
    const textColor = settings?.textColor || "#1F2937";
    const headingColor = settings?.headingColor || "#111827";
    const borderColor = settings?.borderColor || "#E5E7EB";
    const hoverBg = settings?.hoverBackground || "#F3F4F6";

    const [activeTab, setActiveTab] = useState("All");
    
    const tabs = [
        { id: "All", labelBn: "সব", labelEn: "All" },
        { id: "simple", labelBn: "সাধারণ", labelEn: "Simple" },
        { id: "variable", labelBn: "ভেরিয়েবল", labelEn: "Variable" },
        { id: "digital", labelBn: "ডিজিটাল", labelEn: "Digital" },
        { id: "service", labelBn: "সেবা", labelEn: "Service" },
        { id: "affiliate", labelBn: "অ্যাফিলিয়েট", labelEn: "Affiliate" }
    ];

    const filteredProducts = () => {
        if (activeTab === "All") return products;
        if (activeTab === "simple") return products.filter((p) => {return p.productType == "simple"});
        if (activeTab === "variable") return products.filter((p) => {return p.productType == "variable"});
        if (activeTab === "digital") return products.filter((p) => {return p.productType == "digital"});
        if (activeTab === "service") return products.filter((p) => {return p.productType == "service"});
        if (activeTab === "affiliate") return products.filter((p) => {return p.productType == "affiliate"});
        return products;
    };

    const hasProducts = filteredProducts().length > 0;

    const getTabLabel = (tab) => {
        return language === 'bn' ? tab.labelBn : tab.labelEn;
    };

    return (
        <section className="pt-12 pb-4 position-relative">
            <div className="container mx-auto w-full px-4 relative group/pagination">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h2 
                        className="text-2xl font-semibold"
                        style={{ color: headingColor }}
                    >
                        {language === 'bn' ? 'ট্রেন্ডিং আইটেম' : 'Trending Items'}
                    </h2>
                    <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    if (swiperRef.current && swiperRef.current.swiper) {
                                        swiperRef.current.swiper.slideTo(0);
                                        swiperRef.current.swiper.autoplay.start();
                                    }
                                }}
                                className={`text-sm font-semibold transition-colors capitalize pb-2`}
                                style={{
                                    color: activeTab === tab.id ? primaryColor : textColor,
                                    borderBottom: activeTab === tab.id ? `2px solid ${primaryColor}` : '2px solid transparent'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.color = primaryColor;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.color = textColor;
                                    }
                                }}
                            >
                                {getTabLabel(tab)}
                            </button>
                        ))}
                    </div>
                </div>

                {hasProducts ? (
                    <div className="relative">
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
                                pauseOnMouseEnter: false,
                            }}
                            navigation={{
                                nextEl: ".swiper-btn-next",
                                prevEl: ".swiper-btn-prev",
                            }}
                            breakpoints={{
                                0: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                992: { slidesPerView: 6 },
                            }}
                            style={{
                                overflow: "hidden",
                                height: "430px",
                            }}
                            className="trending-swiper"
                            onInit={(swiper) => {
                                swiper.autoplay.start();
                            }}
                        >
                            {filteredProducts()
                                .map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCard settings={settings} product={product} />
                                    </SwiperSlide>
                                ))}
                        </Swiper>

                        {/* Navigation Buttons */}
                        {(() => {
                            const productsCount = filteredProducts().slice(0, 6).length;
                            const getCurrentSlidesPerView = () => {
                                if (typeof window !== "undefined") {
                                    const width = window.innerWidth;
                                    if (width >= 992) return 6;
                                    if (width >= 768) return 3;
                                    return 2;
                                }
                                return 2;
                            };

                            const shouldShowButtons = productsCount > getCurrentSlidesPerView();

                            return (
                                shouldShowButtons && (
                                    <div className="flex gap-2 justify-end opacity-0 group-hover/pagination:opacity-100 transition-opacity duration-300 absolute w-full top-[42%] transform -translate-y-[42%] z-30 pointer-events-none">
                                        <button 
                                            className="swiper-btn-prev w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300 absolute -left-4 pointer-events-auto z-10"
                                            style={{ backgroundColor: primaryColor }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.buttonPrimaryHover || '#333333'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button 
                                            className="swiper-btn-next w-8 h-8 rounded-full text-white flex items-center justify-center transition-colors duration-300 absolute -right-4 pointer-events-auto z-10"
                                            style={{ backgroundColor: primaryColor }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings?.buttonPrimaryHover || '#333333'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            );
                        })()}
                    </div>
                ) : (
                    <p className="text-center col-span-full" style={{ color: primaryColor }}>
                        {language === 'bn' 
                            ? 'এই ক্যাটাগরির জন্য কোন পণ্য পাওয়া যায়নি।' 
                            : 'No products found for the selected category.'}
                    </p>
                )}
            </div>
        </section>
    );
};