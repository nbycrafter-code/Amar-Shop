// app/theme/classic/components/PromoBanners.tsx
'use client'
interface PromoBannersProps {
  theme: any;
}

export function PromoBanners({ theme }: PromoBannersProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <a href="#" className="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-3xl p-8 flex items-center gap-6 overflow-hidden relative group hover:shadow-xl transition-shadow">
          <div className="flex-1 text-white z-10">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">গ্রুমিং কালেকশন</span>
            <h3 className="text-2xl font-extrabold mb-2 leading-tight">ডগ গ্রুমিং কিট<br />নতুন এসেছে</h3>
            <p className="text-emerald-100 text-sm mb-4">ব্রাশ, শ্যাম্পু ও নেইল ক্লিপার সেট — পেশাদার যত্ন ঘরেই।</p>
            <span className="inline-block bg-white text-emerald-700 text-sm font-bold px-4 py-2 rounded-lg group-hover:bg-emerald-50 transition-colors">এখনই দেখুন →</span>
          </div>
          <div className="flex-shrink-0 w-28 h-28 bg-white/15 rounded-2xl flex items-center justify-center text-6xl">🛁</div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
        </a>
        <a href="#" className="bg-gradient-to-br from-orange-500 to-red-400 rounded-3xl p-8 flex items-center gap-6 overflow-hidden relative group hover:shadow-xl transition-shadow">
          <div className="flex-1 text-white z-10">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">সীমিত সময়ের অফার</span>
            <h3 className="text-2xl font-extrabold mb-2 leading-tight">ক্যাট ফুডে<br />৩০% পর্যন্ত ছাড়</h3>
            <p className="text-orange-100 text-sm mb-4">সিলেক্টেড ব্র্যান্ডের ক্যাট ফুড ও অ্যাক্সেসরিজে বিশেষ ছাড়।</p>
            <span className="inline-block bg-white text-orange-600 text-sm font-bold px-4 py-2 rounded-lg group-hover:bg-orange-50 transition-colors">অফার দেখুন →</span>
          </div>
          <div className="flex-shrink-0 w-28 h-28 bg-white/15 rounded-2xl flex items-center justify-center text-6xl">🐈</div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
        </a>
      </div>
    </section>
  );
}