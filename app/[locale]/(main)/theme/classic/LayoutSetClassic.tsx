// app/theme/classic/page.tsx
'use client'

import { themePresets } from "@/lib/themePresets";
import { TopBar } from "./components/TopBar";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { Categories } from "./components/Categories";
import { ProductSection } from "./components/ProductSection";
import { PromoBanners } from "./components/PromoBanners";
import { Brands } from "./components/Brands";
import { WhyUs } from "./components/WhyUs";
import { Blog } from "./components/Blog";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { PRODUCTS } from "./data/products";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, Children } from "react";
import { useApp } from "../../context/AppContext";

interface PetShopProps {
  settings?: any;
  sliders?: any[];
  categories?: any[];
  products?: any[];
  promoBanners?: any[];
  categoryBanners?: any[];
  trendingProducts?: any[];
  regularProducts?: any[];
  limitedProducts?: any[];
  session?: any;
}

export default function LayoutSetClassic({
  children,
  settings: propSettings,
  sliders = [],
  categories = [],
  products = [],
  promoBanners = [],
  categoryBanners = [],
  trendingProducts = [],
  regularProducts = [],
  limitedProducts = [],
  session,
}: PetShopProps) {
  const { language } = useLanguage();
  const { cart, wishlist } = useApp();

  // Theme settings - prioritize passed settings, fallback to themePresets
  const classicTheme = themePresets.classic;
  const settings = propSettings || classicTheme.settings;

  // State for cart and wishlist counts
  const [cartCount, setCartCount] = useState(cart?.length || 0);
  const [wishCount, setWishCount] = useState(wishlist?.length || 0);

  // Update counts when cart/wishlist changes
  useEffect(() => {
    setCartCount(cart?.length || 0);
  }, [cart]);

  useEffect(() => {
    setWishCount(wishlist?.length || 0);
  }, [wishlist]);

  // Use real products if available, fallback to mock data
  const displayProducts = products.length > 0 ? products : PRODUCTS;

  // Get trending products (first 5 for demo)
  const trendingProductsList = trendingProducts.length > 0
    ? trendingProducts.slice(0, 5)
    : displayProducts.slice(0, 5);

  // Get new products (next 5 for demo)
  const newProductsList = regularProducts.length > 0
    ? regularProducts.slice(0, 5)
    : displayProducts.slice(5, 10);

  // Get limited products for deal of day
  const dealProducts = limitedProducts.length > 0
    ? limitedProducts
    : displayProducts.slice(0, 4);

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        backgroundColor: settings.backgroundColor || "#FFFFFF",
        color: settings.textColor || "#1F2937",
      }}
    >
      <TopBar
        settings={settings}
        theme={classicTheme}
      />

      <Header
        session={session}
        settings={settings}
        categories={categories}
        openCart={() => { }} // This will be connected to cart drawer
        wishlistCount={wishCount}
        onWishlistClick={() => { }} // This will be connected to wishlist page
        theme={classicTheme}
      />

      <Navigation
        session={session}
        categories={categories}
        openCart={() => { }} // This will be connected to cart drawer
        wishlistCount={wishCount}
        onWishlistClick={() => { }} // This will be connected to wishlist page
        compareCount={0}
        onCompareClick={() => { }}
        settings={settings}
        theme={classicTheme}
      />

      <main>
        {children}
      </main>

      <Footer
        settings={settings}
        theme={classicTheme}
      />
    </div>
  );
}