// app/theme/classic/components/Newsletter.tsx
'use client'
interface NewsletterProps {
  theme: any;
}

export function Newsletter({ theme }: NewsletterProps) {
  return (
    <section className="py-14 mt-2" style={{ background: `linear-gradient(to bottom right, ${theme.settings.gradientStart}, ${theme.settings.gradientEnd})` }}>
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-6">
        <span className="text-5xl flex-shrink-0">🐾</span>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-2xl font-extrabold text-white mb-1">নতুন অফার সবার আগে পান</h2>
          <p className="text-emerald-200 text-sm">নিউজলেটারে সাইন আপ করুন — নতুন পণ্য, অফার ও যত্নের টিপস ইমেইলে পৌঁছে যাবে।</p>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
          <input
            type="email"
            placeholder="আপনার ইমেইল লিখুন…"
            className="flex-1 sm:w-64 bg-white/10 border border-white/20 text-white placeholder-emerald-300 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white/20 transition-all"
          />
          <button className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold px-5 py-3 rounded-xl text-sm transition-colors flex-shrink-0">
            সাবস্ক্রাইব
          </button>
        </div>
      </div>
    </section>
  );
}