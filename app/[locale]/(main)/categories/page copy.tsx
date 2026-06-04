import { getCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { getProducts } from "@/queries/products";

const SearchPage = async({searchParams}) => {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category;
  const categorySearch = resolvedParams.search?.toLowerCase() ?? "";
  console.log("=========================================");
  console.log("=========================================");
  console.log(categorySlug);

    const [categories, brands, sizes, colors, products] =
      await Promise.all([
        getCategories(),
        getBrands(),
        getSizes(),
        getColors(),
        getProducts(),
      ]);

  return (
    // <>Check: {categorySlug} : {categorySearch}</>
    <PageSet 
      category={categorySlug} 
      searchTerm={categorySearch} 
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      products={products} />
  );
};

export default SearchPage;
