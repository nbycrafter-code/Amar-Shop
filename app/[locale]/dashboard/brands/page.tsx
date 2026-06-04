import { getAllBrands } from "@/queries/brands";
import { PageSet } from "./PageSet";

const BrandPage = async() => {

  const brandsResponse = await getAllBrands();

  return (
    <PageSet brandsData={brandsResponse} />
  );
};

export default BrandPage;