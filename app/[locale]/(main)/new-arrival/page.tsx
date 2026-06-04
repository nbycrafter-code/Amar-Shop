import { getCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { getNewArrivals } from "@/queries/products";

const NewArrivalPage = async ({ }) => {

  const [categories, brands, sizes, colors, products] =
    await Promise.all([
      getCategories(),
      getBrands(),
      getSizes(),
      getColors(),
      getNewArrivals(),
    ]);
    

  return (
    // <>Check: {categorySlug} : {categorySearch}</>
    <PageSet
      type="new-arrivals"
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      products={products}
    />
  );
};

export default NewArrivalPage;
