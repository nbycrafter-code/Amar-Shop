import { getAllProducts } from "@/queries/products";
import { PageSet } from "./PageSet";
import { getCategories } from "@/queries/categories";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { initialBrands, initialCategories, initialColors, initialProducts, initialSizes } from "../data/initialData";

const ProductPage = async () => {
  // const productsResponse = await getAllProducts();
  // const categoriesResponse = await getCategories();
  // const brandsResponse = await getBrands();
  // const sizesResponse = await getSizes();
  // const colorsResponse = await getColors();
  return (
    <PageSet
      productsResponse={initialProducts}
      categoriesResponse={initialCategories}
      brandsResponse={initialBrands}
      sizesResponse={initialSizes}
      colorsResponse={initialColors}
    />
  );
};

export default ProductPage;
