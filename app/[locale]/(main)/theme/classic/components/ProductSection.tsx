// app/theme/classic/components/ProductSection.tsx
'use client'
import { ProductCard } from "./ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  subtitleColor: string;
  products: any[];
  theme: any;
}

export function ProductSection({ title, subtitle, subtitleColor, products, theme }: ProductSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${subtitleColor}`}>
            {subtitle}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {title.split(' ')[0]} <em className="not-italic" style={{ color: theme.settings.primaryColor }}>{title.split(' ').slice(1).join(' ')}</em>
          </h2>
        </div>
        <a href="#" className="text-sm font-semibold transition-colors" style={{ color: theme.settings.primaryColor }}>
          সব দেখুন →
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} theme={theme} />
        ))}
      </div>
    </section>
  );
}