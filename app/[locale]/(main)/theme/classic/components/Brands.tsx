// app/theme/classic/components/Brands.tsx
'use client'
interface BrandsProps {
  theme: any;
}

const brands = ["Royal Canin", "Pedigree", "Whiskas", "Hill's Science", "Purina", "Tetra", "Kong", "Catit", "Versele-Laga", "Frontline", "Sheba", "Dr. Elsey's"];

export function Brands({ theme }: BrandsProps) {
  return (
    <section className="bg-white border-y border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">বিশ্বস্ত পার্টনার</div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            আমাদের <em className="not-italic" style={{ color: theme.settings.primaryColor }}>ব্র্যান্ড</em>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {brands.map((b) => (
            <span 
              key={b} 
              className="px-5 py-2.5 border-2 border-gray-100 rounded-full font-bold text-sm text-gray-400 bg-gray-50 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}