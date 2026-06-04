
import { Slider } from "./components/Slider";
import { Features } from "./components/Features";
import { Categories } from "./components/Categories";
import { PromoBanner } from "./components/PromoBanner";
import { CategoryPromo } from "./components/CategoryPromo";
import { DealOfDay } from "./components/DealOfDay";
import { TrendingItems } from "./components/TrendingItems";
import { RegularItems } from "./components/RegularItems";
import { BlogPosts } from "./components/BlogPosts";
import { getCategories } from "@/queries/categories";
import { getProducts } from "@/queries/products";

import { getHomeSeoMetadata } from "@/lib/seo-metadata";
import { Metadata } from "next";
import { getActiveSliders } from "@/queries/sliders";
import { getActiveBannersByPageType, getBannersByPageAndPosition, getBannersByPosition } from "@/queries/banner";


export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeoMetadata();
  return seo;
}

export default async function Home() {

  const sliders = await getActiveSliders();
  const categories = await getCategories();
  const products = await getProducts();
  const promoBanners = await getBannersByPosition('homepage', 'promo');
  const categoryBanners = await getBannersByPosition('homepage', 'category');
  const trendingProducts = products.filter((p) => { return p.section == "trending" });
  const regularProducts = products.filter((p) => {
    return p.section === "" || p.section === "none";
  });
  const limitedProducts = products.filter((p) => { return p.section == 'limited-edition' });
  

  return (
    <>
      <Slider sliders={sliders} />
      <Features />

      <TrendingItems products={trendingProducts} />

      <Categories categories={categories} />
      <PromoBanner promoBanners={promoBanners} />
      <DealOfDay products={limitedProducts} />
      <CategoryPromo categoryBanners={categoryBanners} />

      <RegularItems products={regularProducts} />

      {/* <BlogPosts /> */}
    </>
  );
}
