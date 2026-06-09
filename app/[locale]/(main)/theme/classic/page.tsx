'use client'
import { useState } from "react";

const TK = "৳ ";
function toBn(n) {
  return String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
}

const PRODUCTS = [
  { id: 1, brand: "Royal Canin", name: "Adult Dog Food — Medium Breed ৪kg", price: 3250, old: 3800, rating: 5, rc: 248, emoji: "🐕", bg: "bg-emerald-50", badge: { cls: "bg-red-500 text-white", label: "HOT" } },
  { id: 2, brand: "Whiskas", name: "Cat Wet Food Ocean Fish — ১২ Pack", price: 850, old: 1100, rating: 4, rc: 185, emoji: "🐈", bg: "bg-orange-50", badge: { cls: "bg-orange-500 text-white", label: "SALE" } },
  { id: 3, brand: "Kong", name: "Dog Chew Toy — Durable Rubber XL", price: 1450, old: 1700, rating: 5, rc: 97, emoji: "🦴", bg: "bg-emerald-50", badge: { cls: "bg-emerald-600 text-white", label: "বেস্ট" } },
  { id: 4, brand: "Catit", name: "Senses 2.0 Cat Digger Play Circuit", price: 1890, old: 2500, rating: 5, rc: 114, emoji: "🐈", bg: "bg-orange-50", badge: { cls: "bg-orange-500 text-white", label: "-২৫%" } },
  { id: 5, brand: "Pedigree", name: "Puppy Dry Food Chicken & Milk ৩kg", price: 1320, old: 1550, rating: 4, rc: 206, emoji: "🐕", bg: "bg-emerald-50", badge: null },
  { id: 6, brand: "Sheba", name: "Premium Cat Food Tuna Tin — ৬ Pack", price: 990, old: null, rating: 5, rc: 73, emoji: "🐟", bg: "bg-sky-50", badge: { cls: "bg-sky-500 text-white", label: "NEW" } },
  { id: 7, brand: "Tetra", name: "TetraMin Tropical Fish Flakes ২০০g", price: 580, old: null, rating: 5, rc: 32, emoji: "🐟", bg: "bg-sky-50", badge: { cls: "bg-sky-500 text-white", label: "NEW" } },
  { id: 8, brand: "Versele-Laga", name: "Budgie & Parrot Premium Seed Mix ১kg", price: 420, old: null, rating: 4, rc: 63, emoji: "🐦", bg: "bg-sky-50", badge: null },
  { id: 9, brand: "Frontline", name: "Plus Flea & Tick Spot-On for Dogs", price: 1150, old: 1400, rating: 5, rc: 158, emoji: "💊", bg: "bg-emerald-50", badge: { cls: "bg-orange-500 text-white", label: "SALE" } },
  { id: 10, brand: "Hill's Science", name: "Adult Cat Indoor Dry Food ২kg", price: 2680, old: null, rating: 5, rc: 88, emoji: "🐈", bg: "bg-orange-50", badge: { cls: "bg-sky-500 text-white", label: "NEW" } },
];

function Stars({ n }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(n)}
      <span className="text-gray-300">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function ProductCard({ p }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { setAdded(true); setTimeout(() => setAdded(false), 1200); };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="relative">
        <div className={`${p.bg} aspect-square flex items-center justify-center text-7xl`}>
          {p.emoji}
        </div>
        {p.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.badge.cls}`}>
            {p.badge.label}
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
        <div className="text-xs text-emerald-600 font-semibold mb-1">{p.brand}</div>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">{p.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars n={p.rating} />
          <span className="text-xs text-gray-400">({toBn(p.rc)})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{TK}{toBn(p.price)}</span>
            {p.old && <span className="text-xs text-gray-400 line-through ml-1.5">{TK}{toBn(p.old)}</span>}
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

export default function PetShop() {
  const [cartCount, setCartCount] = useState(3);
  const [wishCount] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const trusts = [
    { icon: "🚚", title: "সারাদেশে ডেলিভারি", sub: "২৪–৭২ ঘণ্টায়" },
    { icon: "✅", title: "১০০% অরিজিনাল", sub: "অফিসিয়াল পণ্য" },
    { icon: "💵", title: "ক্যাশ অন ডেলিভারি", sub: "হাতে পেয়ে পেমেন্ট" },
    { icon: "↩️", title: "৭ দিনের রিটার্ন", sub: "সহজ রিটার্ন পলিসি" },
    { icon: "🎧", title: "২৪/৭ সাপোর্ট", sub: "সবসময় পাশে" },
  ];

  const whys = [
    { icon: "🚚", bg: "bg-emerald-50", title: "দ্রুত ডেলিভারি", desc: "ঢাকায় ২৪ ঘণ্টায়, সারাদেশে ৪৮–৭২ ঘণ্টায় ঘরে পৌঁছে যায়।" },
    { icon: "✅", bg: "bg-orange-50", title: "অরিজিনাল পণ্য", desc: "সরাসরি অফিসিয়াল ডিস্ট্রিবিউটর থেকে সংগ্রহ করা পণ্য।" },
    { icon: "💰", bg: "bg-amber-50", title: "সেরা দাম", desc: "বাজারের তুলনায় সেরা মূল্য আর নিয়মিত ডিসকাউন্ট অফার।" },
    { icon: "🩺", bg: "bg-sky-50", title: "ভেট পরামর্শ", desc: "আমাদের ভেটেরিনারি টিম সবসময় বিনামূল্যে পরামর্শ দিতে প্রস্তুত।" },
  ];

  const blogs = [
    { emoji: "🐕", cat: "কুকুর", catCls: "bg-emerald-100 text-emerald-700", title: "গরমে কুকুরের সঠিক যত্ন কীভাবে নেবেন?", date: "১৫ মে, ২০২৫", read: "৫ মিনিট পড়া", bg: "bg-emerald-50" },
    { emoji: "🐈", cat: "বিড়াল", catCls: "bg-orange-100 text-orange-700", title: "বিড়ালের খাদ্যতালিকা: বয়স অনুযায়ী গাইড", date: "১০ মে, ২০২৫", read: "৭ মিনিট পড়া", bg: "bg-orange-50" },
    { emoji: "🐟", cat: "মাছ", catCls: "bg-sky-100 text-sky-700", title: "অ্যাকুয়ারিয়াম শুরু করতে কী কী লাগে?", date: "৫ মে, ২০২৫", read: "৬ মিনিট পড়া", bg: "bg-sky-50" },
  ];

  const brands = ["Royal Canin", "Pedigree", "Whiskas", "Hill's Science", "Purina", "Tetra", "Kong", "Catit", "Versele-Laga", "Frontline", "Sheba", "Dr. Elsey's"];

  const navItems = [
    { emoji: "🐕", label: "কুকুর" }, { emoji: "🐈", label: "বিড়াল" }, { emoji: "🐟", label: "মাছ" },
    { emoji: "🐦", label: "পাখি" }, { emoji: "🐰", label: "ছোট প্রাণী" }, { emoji: "💊", label: "স্বাস্থ্য ও যত্ন" },
    { emoji: "🛁", label: "গ্রুমিং" }, { emoji: "🏷️", label: "অফার", special: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Top Bar */}
      <div className="bg-emerald-700 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-4 flex-wrap">
          <p className="text-emerald-100 text-xs font-medium tracking-wide">
            🐾 সারাদেশে দ্রুত ডেলিভারি · ৳১৫০০+ অর্ডারে ফ্রি শিপিং · ক্যাশ অন ডেলিভারি সুবিধা
          </p>
          <div className="flex items-center gap-4 text-xs text-emerald-100">
            <a href="#" className="hover:text-white transition-colors">📞 ০১৭০০-০০০০০০</a>
            <a href="#" className="hover:text-white transition-colors">📍 অর্ডার ট্র্যাক</a>
            <span className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-full cursor-pointer transition-colors">বাংলা ▾</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-3xl">🐾</span>
            <div>
              <div className="font-extrabold text-xl leading-tight text-gray-900">
                PetShop<span className="text-orange-500">.com.bd</span>
              </div>
              <div className="text-xs text-gray-400 leading-tight">বাংলাদেশের পোষা প্রাণীর দোকান</div>
            </div>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-transparent focus-within:border-emerald-400 focus-within:bg-white transition-all">
              <input
                type="search"
                placeholder="কুকুর, বিড়াল, মাছের খাবার বা পণ্য খুঁজুন…"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-lg transition-colors">⌕</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="#" className="hidden md:flex flex-col leading-tight text-right mr-1">
              <span className="text-xs text-gray-400">লগইন / সাইনআপ</span>
              <span className="text-sm font-semibold text-gray-800">আমার অ্যাকাউন্ট</span>
            </a>
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-xl">
              👤
            </button>
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-xl">
              ❤
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">{toBn(wishCount)}</span>
            </button>
            <button
              onClick={() => setCartCount(c => c + 1)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-xl"
            >
              🛒
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">{toBn(cartCount)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-none hover:bg-emerald-700 transition-colors">
              ☰ সব ক্যাটাগরি
            </button>
            {navItems.map((item, i) => (
              <a
                key={i}
                href="#"
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2
                  ${i === 0 ? "border-emerald-500 text-emerald-700" : "border-transparent text-gray-600 hover:text-emerald-600 hover:border-emerald-300"}
                  ${item.special ? "text-orange-600 hover:text-orange-700" : ""}`}
              >
                <span>{item.emoji}</span> {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-50 via-white to-orange-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm mb-5">
                🇧🇩 বাংলাদেশের জন্য তৈরি
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                আপনার প্রিয় পোষা প্রাণীর জন্য{" "}
                <em className="not-italic text-emerald-600">সেরা যত্ন</em>, এক জায়গায়
              </h1>
              <p className="text-gray-500 text-lg mb-7 max-w-lg leading-relaxed">
                খাবার, খেলনা, ওষুধ আর গ্রুমিং — সব পাবেন একসাথে। ১০০% অরিজিনাল পণ্য, সারাদেশে দ্রুত ডেলিভারি আর ক্যাশ অন ডেলিভারির নিশ্চয়তা।
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <a href="#" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm">
                  এখনই কেনাকাটা করুন →
                </a>
                <a href="#" className="border-2 border-emerald-200 hover:border-emerald-400 text-emerald-700 font-bold px-7 py-3.5 rounded-xl transition-all text-sm bg-white hover:bg-emerald-50">
                  অফার দেখুন
                </a>
              </div>
              <div className="flex gap-8">
                {[["২,০০০+", "পণ্য"], ["৫০+", "ব্র্যান্ড"], ["১৫,০০০+", "খুশি গ্রাহক"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="text-2xl font-extrabold text-emerald-700">{val}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-amber-200 rounded-full opacity-30 -z-0"></div>
              <div className="relative z-10 bg-emerald-100 rounded-3xl aspect-square flex items-center justify-center shadow-xl">
                <span className="text-[140px] leading-none">🐕</span>
              </div>
              <div className="absolute top-4 -left-8 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <div className="text-sm font-bold text-gray-800">২৪ ঘণ্টায়</div>
                  <div className="text-xs text-gray-400">ঢাকায় ডেলিভারি</div>
                </div>
              </div>
              <div className="absolute bottom-6 -right-6 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">⭐ ৪.৯</span>
                <div>
                  <div className="text-sm font-bold text-gray-800">রেটিং</div>
                  <div className="text-xs text-gray-400">৮,০০০+ রিভিউ</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
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

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">কী খুঁজছেন?</div>
              <h2 className="text-2xl font-extrabold text-gray-900">পোষা প্রাণীর <em className="not-italic text-emerald-600">ধরন বেছে নিন</em></h2>
            </div>
            <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">সব ক্যাটাগরি →</a>
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

        {/* Best Sellers */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">🔥 এই সপ্তাহের জনপ্রিয়</div>
              <h2 className="text-2xl font-extrabold text-gray-900">সেরা <em className="not-italic text-emerald-600">বিক্রিত পণ্য</em></h2>
            </div>
            <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">সব দেখুন →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PRODUCTS.slice(0, 5).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* Promo Banners */}
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

        {/* New Arrivals */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">✨ সদ্য আসা</div>
              <h2 className="text-2xl font-extrabold text-gray-900">নতুন <em className="not-italic text-emerald-600">কালেকশন</em></h2>
            </div>
            <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">সব দেখুন →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PRODUCTS.slice(5, 10).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* Brands */}
        <section className="bg-white border-y border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">বিশ্বস্ত পার্টনার</div>
              <h2 className="text-2xl font-extrabold text-gray-900">আমাদের <em className="not-italic text-emerald-600">ব্র্যান্ড</em></h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {brands.map((b) => (
                <span key={b} className="px-5 py-2.5 border-2 border-gray-100 rounded-full font-bold text-sm text-gray-400 bg-gray-50 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 hover:-translate-y-0.5 transition-all cursor-pointer">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">কেন আমরা?</div>
            <h2 className="text-2xl font-extrabold text-gray-900">কেন <em className="not-italic text-emerald-600">PetShop.com.bd</em> বেছে নেবেন</h2>
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

        {/* Blog */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-end justify-between mb-7">
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">🐾 যত্ন গাইড</div>
              <h2 className="text-2xl font-extrabold text-gray-900">পোষা প্রাণীর <em className="not-italic text-emerald-600">টিপস</em></h2>
            </div>
            <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">সব আর্টিকেল →</a>
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

        {/* Newsletter */}
        <section className="bg-gradient-to-br from-emerald-800 to-emerald-600 py-14 mt-2">
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
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
    </div>
  );
}