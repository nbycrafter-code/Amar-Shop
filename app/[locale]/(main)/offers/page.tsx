import { getCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { getProductsByBadge } from "@/queries/products";
import { getSetting } from "@/queries/settings";

const OffersPage = async ({ }) => {
  const settings = await getSetting();

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
      settings={settings}
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      products={products}
    />
  );
};

export default OffersPage;
