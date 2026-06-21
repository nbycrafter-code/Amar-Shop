// app/theme/classic/data/products.ts
export const TK = "৳ ";

export function toBn(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
}

export const PRODUCTS = [
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