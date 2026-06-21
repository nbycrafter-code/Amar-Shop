// app/theme/classic/components/Blog.tsx
'use client'
interface BlogProps {
  theme: any;
}

const blogs = [
  { emoji: "🐕", cat: "কুকুর", catCls: "bg-emerald-100 text-emerald-700", title: "গরমে কুকুরের সঠিক যত্ন কীভাবে নেবেন?", date: "১৫ মে, ২০২৫", read: "৫ মিনিট পড়া", bg: "bg-emerald-50" },
  { emoji: "🐈", cat: "বিড়াল", catCls: "bg-orange-100 text-orange-700", title: "বিড়ালের খাদ্যতালিকা: বয়স অনুযায়ী গাইড", date: "১০ মে, ২০২৫", read: "৭ মিনিট পড়া", bg: "bg-orange-50" },
  { emoji: "🐟", cat: "মাছ", catCls: "bg-sky-100 text-sky-700", title: "অ্যাকুয়ারিয়াম শুরু করতে কী কী লাগে?", date: "৫ মে, ২০২৫", read: "৬ মিনিট পড়া", bg: "bg-sky-50" },
];

export function Blog({ theme }: BlogProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.settings.primaryColor }}>
            🐾 যত্ন গাইড
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            পোষা প্রাণীর <em className="not-italic" style={{ color: theme.settings.primaryColor }}>টিপস</em>
          </h2>
        </div>
        <a href="#" className="text-sm font-semibold transition-colors" style={{ color: theme.settings.primaryColor }}>
          সব আর্টিকেল →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {blogs.map((b) => (
          <article key={b.title} className="bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
            <div className={`${b.bg} aspect-video flex items-center justify-center text-6xl`}>{b.emoji}</div>
            <div className="p-5">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${b.catCls}`}>{b.cat}</span>
              <h3 className="text-base font-bold text-gray-800 mt-3 mb-2 leading-snug group-hover:text-emerald-700 transition-colors">{b.title}</h3>
              <div className="text-xs text-gray-400">{b.date} · {b.read}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}