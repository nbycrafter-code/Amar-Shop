'use client'
import { ProductCard } from "../ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id?: string;
  _id?: string;
  name: string;
  nameBn?: string;
  price: number;
  image: string;
  slug: string;
  rating?: number;
}

interface RelatedProductsProps {
  products: Product[];
  settings?: any; // settings prop যোগ করা হলো
}

export default function RelatedProducts({ products, settings = {} }: RelatedProductsProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#F9FAFB";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold mb-4" style={{ color: textColor }}>
        {isBn ? "সম্পর্কিত পণ্য" : "Related products"}
      </h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} settings={settings} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 rounded-lg" style={{ backgroundColor: hoverBg }}>
          <p className="text-sm" style={{ color: textMuted }}>
            {isBn ? "কোন সম্পর্কিত পণ্য পাওয়া যায়নি।" : "No related products found."}
          </p>
        </div>
      )}
    </div>
  );
}