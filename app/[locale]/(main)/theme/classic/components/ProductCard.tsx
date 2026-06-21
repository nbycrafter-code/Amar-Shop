// app/theme/classic/components/ProductCard.tsx
'use client'
import { useState } from "react";
import { TK, toBn } from "../data/products";
import { Stars } from "./Stars";

interface ProductCardProps {
  product: {
    id: number;
    brand: string;
    name: string;
    price: number;
    old: number | null;
    rating: number;
    rc: number;
    emoji: string;
    bg: string;
    badge: { cls: string; label: string } | null;
  };
  theme: any;
}

export function ProductCard({ product, theme }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  
  const handleAdd = () => { 
    setAdded(true); 
    setTimeout(() => setAdded(false), 1200); 
  };
  
  const borderRadius = theme.settings.borderRadius;
  const hoverEffect = theme.settings.hoverEffect === 'scale' ? 'hover:-translate-y-1' : 
                      theme.settings.hoverEffect === 'shadow' ? 'hover:shadow-lg' : 
                      theme.settings.hoverEffect === 'glow' ? 'hover:shadow-xl hover:shadow-orange-200' : '';
  
  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden group transition-all duration-200 ${hoverEffect}`}
      style={{ borderRadius }}
    >
      <div className="relative">
        <div className={`${product.bg} aspect-square flex items-center justify-center text-7xl`}>
          {product.emoji}
        </div>
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${product.badge.cls}`}>
            {product.badge.label}
          </span>
        )}
        <button
          onClick={() => setWished(!wished)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all
            ${wished ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100"}`}
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>
      <div className="p-4">
        <div 
          className="text-xs font-semibold mb-1"
          style={{ color: theme.settings.primaryColor }}
        >
          {product.brand}
        </div>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars n={product.rating} />
          <span className="text-xs text-gray-400">({toBn(product.rc)})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{TK}{toBn(product.price)}</span>
            {product.old && <span className="text-xs text-gray-400 line-through ml-1.5">{TK}{toBn(product.old)}</span>}
          </div>
          <button
            onClick={handleAdd}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all
              ${added ? "bg-emerald-500 text-white scale-95" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white"}`}
          >
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}