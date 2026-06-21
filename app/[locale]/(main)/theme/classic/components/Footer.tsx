// app/theme/classic/components/Footer.tsx
'use client'
interface FooterProps {
  theme: any;
}

export function Footer({ theme }: FooterProps) {
  return (
    <footer className="text-gray-300 pt-14 pb-8" style={{ backgroundColor: theme.settings.footerBackground }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="font-extrabold text-lg text-white">PetShop.com.bd</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">বাংলাদেশের পোষা প্রাণী প্রেমীদের জন্য সবচেয়ে বড় অনলাইন পেট শপ।</p>
            <div className="flex gap-2">
              {["f", "◎", "▶", "✆"].map((s, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white rounded-full flex items-center justify-center text-sm transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">কেনাকাটা</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["কুকুরের পণ্য", "বিড়ালের পণ্য", "মাছের পণ্য", "পাখির পণ্য", "অফার ও ডিল"].map((l) => (
                <li key={l}><a href="#" className="hover:text-emerald-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">সহায়তা</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["আমাদের সম্পর্কে", "ডেলিভারি তথ্য", "রিটার্ন পলিসি", "অর্ডার ট্র্যাক", "যোগাযোগ"].map((l) => (
                <li key={l}><a href="#" className="hover:text-emerald-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">যোগাযোগ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📞 ০১৭০০-০০০০০০</li>
              <li>✉ info@petshop.com.bd</li>
              <li>📍 ধানমন্ডি, ঢাকা ১২০৫</li>
              <li>⏰ সকাল ৯টা – রাত ১০টা</li>
            </ul>
            <div className="flex flex-wrap gap-2 mt-4">
              {["bKash", "Nagad", "Rocket", "VISA"].map((b) => (
                <span key={b} className="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-lg">{b}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
          <span>© ২০২৫ PetShop.com.bd — সর্বস্বত্ব সংরক্ষিত</span>
          <span>ট্রেড লাইসেন্স: DHAKA/2025/PET-00482</span>
        </div>
      </div>
    </footer>
  );
}