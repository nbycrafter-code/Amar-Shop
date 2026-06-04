'use client'
import { ProductCard } from "../components/ProductCard";

const SearchPage = () => {
//   const location = useLocation();
//   const term = new URLSearchParams(location.search).get("search")?.toLowerCase() ?? "";
//   const filtered = products.filter((p) => p.name.toLowerCase().includes(term));
  return (
    <div className="bg-[#f3f3f3] py-8">
      {/* <div className="container mx-auto w-full px-4">
        <h1 className="text-4xl text-[44px] font-semibold">Search Results</h1>
        <p className="mt-2 text-sm text-gray-500">Found {filtered.length} products for "{term}"</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {filtered.map((p) => <ProductCard key={p.id} product={p} compact />)}
        </div>
      </div> */}
    </div>
  );
};


export default SearchPage;