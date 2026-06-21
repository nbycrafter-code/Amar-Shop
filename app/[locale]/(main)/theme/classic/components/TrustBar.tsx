// app/theme/classic/components/TrustBar.tsx
'use client'
interface TrustBarProps {
  theme: any;
}

const trusts = [
  { icon: "🚚", title: "সারাদেশে ডেলিভারি", sub: "২৪–৭২ ঘণ্টায়" },
  { icon: "✅", title: "১০০% অরিজিনাল", sub: "অফিসিয়াল পণ্য" },
  { icon: "💵", title: "ক্যাশ অন ডেলিভারি", sub: "হাতে পেয়ে পেমেন্ট" },
  { icon: "↩️", title: "৭ দিনের রিটার্ন", sub: "সহজ রিটার্ন পলিসি" },
  { icon: "🎧", title: "২৪/৭ সাপোর্ট", sub: "সবসময় পাশে" },
];

export function TrustBar({ theme }: TrustBarProps) {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between flex-wrap py-5 gap-4">
          {trusts.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <div className="text-sm font-semibold text-gray-800">{t.title}</div>
                <div className="text-xs text-gray-400">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}