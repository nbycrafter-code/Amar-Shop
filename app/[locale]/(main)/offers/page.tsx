import { getCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { getProductsByBadge } from "@/queries/products";

const OffersPage = async ({ }) => {

  const [categories, brands, sizes, colors, products] =
    await Promise.all([
      getCategories(),
      getBrands(),
      getSizes(),
      getColors(),
      getProductsByBadge('sale'),
    ]);
    

  return (
    // <>Check: {categorySlug} : {categorySearch}</>
    <PageSet
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      products={products}
    />
  );
};

export default OffersPage;
