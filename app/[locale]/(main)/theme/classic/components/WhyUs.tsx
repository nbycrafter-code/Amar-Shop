// app/theme/classic/components/WhyUs.tsx
'use client'
interface WhyUsProps {
  theme: any;
}

const whys = [
  { icon: "🚚", bg: "bg-emerald-50", title: "দ্রুত ডেলিভারি", desc: "ঢাকায় ২৪ ঘণ্টায়, সারাদেশে ৪৮–৭২ ঘণ্টায় ঘরে পৌঁছে যায়।" },
  { icon: "✅", bg: "bg-orange-50", title: "অরিজিনাল পণ্য", desc: "সরাসরি অফিসিয়াল ডিস্ট্রিবিউটর থেকে সংগ্রহ করা পণ্য।" },
  { icon: "💰", bg: "bg-amber-50", title: "সেরা দাম", desc: "বাজারের তুলনায় সেরা মূল্য আর নিয়মিত ডিসকাউন্ট অফার।" },
  { icon: "🩺", bg: "bg-sky-50", title: "ভেট পরামর্শ", desc: "আমাদের ভেটেরিনারি টিম সবসময় বিনামূল্যে পরামর্শ দিতে প্রস্তুত।" },
];

export function WhyUs({ theme }: WhyUsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: theme.settings.primaryColor }}>
          কেন আমরা?
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          কেন <em className="not-italic" style={{ color: theme.settings.primaryColor }}>PetShop.com.bd</em> বেছে নেবেন
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {whys.map((w) => (
          <div key={w.title} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all">
            <div className={`w-14 h-14 ${w.bg} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>{w.icon}</div>
            <b className="text-base font-bold text-gray-900 block mb-2">{w.title}</b>
            <p className="text-sm text-gray-500 leading-relaxed">{w.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}