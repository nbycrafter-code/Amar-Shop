//page.tsx
import { getAllProducts } from "@/queries/products";
import { PageSet } from "./PageSet";

const ProductPage = async () => {
  const products = await getAllProducts();
  return (
    <PageSet
      products={products}
    /> 
  );
};

export default ProductPage;
