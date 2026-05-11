import { getAllBrands } from "@/queries/brands";
import { PageSet } from "./PageSet";
import { initialBrands } from "../data/initialData";

const BrandPage = async() => {

  // const brandsResponse = await getAllBrands();

  return (
    <PageSet brandsData={initialBrands} />
  );
};

export default BrandPage;