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
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {isBn ? "সম্পর্কিত পণ্য" : "Related products"}
      </h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {isBn ? "কোন সম্পর্কিত পণ্য পাওয়া যায়নি।" : "No related products found."}
          </p>
        </div>
      )}
    </div>
  );
}