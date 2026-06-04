//page.tsx
import { getAllProducts } from "@/queries/products";
import { getCategories } from "@/queries/categories";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import AddForm from "../components/AddForm";

const ProductAddPage = async () => {
  const productsResponse = await getAllProducts();
  const categoriesResponse = await getCategories();
  const brandsResponse = await getBrands();
  const sizesResponse = await getSizes();
  const colorsResponse = await getColors();
  return (
    <AddForm
      products={productsResponse}
      categories={categoriesResponse}
      brands={brandsResponse}
      sizes={sizesResponse}
      colors={colorsResponse}
    />
  );
};

export default ProductAddPage;
