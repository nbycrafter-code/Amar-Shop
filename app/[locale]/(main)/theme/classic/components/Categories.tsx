// app/theme/classic/components/Categories.tsx
'use client'
interface CategoriesProps {
  theme: any;
}

const categories = [
  { emoji: "🐕", name: "কুকুর", count: "৫৮০+" },
  { emoji: "🐈", name: "বিড়াল", count: "৪২০+" },
  { emoji: "🐟", name: "মাছ", count: "৩১০+" },
  { emoji: "🐦", name: "পাখি", count: "২৪০+" },
  { emoji: "🐰", name: "খরগোশ", count: "১৮০+" },
  { emoji: "🐹", name: "হ্যামস্টার", count: "১২০+" },
  { emoji: "🦎", name: "রেপটাইল", count: "৯০+" },
  { emoji: "🐾", name: "সব পণ্য", count: "২০০০+" },
];

export function Categories({ theme }: CategoriesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.settings.primaryColor }}>
            কী খুঁজছেন?
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            পোষা প্রাণীর <em className="not-italic" style={{ color: theme.settings.primaryColor }}>ধরন বেছে নিন</em>
          </h2>
        </div>
        <a href="#" className="text-sm font-semibold transition-colors" style={{ color: theme.settings.primaryColor }}>
          সব ক্যাটাগরি →
        </a>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {categories.map((c) => (
          <a
            key={c.name}
            href="#"
            className="bg-white border border-gray-100 rounded-2xl p-4 text-center flex flex-col items-center gap-1.5 hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md transition-all group"
          >
            <span className="text-4xl group-hover:scale-110 group-hover:-rotate-6 transition-transform inline-block">{c.emoji}</span>
            <b className="text-sm text-gray-800">{c.name}</b>
            <small className="text-xs text-gray-400">{c.count} পণ্য</small>
          </a>
        ))}
      </div>
    </section>
  );
}