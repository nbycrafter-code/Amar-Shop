// app/brands/page.tsx
import { getBrands } from "@/queries/brands";
import { PageSet } from "./PageSet";

const BrandsPage = async () => {
  const brands = await getBrands();

  return (
    <PageSet brands={brands} />
  );
};

export default BrandsPage;