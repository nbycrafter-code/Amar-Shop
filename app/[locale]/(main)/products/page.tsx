import { getCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { searchProducts } from "@/queries/products";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

// ✅ সঠিকভাবে ডিকোড করার ফাংশন
function decodeSearchQuery(encodedQuery: string | null): string | null {
  if (!encodedQuery) return null;
  
  try {
    // URL ডিকোড করা
    let decoded = decodeURIComponent(encodedQuery);
    // হাইফেন আবার স্পেসে রূপান্তর
    decoded = decoded.replace(/-/g, ' ');
    return decoded;
  } catch (error) {
    console.error("Search query decode error:", error);
    return encodedQuery; // যদি ডিকোড না হয়, আসলটা রিটার্ন করো
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  
  const categorySlug = resolvedParams?.category || null;
  const encodedSearchQuery = resolvedParams?.search || null;
  
  // ✅ সঠিকভাবে ডিকোড করা
  const searchText = decodeSearchQuery(encodedSearchQuery);
  
  console.log("🔍 Original Encoded Search:", encodedSearchQuery);
  console.log("📝 Decoded Search Text:", searchText);
  console.log("📂 Category Slug:", categorySlug);
  
  // Fetch all required data in parallel
  const [categories, brands, sizes, colors, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getSizes(),
    getColors(),
    searchProducts(categorySlug, searchText) // এখন searchText সঠিকভাবে ডিকোডেড
  ]);
  
  console.log("📦 Products found:", products?.length || 0);
  
  return (
    <PageSet
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      products={products}
      selectedCategory={categorySlug}
      searchQuery={searchText} // ডিকোডেড টেক্সট পাঠানো হচ্ছে
    />
  );
}